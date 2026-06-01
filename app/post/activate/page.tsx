"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import AccountUnavailable from "@/components/auth/AccountUnavailable";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import { parseActivateListing, type ActivateListing } from "@/lib/activate-listing";
import { mapCallableError } from "@/lib/auth-errors";
import {
  createPayPalOrderForListing,
  createRazorpayOrderForListing,
} from "@/lib/callable-functions";
import { callHttpsFunction } from "@/lib/firebase-callable";
import { getClientDb } from "@/lib/firebase-client";
import {
  fetchResolvedListingPlans,
  resolveFreePlanEligibility,
  type ListingPlanRow,
  type ListingPlanTier,
} from "@/lib/listing-plans";
import { CallableError } from "@/lib/firebase-callable";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { trackEvent } from "@/lib/ga4";

const ACTIVATION_TIMEOUT_MS = 90_000;
const ACTIVATION_FLOW_VERSION = "2026-05-post-activate-v1";
const ACTIVATION_BATCH = 76;
const ACTIVATION_DATA_SOURCE = "client_live";
const ACTIVATION_SCHEMA_FIELDS =
  "activation_flow_version|activation_batch|activation_data_source|activation_context_complete|activation_phase|activation_event_group|activation_path|retry_channel|availability_state|visible_plan_count|has_multiple_plans";

type Plan = ListingPlanRow;

type ActivateStatus = "missing" | "forbidden" | "live";

function dwellBucket(elapsedSeconds: number): "lt_10s" | "10_to_30s" | "30_to_60s" | "gte_60s" {
  if (elapsedSeconds < 10) return "lt_10s";
  if (elapsedSeconds < 30) return "10_to_30s";
  if (elapsedSeconds < 60) return "30_to_60s";
  return "gte_60s";
}

function findPlanPosition(plans: Plan[], planId: string): number {
  const index = plans.findIndex((plan) => plan.id === planId);
  return index >= 0 ? index + 1 : 0;
}

function planSignature(plan: Plan | undefined): string {
  if (!plan) return "unknown";
  return `${plan.price}_${plan.currency}_${plan.durationDays}d`;
}

interface CheckoutAttemptMeta {
  sessionAttempt: number;
  planAttempt: number;
}

type ActivationPhase =
  | "entry"
  | "availability"
  | "selection"
  | "checkout"
  | "wait"
  | "outcome"
  | "exit";

type ActivationEventGroup =
  | "entry"
  | "availability"
  | "selection"
  | "payment"
  | "retry"
  | "outcome"
  | "navigation";

type ActivationPath = "normal" | "plan_retry" | "wait_retry" | "guardrail";

function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingIdParam = searchParams.get("listingId") || "";
  const { user, profile, loading: authLoading, profileError, isBlocked, refreshProfile } =
    useAuth();

  const [listing, setListing] = useState<ActivateListing | null>(null);
  const [listingStatus, setListingStatus] = useState<
    "loading" | "missing" | "forbidden" | "ready"
  >("loading");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansStatus, setPlansStatus] = useState<"loading" | "ready" | "empty" | "error">(
    "loading"
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [waitingActivation, setWaitingActivation] = useState(false);
  const [activationTimedOut, setActivationTimedOut] = useState(false);
  const [trackedViewed, setTrackedViewed] = useState(false);
  const [trackedSchemaSummary, setTrackedSchemaSummary] = useState(false);
  const [trackedPlansLoaded, setTrackedPlansLoaded] = useState(false);
  const [trackedPlansShown, setTrackedPlansShown] = useState(false);
  const [trackedTimeout, setTrackedTimeout] = useState(false);
  const [trackedStatuses, setTrackedStatuses] = useState<ActivateStatus[]>([]);
  const [trackedMissingId, setTrackedMissingId] = useState(false);
  const [trackedPlansEmpty, setTrackedPlansEmpty] = useState(false);
  const [trackedPlansError, setTrackedPlansError] = useState(false);
  const [plansRetryCount, setPlansRetryCount] = useState(0);
  const [awaitingRetryOutcome, setAwaitingRetryOutcome] = useState(false);
  const [waitRetryCount, setWaitRetryCount] = useState(0);
  const [hadWaitTimeout, setHadWaitTimeout] = useState(false);
  const [trackedWaitResolved, setTrackedWaitResolved] = useState(false);
  // One-shot guard: the listing snapshot fires repeatedly while active, so the
  // activation-resolved block (conversion events + redirect) must run only once.
  const activationHandledRef = useRef(false);
  const activateViewStartedAtRef = useRef<number>(Date.now());
  const checkoutAttemptsRef = useRef(0);
  const planAttemptCountsRef = useRef<Record<string, number>>({});
  const lastCheckoutAttemptRef = useRef<CheckoutAttemptMeta | null>(null);
  const lastCheckoutPlanSignatureRef = useRef("unknown");
  const lastCheckoutPlanPositionRef = useRef(0);
  const trackedReturnVisitRef = useRef(false);
  const latestCanPayRef = useRef(false);
  const latestListingIdRef = useRef("");
  const listingSubscribeKeyRef = useRef<string | null>(null);
  const plansLoadedKeyRef = useRef<string | null>(null);
  const resolvedTierRef = useRef<ListingPlanTier>("global");
  const resolvedTargetIsoRef = useRef("IN");
  const resolvedCityCodeRef = useRef<string | null>(null);
  /** Set from Firestore snapshot — authoritative id for payment callables. */
  const firestoreListingIdRef = useRef("");
  const waitingActivationRef = useRef(waitingActivation);
  const plansStatusRef = useRef(plansStatus);
  const plansRef = useRef(plans);
  const plansRetryCountRef = useRef(plansRetryCount);
  const waitRetryCountRef = useRef(waitRetryCount);
  const hadWaitTimeoutRef = useRef(hadWaitTimeout);
  const trackedWaitResolvedRef = useRef(trackedWaitResolved);
  const usePayPalRef = useRef(false);

  const homeIso = profile?.homeIso || "IN";
  const usePayPal = homeIso !== "IN" && homeIso !== "IND";
  /** URL param or Firestore doc id — URL can be missing while draft state is still loaded. */
  const activeListingId = listingIdParam.trim() || listing?.id || "";
  const isOwner = Boolean(user && listing && listing.ownerUid === user.uid);
  const canPay = isOwner && listing && !listing.isActive;

  useEffect(() => {
    latestCanPayRef.current = Boolean(canPay);
    latestListingIdRef.current = activeListingId;
  }, [activeListingId, canPay]);

  useEffect(() => {
    if (!listing?.id || listingIdParam.trim() === listing.id) return;
    if (!listingIdParam.trim()) {
      router.replace(appPath(`/post/activate?listingId=${listing.id}`), { scroll: false });
    }
  }, [listing?.id, listingIdParam, router]);

  useEffect(() => {
    waitingActivationRef.current = waitingActivation;
    plansStatusRef.current = plansStatus;
    plansRef.current = plans;
    plansRetryCountRef.current = plansRetryCount;
    waitRetryCountRef.current = waitRetryCount;
    hadWaitTimeoutRef.current = hadWaitTimeout;
    trackedWaitResolvedRef.current = trackedWaitResolved;
    usePayPalRef.current = usePayPal;
  }, [
    waitingActivation,
    plansStatus,
    plans,
    plansRetryCount,
    waitRetryCount,
    hadWaitTimeout,
    trackedWaitResolved,
    usePayPal,
  ]);

  function getDwellMeta() {
    const elapsedSeconds = Math.max(
      0,
      Math.round((Date.now() - activateViewStartedAtRef.current) / 1000)
    );
    return {
      dwell_seconds: elapsedSeconds,
      dwell_bucket: dwellBucket(elapsedSeconds),
    };
  }

  function planContextMeta() {
    return {
      visible_plan_count: plans.length,
      has_multiple_plans: plans.length > 1,
    };
  }

  function checkoutStateMeta() {
    return {
      availability_state: plansStatus,
      ...planContextMeta(),
    };
  }

  function phaseMeta(phase: ActivationPhase) {
    return { activation_phase: phase };
  }

  function authStateMeta() {
    return { auth_state: user ? "authenticated" : "unauthenticated" };
  }

  function flowMeta() {
    return {
      activation_flow_version: ACTIVATION_FLOW_VERSION,
      activation_batch: ACTIVATION_BATCH,
      activation_data_source: ACTIVATION_DATA_SOURCE,
      activation_context_complete: true,
      activation_schema_fields: ACTIVATION_SCHEMA_FIELDS,
    };
  }

  function groupMeta(group: ActivationEventGroup) {
    return { activation_event_group: group };
  }

  function pathMeta(path: ActivationPath) {
    return { activation_path: path };
  }

  function nextCheckoutAttempt(planId: string): CheckoutAttemptMeta {
    checkoutAttemptsRef.current += 1;
    const planAttempts = (planAttemptCountsRef.current[planId] ?? 0) + 1;
    planAttemptCountsRef.current[planId] = planAttempts;
    return {
      sessionAttempt: checkoutAttemptsRef.current,
      planAttempt: planAttempts,
    };
  }

  const loadPlans = useCallback(
    async (source: "auto" | "manual_retry" = "auto") => {
      if (!profile || !user || listingStatus !== "ready" || !listing) return;

      const loadKey = `${homeIso}:${listing.lat ?? ""}:${listing.lng ?? ""}`;
      if (source === "manual_retry") {
        const retryCountBeforeClick = plansRetryCountRef.current;
        const retryCountAfterClick = retryCountBeforeClick + 1;
        setPlansRetryCount(retryCountAfterClick);
        setAwaitingRetryOutcome(true);
        trackEvent("post_activate_plans_retry_clicked", {
          listing_id: activeListingId,
          ...authStateMeta(),
          retry_channel: "plan_retry",
          ...phaseMeta("wait"),
          ...groupMeta("retry"),
          ...pathMeta("plan_retry"),
          ...flowMeta(),
          home_iso: homeIso,
          gateway: usePayPalRef.current ? "paypal" : "razorpay",
          availability_state: plansStatusRef.current,
          retry_count_before_click: retryCountBeforeClick,
          retry_count_after_click: retryCountAfterClick,
          visible_plan_count: plansRef.current.length,
          has_multiple_plans: plansRef.current.length > 1,
        });
      } else if (
        plansStatusRef.current === "ready" &&
        plansRef.current.length > 0 &&
        plansLoadedKeyRef.current === loadKey
      ) {
        return;
      }

      setPlansStatus("loading");
      const db = getClientDb();
      try {
        const result = await fetchResolvedListingPlans(db, {
          homeIso,
          ownerUid: user.uid,
          listingLat: listing.lat,
          listingLng: listing.lng,
        });
        resolvedTierRef.current = result.resolvedTier;
        resolvedTargetIsoRef.current = result.resolvedTargetIso;
        resolvedCityCodeRef.current = result.resolvedCityCode;
        setPlans(result.plans);
        setPlansStatus(result.plans.length ? "ready" : "empty");
        plansLoadedKeyRef.current = loadKey;
      } catch (e) {
        console.error("loadPlans", e);
        setPlans([]);
        setPlansStatus("error");
        plansLoadedKeyRef.current = null;
      }
    },
    [homeIso, listing, activeListingId, listingStatus, profile, user]
  );

  useEffect(() => {
    if (!activeListingId || trackedReturnVisitRef.current) return;
    try {
      const storageKey = `post_activate_visit_count:${activeListingId}`;
      const currentRaw = sessionStorage.getItem(storageKey);
      const currentCount = Number(currentRaw || "0");
      const nextCount = (Number.isFinite(currentCount) ? currentCount : 0) + 1;
      sessionStorage.setItem(storageKey, String(nextCount));
      if (nextCount > 1) {
        trackEvent("post_activate_return_visit_viewed", {
          listing_id: activeListingId,
          ...authStateMeta(),
          retry_channel: "none",
          visit_count: nextCount,
          ...phaseMeta("entry"),
          ...groupMeta("entry"),
          ...pathMeta("normal"),
          ...flowMeta(),
        });
      }
    } catch {
      // sessionStorage may be unavailable in privacy-restricted environments.
    }
    trackedReturnVisitRef.current = true;
  }, [activeListingId]);

  useEffect(() => {
    return () => {
      if (!latestCanPayRef.current) return;
      if (checkoutAttemptsRef.current > 0) return;
      if (!latestListingIdRef.current) return;
      trackEvent("post_activate_abandoned_before_checkout", {
        listing_id: latestListingIdRef.current,
        ...authStateMeta(),
        retry_channel: "none",
        ...phaseMeta("exit"),
        ...groupMeta("navigation"),
        ...pathMeta("normal"),
        ...flowMeta(),
        ...getDwellMeta(),
      });
    };
  }, []);

  useEffect(() => {
    if (activeListingId || trackedMissingId) return;
    setTrackedMissingId(true);
    trackEvent("post_activate_missing_listing_id", {
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("entry"),
      ...groupMeta("entry"),
      ...pathMeta("guardrail"),
      ...flowMeta(),
      availability_state: plansStatus,
      ...planContextMeta(),
    });
  }, [activeListingId, plans.length, plansStatus, trackedMissingId, user]);

  useEffect(() => {
    if (!activeListingId || authLoading || !user || trackedViewed) return;
    setTrackedViewed(true);
    trackEvent("post_activate_viewed", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("entry"),
      ...groupMeta("entry"),
      ...pathMeta("normal"),
      ...flowMeta(),
      availability_state: plansStatus,
      ...planContextMeta(),
    });
  }, [authLoading, activeListingId, plans.length, plansStatus, trackedViewed, user]);

  useEffect(() => {
    if (!activeListingId || authLoading || trackedSchemaSummary) return;
    setTrackedSchemaSummary(true);
    trackEvent("post_activate_schema_summary_viewed", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("entry"),
      ...groupMeta("entry"),
      ...pathMeta("normal"),
      ...flowMeta(),
      availability_state: plansStatus,
      ...planContextMeta(),
    });
  }, [authLoading, activeListingId, plans.length, plansStatus, trackedSchemaSummary, user]);

  useEffect(() => {
    let status: ActivateStatus | null = null;
    if (listingStatus === "missing") status = "missing";
    if (listingStatus === "forbidden") status = "forbidden";
    if (listingStatus === "ready" && listing?.isActive) status = "live";
    if (!status || trackedStatuses.includes(status)) return;

    setTrackedStatuses((prev) => [...prev, status as ActivateStatus]);
    trackEvent("post_activate_status_viewed", {
      listing_id: activeListingId,
      status,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("entry"),
      ...groupMeta("entry"),
      ...pathMeta(status === "missing" || status === "forbidden" ? "guardrail" : "normal"),
      ...flowMeta(),
      availability_state: plansStatus,
      ...planContextMeta(),
    });
  }, [listing?.isActive, activeListingId, listingStatus, plans.length, plansStatus, trackedStatuses]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(
        appPath(`/auth/login?next=${encodeURIComponent(`/post/activate?listingId=${activeListingId}`)}`)
      );
    }
  }, [user, authLoading, router, activeListingId]);

  useEffect(() => {
    activationHandledRef.current = false;
  }, [activeListingId]);

  useEffect(() => {
    if (!activeListingId || !user) return;
    const subscribeKey = `${activeListingId}:${user.uid}`;
    if (listingSubscribeKeyRef.current !== subscribeKey) {
      listingSubscribeKeyRef.current = subscribeKey;
      setListing(null);
      setListingStatus("loading");
    }
    const db = getClientDb();
    const ownerUid = user.uid;
    return onSnapshot(
      doc(db, "listings", activeListingId),
      (snap) => {
        if (!snap.exists()) {
          setListing(null);
          setListingStatus("missing");
          return;
        }
        const parsed = parseActivateListing(snap.id, snap.data() as Record<string, unknown>);
        firestoreListingIdRef.current = snap.id;
        setListing(parsed);
        if (parsed.ownerUid !== ownerUid) {
          setListingStatus("forbidden");
          return;
        }
        setListingStatus("ready");
        if (
          parsed.isActive &&
          waitingActivationRef.current &&
          !activationHandledRef.current
        ) {
          activationHandledRef.current = true;
          if (!trackedWaitResolvedRef.current) {
            setTrackedWaitResolved(true);
            trackEvent("post_activate_wait_resolved", {
              listing_id: activeListingId,
              ...authStateMeta(),
              retry_channel: "wait_retry",
              ...phaseMeta("wait"),
              ...groupMeta("retry"),
              ...pathMeta("wait_retry"),
              ...flowMeta(),
              availability_state: plansStatusRef.current,
              gateway: usePayPalRef.current ? "paypal" : "razorpay",
              outcome: "live",
              had_timeout: hadWaitTimeoutRef.current,
              wait_retry_count: waitRetryCountRef.current,
              visible_plan_count: plansRef.current.length,
              has_multiple_plans: plansRef.current.length > 1,
              ...getDwellMeta(),
            });
          }
          const waitPath =
            waitRetryCountRef.current > 0 || hadWaitTimeoutRef.current
              ? "wait_retry"
              : "normal";
          const checkoutMeta = {
            availability_state: plansStatusRef.current,
            visible_plan_count: plansRef.current.length,
            has_multiple_plans: plansRef.current.length > 1,
          };
          trackEvent("payment_success", {
            listing_id: activeListingId,
            ...authStateMeta(),
            retry_channel: "none",
            ...phaseMeta("outcome"),
            ...groupMeta("outcome"),
            ...pathMeta(waitPath),
            ...flowMeta(),
            gateway: usePayPalRef.current ? "paypal" : "razorpay",
            plan_position: lastCheckoutPlanPositionRef.current,
            plan_signature: lastCheckoutPlanSignatureRef.current,
            checkout_attempt: lastCheckoutAttemptRef.current?.sessionAttempt ?? 0,
            plan_attempt: lastCheckoutAttemptRef.current?.planAttempt ?? 0,
            ...checkoutMeta,
            ...getDwellMeta(),
          });
          trackEvent("listing_published", {
            listing_id: activeListingId,
            ...authStateMeta(),
            retry_channel: "none",
            ...phaseMeta("outcome"),
            ...groupMeta("outcome"),
            ...pathMeta(waitPath),
            ...flowMeta(),
            plan_position: lastCheckoutPlanPositionRef.current,
            plan_signature: lastCheckoutPlanSignatureRef.current,
            checkout_attempt: lastCheckoutAttemptRef.current?.sessionAttempt ?? 0,
            plan_attempt: lastCheckoutAttemptRef.current?.planAttempt ?? 0,
            ...checkoutMeta,
            ...getDwellMeta(),
          });
          router.push(appPath(`/listings/${activeListingId}`));
        }
      },
      () => setListingStatus("missing")
    );
  }, [activeListingId, router, user]);

  useEffect(() => {
    if (!waitingActivation) {
      setActivationTimedOut(false);
      setTrackedTimeout(false);
      return;
    }
    const timer = setTimeout(() => setActivationTimedOut(true), ACTIVATION_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [waitingActivation]);

  useEffect(() => {
    if (!activationTimedOut || trackedTimeout) return;
    setTrackedTimeout(true);
    setHadWaitTimeout(true);
    trackEvent("post_activate_wait_timed_out", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "wait_retry",
      ...phaseMeta("wait"),
      ...groupMeta("retry"),
      ...pathMeta("wait_retry"),
      ...flowMeta(),
      availability_state: plansStatus,
      ...planContextMeta(),
    });
  }, [activationTimedOut, activeListingId, plans.length, plansStatus, trackedTimeout]);

  useEffect(() => {
    if (!profile || !activeListingId || !user || listingStatus !== "ready" || !listing) return;
    void loadPlans();
  }, [homeIso, listing, activeListingId, listingStatus, loadPlans, profile, user]);

  useEffect(() => {
    if (trackedPlansLoaded || plansStatus !== "ready") return;
    setTrackedPlansLoaded(true);
    trackEvent("post_activate_plans_loaded", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("availability"),
      ...groupMeta("availability"),
      ...pathMeta("normal"),
      ...flowMeta(),
      availability_state: "ready",
      plan_count: plans.length,
      gateway: usePayPal ? "paypal" : "razorpay",
      plan_signatures: plans.map((plan) => planSignature(plan)).join("|"),
      ...planContextMeta(),
    });
  }, [activeListingId, plans.length, plansStatus, trackedPlansLoaded, usePayPal]);

  useEffect(() => {
    if (trackedPlansShown || plansStatus !== "ready") return;
    setTrackedPlansShown(true);
    trackEvent("post_activate_plans_shown", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("availability"),
      ...groupMeta("availability"),
      ...pathMeta("normal"),
      ...flowMeta(),
      availability_state: "ready",
      gateway: usePayPal ? "paypal" : "razorpay",
      plan_count: plans.length,
      plan_ids: plans.map((plan) => plan.id).join("|"),
      plan_prices: plans.map((plan) => `${plan.price}:${plan.currency}`).join("|"),
      plan_signatures: plans.map((plan) => planSignature(plan)).join("|"),
    });
  }, [activeListingId, plans, plansStatus, trackedPlansShown, usePayPal]);

  useEffect(() => {
    if (trackedPlansEmpty || plansStatus !== "empty") return;
    setTrackedPlansEmpty(true);
    trackEvent("post_activate_plans_empty_viewed", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("availability"),
      ...groupMeta("availability"),
      ...pathMeta("guardrail"),
      ...flowMeta(),
      availability_state: "empty",
      home_iso: homeIso,
      gateway: usePayPal ? "paypal" : "razorpay",
      ...planContextMeta(),
    });
  }, [homeIso, activeListingId, plansStatus, trackedPlansEmpty, usePayPal]);

  useEffect(() => {
    if (trackedPlansError || plansStatus !== "error") return;
    setTrackedPlansError(true);
    trackEvent("post_activate_plans_error_viewed", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("availability"),
      ...groupMeta("availability"),
      ...pathMeta("guardrail"),
      ...flowMeta(),
      availability_state: "error",
      home_iso: homeIso,
      gateway: usePayPal ? "paypal" : "razorpay",
    });
  }, [homeIso, activeListingId, plansStatus, trackedPlansError, usePayPal]);

  useEffect(() => {
    if (!awaitingRetryOutcome) return;
    if (plansStatus !== "ready" && plansStatus !== "empty" && plansStatus !== "error") return;
    trackEvent("post_activate_plans_retry_result", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "plan_retry",
      ...phaseMeta("wait"),
      ...groupMeta("retry"),
      ...pathMeta("plan_retry"),
      ...flowMeta(),
      home_iso: homeIso,
      gateway: usePayPal ? "paypal" : "razorpay",
      result: plansStatus,
      availability_state: plansStatus,
      retry_count: plansRetryCount,
      plan_count: plansStatus === "ready" ? plans.length : 0,
      ...planContextMeta(),
    });
    setAwaitingRetryOutcome(false);
  }, [awaitingRetryOutcome, homeIso, activeListingId, plans.length, plansRetryCount, plansStatus, usePayPal]);

  async function payWithRazorpay(planId: string) {
    if (!canPay || !profile || !user) return;
    const listingId = resolveListingIdForPayment();
    if (!listingId) {
      setError("Missing listing ID. Open this page from your draft or My listings.");
      return;
    }
    setBusy(true);
    setError("");
    setActivationTimedOut(false);
    const attempt = nextCheckoutAttempt(planId);
    const selectedPlan = plans.find((plan) => plan.id === planId);
    const planPosition = findPlanPosition(plans, planId);
    const signature = planSignature(selectedPlan);
    lastCheckoutAttemptRef.current = attempt;
    lastCheckoutPlanPositionRef.current = planPosition;
    lastCheckoutPlanSignatureRef.current = signature;
    trackEvent("checkout_started", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("checkout"),
      ...groupMeta("payment"),
      ...pathMeta("normal"),
      ...flowMeta(),
      plan_id: planId,
      plan_position: planPosition,
      plan_signature: signature,
      checkout_attempt: attempt.sessionAttempt,
      plan_attempt: attempt.planAttempt,
      ...checkoutStateMeta(),
    });

    try {
      const data = await createRazorpayOrderForListing({
        listingId,
        planId,
        resolvedTier: resolvedTierRef.current,
        homeIso: profile.homeIso,
      });
      const orderId = data.orderId;
      const key = data.key;
      const totalAmount = data.totalAmount;
      const currency = data.currency;

      await openRazorpayCheckout({
        key,
        orderId,
        totalAmount,
        currency,
        listingId: activeListingId,
        userName: profile.displayName || user.displayName || "RentalPins User",
        userEmail: profile.email || user.email || undefined,
        userPhone: profile.phone || user.phoneNumber || undefined,
        onSuccess: () => {
          setWaitingActivation(true);
          setBusy(false);
        },
        onDismiss: () => {
          trackEvent("post_activate_payment_dismissed", {
            listing_id: activeListingId,
            ...authStateMeta(),
            retry_channel: "none",
            ...phaseMeta("checkout"),
            ...groupMeta("payment"),
            ...pathMeta("normal"),
            ...flowMeta(),
            gateway: "razorpay",
            plan_position: planPosition,
            plan_signature: signature,
            checkout_attempt: attempt.sessionAttempt,
            plan_attempt: attempt.planAttempt,
            ...checkoutStateMeta(),
          });
          setBusy(false);
        },
      });
    } catch (err) {
      setError(mapCallableError(err));
      trackEvent("post_activate_payment_failed", {
        listing_id: activeListingId,
        ...authStateMeta(),
        retry_channel: "none",
        ...phaseMeta("checkout"),
        ...groupMeta("payment"),
        ...pathMeta("normal"),
        ...flowMeta(),
        gateway: "razorpay",
        plan_position: planPosition,
        plan_signature: signature,
        checkout_attempt: attempt.sessionAttempt,
        plan_attempt: attempt.planAttempt,
        ...checkoutStateMeta(),
      });
      setBusy(false);
    }
  }

  async function payWithPayPal(planId: string) {
    if (!canPay || !profile) return;
    const listingId = resolveListingIdForPayment();
    if (!listingId) {
      setError("Missing listing ID. Open this page from your draft or My listings.");
      return;
    }
    setBusy(true);
    setError("");
    setActivationTimedOut(false);
    const attempt = nextCheckoutAttempt(planId);
    const selectedPlan = plans.find((plan) => plan.id === planId);
    const planPosition = findPlanPosition(plans, planId);
    const signature = planSignature(selectedPlan);
    lastCheckoutAttemptRef.current = attempt;
    lastCheckoutPlanPositionRef.current = planPosition;
    lastCheckoutPlanSignatureRef.current = signature;
    trackEvent("checkout_started", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("checkout"),
      ...groupMeta("payment"),
      ...pathMeta("normal"),
      ...flowMeta(),
      plan_id: planId,
      plan_position: planPosition,
      plan_signature: signature,
      checkout_attempt: attempt.sessionAttempt,
      plan_attempt: attempt.planAttempt,
      ...checkoutStateMeta(),
    });

    try {
      const data = await createPayPalOrderForListing({
        listingId,
        planId,
        resolvedTier: resolvedTierRef.current,
        homeIso: profile.homeIso,
      });
      const approvalUrl = data.approvalUrl;
      if (!approvalUrl) throw new Error("PayPal approval URL missing");
      setWaitingActivation(true);
      window.location.href = approvalUrl;
    } catch (err) {
      setError(mapCallableError(err));
      trackEvent("post_activate_payment_failed", {
        listing_id: activeListingId,
        ...authStateMeta(),
        retry_channel: "none",
        ...phaseMeta("checkout"),
        ...groupMeta("payment"),
        ...pathMeta("normal"),
        ...flowMeta(),
        gateway: "paypal",
        plan_position: planPosition,
        plan_signature: signature,
        checkout_attempt: attempt.sessionAttempt,
        plan_attempt: attempt.planAttempt,
        ...checkoutStateMeta(),
      });
      setBusy(false);
    }
  }

  function retryActivationWait() {
    const retryCountBeforeClick = waitRetryCount;
    const retryCountAfterClick = retryCountBeforeClick + 1;
    setActivationTimedOut(false);
    setWaitingActivation(true);
    setWaitRetryCount(retryCountAfterClick);
    trackEvent("post_activate_wait_retry_clicked", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "wait_retry",
      ...phaseMeta("wait"),
      ...groupMeta("retry"),
      ...pathMeta("wait_retry"),
      ...flowMeta(),
      retry_count_before_click: retryCountBeforeClick,
      retry_count_after_click: retryCountAfterClick,
      availability_state: plansStatus,
      ...planContextMeta(),
    });
  }

  function resolveListingIdForPayment(): string {
    return (
      firestoreListingIdRef.current ||
      listing?.id ||
      listingIdParam.trim() ||
      activeListingId.trim()
    );
  }

  function callableErrorCode(err: unknown): string {
    if (err instanceof CallableError) {
      return err.code.replace(/^functions\//, "");
    }
    return "unknown";
  }

  async function activateFreePlan(plan: Plan, index: number) {
    if (!canPay || !profile || !user || !listing) return;
    const listingIdForApi = listing.id.trim();
    if (!listingIdForApi) {
      setError("Missing listing ID. Open this page from your draft or My listings.");
      return;
    }
    setBusy(true);
    setError("");
    const planPosition = index + 1;
    const signature = planSignature(plan);
    lastCheckoutPlanPositionRef.current = planPosition;
    lastCheckoutPlanSignatureRef.current = signature;

    const db = getClientDb();
    const eligibility = await resolveFreePlanEligibility(
      db,
      user.uid,
      resolvedTierRef.current,
      resolvedTargetIsoRef.current,
      resolvedCityCodeRef.current
    );
    if (!eligibility.eligible) {
      setError(eligibility.message);
      trackEvent("post_activate_free_activate_failed", {
        listing_id: listingIdForApi,
        error_code: eligibility.code,
        ...authStateMeta(),
        retry_channel: "none",
        ...phaseMeta("checkout"),
        ...groupMeta("payment"),
        ...pathMeta("normal"),
        ...flowMeta(),
        plan_id: plan.id,
        plan_position: planPosition,
        ...checkoutStateMeta(),
      });
      setBusy(false);
      return;
    }

    trackEvent("post_activate_free_activate_started", {
      listing_id: listingIdForApi,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("checkout"),
      ...groupMeta("payment"),
      ...pathMeta("normal"),
      ...flowMeta(),
      plan_id: plan.id,
      plan_position: planPosition,
      plan_signature: signature,
      resolved_tier: resolvedTierRef.current,
      ...checkoutStateMeta(),
    });

    try {
      const requestData: Record<string, string> = {
        listingId: listingIdForApi,
        planId: plan.id,
        targetIso: resolvedTargetIsoRef.current,
        homeIso: (profile.homeIso || "IN").toUpperCase(),
      };
      const cityCode = resolvedCityCodeRef.current;
      if (cityCode) requestData.cityCode = cityCode;

      const data = await callHttpsFunction<{ success?: boolean }>(
        "activateFreePlan",
        requestData,
        "us-central1"
      );
      if (data?.success !== true) {
        throw new Error("Activation failed. Please try again.");
      }

      trackEvent("listing_published", {
        listing_id: listingIdForApi,
        ...authStateMeta(),
        retry_channel: "none",
        ...phaseMeta("outcome"),
        ...groupMeta("outcome"),
        ...pathMeta("normal"),
        ...flowMeta(),
        gateway: "free",
        plan_position: planPosition,
        plan_signature: signature,
        ...checkoutStateMeta(),
        ...getDwellMeta(),
      });
      router.push(appPath(`/listings/${listingIdForApi}`));
    } catch (err) {
      const message = mapCallableError(err);
      setError(message);
      trackEvent("post_activate_free_activate_failed", {
        listing_id: listingIdForApi,
        error_code: callableErrorCode(err),
        ...authStateMeta(),
        retry_channel: "none",
        ...phaseMeta("checkout"),
        ...groupMeta("payment"),
        ...pathMeta("normal"),
        ...flowMeta(),
        plan_id: plan.id,
        plan_position: planPosition,
        ...checkoutStateMeta(),
      });
    } finally {
      setBusy(false);
    }
  }

  function handlePlanCheckout(plan: Plan, index: number) {
    trackEvent("post_activate_plan_selected", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("selection"),
      ...groupMeta("selection"),
      ...pathMeta("normal"),
      ...flowMeta(),
      plan_id: plan.id,
      plan_name: plan.planName,
      plan_price: plan.price,
      plan_currency: plan.currency,
      plan_duration_days: plan.durationDays,
      plan_signature: planSignature(plan),
      plan_position: index + 1,
      gateway: plan.price === 0 ? "free" : usePayPal ? "paypal" : "razorpay",
      ...checkoutStateMeta(),
    });

    if (plan.price === 0) {
      void activateFreePlan(plan, index);
      return;
    }
    if (usePayPal) {
      void payWithPayPal(plan.id);
      return;
    }
    void payWithRazorpay(plan.id);
  }

  function planCheckoutLabel(plan: Plan): string {
    if (plan.price === 0) return "Activate free";
    return usePayPal ? "PayPal" : "Pay";
  }

  function trackActivateExitClick(destination: string, source: string) {
    const waitState = activationTimedOut ? "timed_out" : waitingActivation ? "waiting" : "idle";
    trackEvent("post_activate_exit_clicked", {
      listing_id: activeListingId,
      ...authStateMeta(),
      retry_channel: "none",
      ...phaseMeta("exit"),
      ...groupMeta("navigation"),
      ...pathMeta(activationTimedOut || waitingActivation ? "wait_retry" : "normal"),
      ...flowMeta(),
      destination,
      source,
      gateway: usePayPal ? "paypal" : "razorpay",
      wait_state: waitState,
      wait_retry_count: waitRetryCount,
      ...checkoutStateMeta(),
      ...getDwellMeta(),
    });
  }

  if (!activeListingId) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <p className="text-[var(--muted)]">Missing listing ID.</p>
        <Link
          href={appPath("/post")}
          onClick={() => trackActivateExitClick("/post", "missing_listing_id")}
          className="mt-4 text-sm text-[var(--brand-orange)]"
        >
          ← Back to post
        </Link>
      </div>
    );
  }

  if (authLoading || listingStatus === "loading") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-[var(--muted)]">Loading listing…</p>
      </div>
    );
  }

  if (user && profileError) {
    return (
      <AccountUnavailable message={profileError} onRetry={refreshProfile} />
    );
  }

  if (isBlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Account restricted</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Posting and activation are disabled on this account. Contact support if you think
          this is a mistake.
        </p>
        <Link href={appPath("/profile")} className="mt-6 inline-block text-[var(--accent)]">
          My profile
        </Link>
      </div>
    );
  }

  if (listingStatus === "missing") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Listing not found</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This draft may have been deleted or the link is invalid.
        </p>
        <Link
          href={appPath("/profile")}
          onClick={() => trackActivateExitClick("/profile", "missing_listing")}
          className="mt-6 inline-block text-[var(--brand-orange)]"
        >
          My listings →
        </Link>
      </div>
    );
  }

  if (listingStatus === "forbidden") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Access denied</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You can only activate listings you posted.
        </p>
        <Link
          href={appPath("/profile")}
          onClick={() => trackActivateExitClick("/profile", "forbidden_listing")}
          className="mt-6 inline-block text-[var(--brand-orange)]"
        >
          My listings →
        </Link>
      </div>
    );
  }

  if (listing?.isActive) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Listing is live</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{listing.title}</p>
        <Link
          href={appPath(`/listings/${activeListingId}`)}
          onClick={() => trackActivateExitClick(`/listings/${activeListingId}`, "already_live")}
          className="rp-btn rp-btn-primary mt-6 inline-flex px-6"
        >
          View listing
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-28 md:pb-8">
      <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Activate listing</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Choose a plan and pay. Your listing goes live after payment is confirmed (same as the
        mobile app).
      </p>

      {listing && (
        <div className="rp-card mt-6 flex gap-3 p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-elevated)]">
            {listing.imageUrl ? (
              <Image src={listing.imageUrl} alt="" fill className="object-cover" sizes="64px" />
            ) : (
              <div className="flex h-full items-center justify-center text-xl opacity-40">📷</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--brand-navy)]">{listing.title}</p>
            {listing.locationName && (
              <p className="truncate text-xs text-[var(--muted)]">{listing.locationName}</p>
            )}
            <p className="mt-1 text-xs font-medium text-amber-700">Draft — payment required</p>
          </div>
        </div>
      )}

      {waitingActivation && (
        <div
          className={`mt-6 rounded-xl border p-4 text-sm ${
            activationTimedOut
              ? "border-amber-200 bg-amber-50"
              : "border-[color-mix(in_srgb,var(--brand-orange)_35%,var(--border))] bg-[var(--surface)]"
          }`}
        >
          {activationTimedOut ? (
            <>
              <p className="font-medium text-amber-900">Activation is taking longer than usual</p>
              <p className="mt-1 text-amber-800/90">
                Payment may still be processing. You can wait a bit longer or check your listing
                in My listings.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full bg-[var(--brand-navy)] px-4 py-1.5 text-xs font-semibold text-white"
                  onClick={retryActivationWait}
                >
                  Keep waiting
                </button>
                <Link
                  href={appPath("/profile")}
                  onClick={() => trackActivateExitClick("/profile", "activation_timed_out")}
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--brand-navy)]"
                >
                  My listings
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="font-medium text-[var(--brand-orange)]">Waiting for activation…</p>
              <p className="mt-1 text-[var(--muted)]">
                This usually takes a few seconds after payment.
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--border)]">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--brand-orange)]" />
              </div>
            </>
          )}
        </div>
      )}

      {plansStatus === "loading" && (
        <p className="mt-8 text-sm text-[var(--muted)]">Loading plans…</p>
      )}

      {plansStatus === "error" && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p>Could not load plans. Refresh the page or try again shortly.</p>
          <button
            type="button"
            onClick={() => void loadPlans("manual_retry")}
            className="mt-3 rounded-full border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700"
          >
            Retry plans
          </button>
        </div>
      )}

      {plansStatus === "empty" && (
        <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--muted)]">
          <p>No plans are available for your region ({homeIso}). Contact support if this seems wrong.</p>
          <button
            type="button"
            onClick={() => void loadPlans("manual_retry")}
            className="mt-3 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)]"
          >
            Retry plans
          </button>
        </div>
      )}

      {plansStatus === "ready" && (
        <ul className="mt-8 space-y-3">
          {plans.map((plan, index) => (
            <li
              key={plan.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div>
                <p className="font-medium text-[var(--brand-navy)]">{plan.planName}</p>
                <p className="text-sm text-[var(--muted)]">{plan.durationDays} days on map</p>
                <p className="mt-1 font-serif text-[var(--brand-orange)]">
                  {plan.price === 0 ? "Free" : `${plan.price.toLocaleString()} ${plan.currency}`}
                </p>
              </div>
              <button
                type="button"
                disabled={busy || waitingActivation || !canPay}
                onClick={() => handlePlanCheckout(plan, index)}
                className="shrink-0 rounded-full bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {planCheckoutLabel(plan)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link
          href={appPath(`/post?listingId=${activeListingId}`)}
          onClick={() => trackActivateExitClick(`/post?listingId=${activeListingId}`, "edit_draft")}
          className="text-[var(--muted)] hover:text-[var(--brand-navy)]"
        >
          ← Edit draft
        </Link>
        <Link
          href={appPath("/profile")}
          onClick={() => trackActivateExitClick("/profile", "footer_my_listings")}
          className="text-[var(--brand-orange)] hover:underline"
        >
          My listings
        </Link>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<p className="p-8 text-[var(--muted)]">Loading…</p>}>
      <ActivateContent />
    </Suspense>
  );
}
