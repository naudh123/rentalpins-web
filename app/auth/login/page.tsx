"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { canLeaveLogin, mustVerifyPhone } from "@/lib/auth-guards";
import { appPath, basePath } from "@/lib/config";
import { getClientAuth } from "@/lib/firebase-client";
import { trackEvent } from "@/lib/ga4";
import { isValidPhoneForAuth, normalizePhoneForAuth } from "@/lib/phone-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const LOGIN_FLOW_VERSION = "2026-05-login-v1";
const LOGIN_FLOW_BATCH = 107;
const LOGIN_DATA_SOURCE = "client_live";
const LOGIN_SCHEMA_FIELDS =
  "login_flow_version|login_flow_batch|login_data_source|login_schema_fields|login_context_complete|login_event_group|login_phase|auth_state|auth_requirement|login_path|login_method|next_path|destination|link_phone_mode|phone_only_mode|has_user|outcome|block_reason|login_attempt|method_attempt|method_attempt_bucket|abandon_stage|dwell_seconds|dwell_bucket|exit_target|exit_stage|error_code|resolution_channel|return_visit_count|failure_count|failure_count_bucket|last_failure_code|last_failure_method|failure_count_before_success|recovered_from_failure|failure_recovery_seconds|failure_recovery_bucket";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || appPath("/search");
  const linkPhone = searchParams.get("link") === "1";
  const normalizeNext = (value: string) => {
    if (!value) return appPath("/search");
    const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
    if (basePath && withLeadingSlash.startsWith(`${basePath}/`)) return withLeadingSlash;
    if (basePath && withLeadingSlash === basePath) return withLeadingSlash;
    return appPath(withLeadingSlash);
  };

  const {
    user,
    profile,
    sendOtp,
    verifyOtp,
    signInWithGoogle,
    cancelOtp,
    confirmation,
    loading,
    needsPhoneLink,
    linkMode,
  } = useAuth();

  const [phone, setPhone] = useState("+91");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [trackedLoginViewed, setTrackedLoginViewed] = useState(false);
  const [trackedAutoRedirect, setTrackedAutoRedirect] = useState(false);
  const [trackedSchemaSummary, setTrackedSchemaSummary] = useState(false);
  const [trackedReturnVisit, setTrackedReturnVisit] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const [lastFailureCode, setLastFailureCode] = useState<string | null>(null);
  const [lastFailureMethod, setLastFailureMethod] = useState<"otp" | "google" | null>(null);
  const [firstFailureAtMs, setFirstFailureAtMs] = useState<number | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [googleStarted, setGoogleStarted] = useState(false);
  const [googleResolved, setGoogleResolved] = useState(false);
  const loginViewStartedAtRef = useRef<number>(Date.now());
  const loginAttemptsRef = useRef(0);
  const otpAttemptsRef = useRef(0);
  const googleAttemptsRef = useRef(0);
  const activeOtpAttemptRef = useRef<{ login_attempt: number; method_attempt: number } | null>(null);
  const activeGoogleAttemptRef = useRef<{ login_attempt: number; method_attempt: number } | null>(null);

  function loginMeta() {
    return {
      login_flow_version: LOGIN_FLOW_VERSION,
      login_flow_batch: LOGIN_FLOW_BATCH,
      login_data_source: LOGIN_DATA_SOURCE,
      login_schema_fields: LOGIN_SCHEMA_FIELDS,
      login_context_complete: true,
    };
  }

  const showPhoneOnly =
    linkPhone || Boolean(user && (needsPhoneLink || mustVerifyPhone(user)));
  const authState = user ? "authenticated" : "unauthenticated";

  function authStateMeta() {
    return { auth_state: authState };
  }

  function authRequirementMeta() {
    return { auth_requirement: showPhoneOnly ? "phone_required" : "optional" };
  }

  function linkPhoneMeta() {
    return { link_phone_mode: linkPhone };
  }

  function loginPathMeta() {
    if (linkPhone) return { login_path: "link_phone" };
    if (showPhoneOnly) return { login_path: "phone_gate" };
    return { login_path: "standard" };
  }

  function resolutionChannelMeta(
    channel: "auto_redirect" | "otp_verified" | "google_success" | "google_blocked" | "otp_abandon" | "google_abandon" | "manual_exit"
  ) {
    return { resolution_channel: channel };
  }

  function eventGroupMeta(
    group: "entry" | "intent" | "failure" | "outcome" | "abandonment" | "navigation"
  ) {
    return { login_event_group: group };
  }

  function phaseMeta(
    phase: "entry" | "auth" | "verification" | "outcome" | "abandonment" | "exit"
  ) {
    return { login_phase: phase };
  }

  function methodMeta(loginMethod: "otp" | "google" | "auto" | "none") {
    return { login_method: loginMethod };
  }

  function dwellBucket(seconds: number) {
    if (seconds < 10) return "lt_10s";
    if (seconds < 30) return "10_29s";
    if (seconds < 60) return "30_59s";
    return "ge_60s";
  }

  function dwellMeta() {
    const dwellSeconds = Math.max(0, Math.round((Date.now() - loginViewStartedAtRef.current) / 1000));
    return {
      dwell_seconds: dwellSeconds,
      dwell_bucket: dwellBucket(dwellSeconds),
    };
  }

  function loginStage() {
    if (confirmation && !otpVerified) return "otp_pending_verify";
    if (otpSent && !otpVerified) return "otp_sent";
    if (googleStarted && !googleResolved) return "google_pending";
    if (showPhoneOnly) return "phone_only";
    return "method_select";
  }

  function errorCodeFromUnknown(err: unknown) {
    if (!(err instanceof Error)) return "unknown_error";
    const message = err.message.toLowerCase();
    if (message.includes("network")) return "network_error";
    if (message.includes("too-many-requests") || message.includes("too many requests")) {
      return "rate_limited";
    }
    if (
      message.includes("security check") ||
      message.includes("captcha") ||
      message.includes("recaptcha") ||
      message.includes("app credential")
    ) {
      return "captcha_failed";
    }
    if (message.includes("valid mobile") || message.includes("phone number")) {
      return "invalid_phone";
    }
    if (message.includes("invalid") && message.includes("code")) return "invalid_code";
    if (message.includes("popup") && message.includes("closed")) return "popup_closed";
    if (message.includes("popup") && message.includes("blocked")) return "popup_blocked";
    return "unknown_error";
  }

  function nextAttemptMeta(loginMethod: "otp" | "google") {
    loginAttemptsRef.current += 1;
    const loginAttempt = loginAttemptsRef.current;
    if (loginMethod === "otp") {
      otpAttemptsRef.current += 1;
      const methodAttempt = otpAttemptsRef.current;
      return { login_attempt: loginAttempt, method_attempt: methodAttempt };
    }
    googleAttemptsRef.current += 1;
    const methodAttempt = googleAttemptsRef.current;
    return { login_attempt: loginAttempt, method_attempt: methodAttempt };
  }

  function methodAttemptBucket(methodAttempt: number) {
    if (methodAttempt <= 1) return "1";
    if (methodAttempt === 2) return "2";
    if (methodAttempt === 3) return "3";
    return "4_plus";
  }

  function attemptBucketMeta(attemptMeta: { method_attempt?: number } | null | undefined) {
    const methodAttempt = attemptMeta?.method_attempt;
    if (!methodAttempt) return {};
    return { method_attempt_bucket: methodAttemptBucket(methodAttempt) };
  }

  function failureCountBucket(failures: number) {
    if (failures <= 1) return "1";
    if (failures === 2) return "2";
    if (failures === 3) return "3";
    return "4_plus";
  }

  function failureRecoveryMeta() {
    if (!firstFailureAtMs) return {};
    const seconds = Math.max(0, Math.round((Date.now() - firstFailureAtMs) / 1000));
    const bucket = seconds < 10 ? "lt_10s" : seconds < 30 ? "10_29s" : seconds < 60 ? "30_59s" : "ge_60s";
    return { failure_recovery_seconds: seconds, failure_recovery_bucket: bucket };
  }

  useEffect(() => {
    if (loading || trackedSchemaSummary) return;
    setTrackedSchemaSummary(true);
    trackEvent("login_schema_summary_viewed", {
      next_path: normalizeNext(next),
      link_phone_mode: linkPhone,
      phone_only_mode: showPhoneOnly,
      has_user: Boolean(user),
      ...eventGroupMeta("entry"),
      ...phaseMeta("entry"),
      ...authStateMeta(),
      ...authRequirementMeta(),
      ...loginPathMeta(),
      ...methodMeta("none"),
      ...loginMeta(),
    });
  }, [linkPhone, loading, next, showPhoneOnly, trackedSchemaSummary, user]);

  useEffect(() => {
    if (loading || trackedLoginViewed) return;
    setTrackedLoginViewed(true);
    trackEvent("login_viewed", {
      next_path: normalizeNext(next),
      link_phone_mode: linkPhone,
      phone_only_mode: showPhoneOnly,
      has_user: Boolean(user),
      ...eventGroupMeta("entry"),
      ...phaseMeta("entry"),
      ...authStateMeta(),
      ...authRequirementMeta(),
      ...loginPathMeta(),
      ...methodMeta("none"),
      ...loginMeta(),
    });
  }, [linkPhone, loading, next, showPhoneOnly, trackedLoginViewed, user]);

  useEffect(() => {
    if (loading || failureCount <= 0) return;
    trackEvent("login_failure_summary_viewed", {
      failure_count: failureCount,
      failure_count_bucket: failureCountBucket(failureCount),
      last_failure_code: lastFailureCode || "unknown_error",
      last_failure_method: lastFailureMethod || "unknown",
      next_path: normalizeNext(next),
      phone_only_mode: showPhoneOnly,
      has_user: Boolean(user),
      ...eventGroupMeta("failure"),
      ...phaseMeta("entry"),
      ...linkPhoneMeta(),
      ...authStateMeta(),
      ...authRequirementMeta(),
      ...loginPathMeta(),
      ...methodMeta("none"),
      ...loginMeta(),
    });
  }, [
    failureCount,
    lastFailureCode,
    lastFailureMethod,
    linkPhone,
    loading,
    next,
    showPhoneOnly,
    user,
  ]);

  useEffect(() => {
    if (loading || trackedReturnVisit) return;
    setTrackedReturnVisit(true);
    const key = `login:return:${normalizeNext(next)}:${linkPhone ? "link" : "standard"}`;
    let nextCount = 1;
    try {
      const raw = window.sessionStorage.getItem(key);
      const prior = raw ? Number(raw) : 0;
      const safePrior = Number.isFinite(prior) && prior > 0 ? prior : 0;
      nextCount = safePrior + 1;
      window.sessionStorage.setItem(key, String(nextCount));
    } catch {
      nextCount = 1;
    }
    if (nextCount <= 1) return;
    trackEvent("login_return_visit_viewed", {
      return_visit_count: nextCount,
      next_path: normalizeNext(next),
      phone_only_mode: showPhoneOnly,
      has_user: Boolean(user),
      ...eventGroupMeta("entry"),
      ...phaseMeta("entry"),
      ...linkPhoneMeta(),
      ...authStateMeta(),
      ...authRequirementMeta(),
      ...loginPathMeta(),
      ...methodMeta("none"),
      ...loginMeta(),
    });
  }, [linkPhone, loading, next, showPhoneOnly, trackedReturnVisit, user]);

  useEffect(() => {
    if (loading || !user || confirmation) return;
    if (!canLeaveLogin(user)) return;
    if (!trackedAutoRedirect) {
      setTrackedAutoRedirect(true);
      trackEvent("login_redirected_after_auth", {
        destination: normalizeNext(next),
        link_phone_mode: linkPhone,
        ...eventGroupMeta("navigation"),
        ...phaseMeta("exit"),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("auto"),
        ...loginMeta(),
      });
      trackEvent("login_success", {
        destination: normalizeNext(next),
        outcome: "redirected",
        ...eventGroupMeta("outcome"),
        ...phaseMeta("outcome"),
        ...resolutionChannelMeta("auto_redirect"),
        ...dwellMeta(),
        ...linkPhoneMeta(),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("auto"),
        ...loginMeta(),
      });
      if (failureCount > 0) {
        trackEvent("login_failure_recovered", {
          destination: normalizeNext(next),
          recovered_from_failure: true,
          failure_count_before_success: failureCount,
          failure_count_bucket: failureCountBucket(failureCount),
          ...failureRecoveryMeta(),
          last_failure_code: lastFailureCode || "unknown_error",
          last_failure_method: lastFailureMethod || "unknown",
          ...eventGroupMeta("outcome"),
          ...phaseMeta("outcome"),
          ...resolutionChannelMeta("auto_redirect"),
          ...dwellMeta(),
          ...linkPhoneMeta(),
          ...authStateMeta(),
          ...authRequirementMeta(),
          ...loginPathMeta(),
          ...methodMeta("auto"),
          ...loginMeta(),
        });
      }
    }
    router.replace(normalizeNext(next));
  }, [
    confirmation,
    failureCount,
    lastFailureCode,
    lastFailureMethod,
    linkPhone,
    loading,
    next,
    profile,
    router,
    trackedAutoRedirect,
    user,
  ]);

  useEffect(() => {
    return () => {
      if (!otpSent || otpVerified) return;
      trackEvent("login_abandoned_after_otp_sent", {
        abandon_stage: "otp_sent_before_verify",
        ...eventGroupMeta("abandonment"),
        ...phaseMeta("abandonment"),
        ...resolutionChannelMeta("otp_abandon"),
        link_phone_mode: showPhoneOnly,
        ...dwellMeta(),
        ...(activeOtpAttemptRef.current || {}),
        ...attemptBucketMeta(activeOtpAttemptRef.current),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("otp"),
        ...loginMeta(),
      });
    };
  }, [otpSent, otpVerified, showPhoneOnly]);

  useEffect(() => {
    return () => {
      if (!googleStarted || googleResolved) return;
      trackEvent("login_abandoned_after_google_click", {
        abandon_stage: "google_clicked_before_resolution",
        ...eventGroupMeta("abandonment"),
        ...phaseMeta("abandonment"),
        ...resolutionChannelMeta("google_abandon"),
        ...dwellMeta(),
        ...linkPhoneMeta(),
        ...(activeGoogleAttemptRef.current || {}),
        ...attemptBucketMeta(activeGoogleAttemptRef.current),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("google"),
        ...loginMeta(),
      });
    };
  }, [googleResolved, googleStarted]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const normalizedPhone = normalizePhoneForAuth(phone);
    if (!isValidPhoneForAuth(normalizedPhone)) {
      setError("Enter a valid mobile number with country code (e.g. +91 98765 43210).");
      trackEvent("login_otp_send_failed", {
        link_phone_mode: showPhoneOnly,
        error_code: "invalid_phone",
        ...eventGroupMeta("failure"),
        ...phaseMeta("verification"),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("otp"),
        ...loginMeta(),
      });
      return;
    }
    setPhone(normalizedPhone);
    setBusy(true);
    const attemptMeta = nextAttemptMeta("otp");
    activeOtpAttemptRef.current = attemptMeta;
    trackEvent("login_otp_send_requested", {
      link_phone_mode: showPhoneOnly,
      ...eventGroupMeta("intent"),
      ...phaseMeta("verification"),
      ...attemptMeta,
      ...attemptBucketMeta(attemptMeta),
      ...authStateMeta(),
      ...authRequirementMeta(),
      ...loginPathMeta(),
      ...methodMeta("otp"),
      ...loginMeta(),
    });
    try {
      await sendOtp(normalizedPhone, "recaptcha-container", showPhoneOnly);
      setOtpSent(true);
    } catch (err) {
      const errorCode = errorCodeFromUnknown(err);
      setFailureCount((count) => count + 1);
      setFirstFailureAtMs((prev) => prev ?? Date.now());
      setLastFailureCode(errorCode);
      setLastFailureMethod("otp");
      trackEvent("login_otp_send_failed", {
        link_phone_mode: showPhoneOnly,
        error_code: errorCode,
        ...eventGroupMeta("failure"),
        ...phaseMeta("verification"),
        ...(activeOtpAttemptRef.current || {}),
        ...attemptBucketMeta(activeOtpAttemptRef.current),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("otp"),
        ...loginMeta(),
      });
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const otpAttemptMeta =
      activeOtpAttemptRef.current || ({ login_attempt: 0, method_attempt: 0 } as const);
    trackEvent("login_otp_verify_submitted", {
      link_phone_mode: showPhoneOnly,
      ...eventGroupMeta("intent"),
      ...phaseMeta("verification"),
      ...otpAttemptMeta,
      ...attemptBucketMeta(otpAttemptMeta),
      ...authStateMeta(),
      ...authRequirementMeta(),
      ...loginPathMeta(),
      ...methodMeta("otp"),
      ...loginMeta(),
    });
    try {
      await verifyOtp(code);
      setOtpVerified(true);
      trackEvent("login_success", {
        destination: normalizeNext(next),
        outcome: "verified",
        ...eventGroupMeta("outcome"),
        ...phaseMeta("outcome"),
        ...resolutionChannelMeta("otp_verified"),
        ...dwellMeta(),
        ...otpAttemptMeta,
        ...attemptBucketMeta(otpAttemptMeta),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("otp"),
        ...loginMeta(),
      });
      if (failureCount > 0) {
        trackEvent("login_failure_recovered", {
          destination: normalizeNext(next),
          recovered_from_failure: true,
          failure_count_before_success: failureCount,
          failure_count_bucket: failureCountBucket(failureCount),
          ...failureRecoveryMeta(),
          last_failure_code: lastFailureCode || "unknown_error",
          last_failure_method: lastFailureMethod || "unknown",
          ...eventGroupMeta("outcome"),
          ...phaseMeta("outcome"),
          ...resolutionChannelMeta("otp_verified"),
          ...dwellMeta(),
          ...otpAttemptMeta,
          ...attemptBucketMeta(otpAttemptMeta),
          ...linkPhoneMeta(),
          ...authStateMeta(),
          ...authRequirementMeta(),
          ...loginPathMeta(),
          ...methodMeta("otp"),
          ...loginMeta(),
        });
      }
      router.push(normalizeNext(next));
    } catch (err) {
      const errorCode = errorCodeFromUnknown(err);
      setFailureCount((count) => count + 1);
      setFirstFailureAtMs((prev) => prev ?? Date.now());
      setLastFailureCode(errorCode);
      setLastFailureMethod("otp");
      trackEvent("login_otp_verify_failed", {
        link_phone_mode: showPhoneOnly,
        error_code: errorCode,
        ...eventGroupMeta("failure"),
        ...phaseMeta("verification"),
        ...otpAttemptMeta,
        ...attemptBucketMeta(otpAttemptMeta),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("otp"),
        ...loginMeta(),
      });
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    setGoogleStarted(true);
    setGoogleResolved(false);
    const attemptMeta = nextAttemptMeta("google");
    activeGoogleAttemptRef.current = attemptMeta;
    trackEvent("login_google_signin_clicked", {
      ...eventGroupMeta("intent"),
      ...phaseMeta("auth"),
      ...attemptMeta,
      ...attemptBucketMeta(attemptMeta),
      ...linkPhoneMeta(),
      ...authStateMeta(),
      ...authRequirementMeta(),
      ...loginPathMeta(),
      ...methodMeta("google"),
      ...loginMeta(),
    });
    try {
      const p = await signInWithGoogle();
      const currentUser = getClientAuth().currentUser;
      if (canLeaveLogin(currentUser)) {
        setGoogleResolved(true);
        trackEvent("login_success", {
          destination: normalizeNext(next),
          outcome: "signed_in",
          ...eventGroupMeta("outcome"),
          ...phaseMeta("outcome"),
          ...resolutionChannelMeta("google_success"),
          ...dwellMeta(),
          ...linkPhoneMeta(),
          ...(activeGoogleAttemptRef.current || {}),
          ...attemptBucketMeta(activeGoogleAttemptRef.current),
          ...authStateMeta(),
          ...authRequirementMeta(),
          ...loginPathMeta(),
          ...methodMeta("google"),
          ...loginMeta(),
        });
        if (failureCount > 0) {
          trackEvent("login_failure_recovered", {
            destination: normalizeNext(next),
            recovered_from_failure: true,
            failure_count_before_success: failureCount,
            failure_count_bucket: failureCountBucket(failureCount),
            ...failureRecoveryMeta(),
            last_failure_code: lastFailureCode || "unknown_error",
            last_failure_method: lastFailureMethod || "unknown",
            ...eventGroupMeta("outcome"),
            ...phaseMeta("outcome"),
            ...resolutionChannelMeta("google_success"),
            ...dwellMeta(),
            ...(activeGoogleAttemptRef.current || {}),
            ...attemptBucketMeta(activeGoogleAttemptRef.current),
            ...linkPhoneMeta(),
            ...authStateMeta(),
            ...authRequirementMeta(),
            ...loginPathMeta(),
            ...methodMeta("google"),
            ...loginMeta(),
          });
        }
        router.push(normalizeNext(next));
      } else {
        setGoogleResolved(true);
        trackEvent("login_blocked_phone_required", {
          block_reason: "phone_verification_required",
          outcome: "blocked",
          ...eventGroupMeta("outcome"),
          ...phaseMeta("outcome"),
          ...resolutionChannelMeta("google_blocked"),
          ...dwellMeta(),
          ...linkPhoneMeta(),
          ...(activeGoogleAttemptRef.current || {}),
          ...attemptBucketMeta(activeGoogleAttemptRef.current),
          ...authStateMeta(),
          ...authRequirementMeta(),
          ...loginPathMeta(),
          ...methodMeta("google"),
          ...loginMeta(),
        });
      }
      // Otherwise stay on page — phone verification UI appears via showPhoneOnly
    } catch (err) {
      const errorCode = errorCodeFromUnknown(err);
      setFailureCount((count) => count + 1);
      setFirstFailureAtMs((prev) => prev ?? Date.now());
      setLastFailureCode(errorCode);
      setLastFailureMethod("google");
      setGoogleResolved(true);
      trackEvent("login_google_signin_failed", {
        error_code: errorCode,
        ...eventGroupMeta("failure"),
        ...phaseMeta("auth"),
        ...linkPhoneMeta(),
        ...(activeGoogleAttemptRef.current || {}),
        ...attemptBucketMeta(activeGoogleAttemptRef.current),
        ...authStateMeta(),
        ...authRequirementMeta(),
        ...loginPathMeta(),
        ...methodMeta("google"),
        ...loginMeta(),
      });
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--muted)]">Loading…</p>
      </div>
    );
  }

  const signedInEmail = user?.email || profile?.email;
  const signedInName = profile?.displayName || user?.displayName;

  return (
    <div className="rp-gradient-hero flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="rp-card w-full max-w-md p-6 sm:p-8">
        <p className="rp-badge">Secure sign-in</p>
        <h1 className="mt-4 font-serif text-3xl tracking-tight">
          {showPhoneOnly ? "Verify mobile" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {showPhoneOnly
            ? "Link your mobile with a one-time OTP. It is saved on your listing so renters can message you on WhatsApp."
            : "Sign in with Google or phone OTP. Google users verify mobile once before posting."}
        </p>

        {showPhoneOnly && (signedInEmail || signedInName) && (
          <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm">
            <p className="text-[var(--muted)]">Signed in as</p>
            <p className="font-medium text-[var(--brand-navy)]">
              {signedInName || signedInEmail}
            </p>
            {signedInName && signedInEmail && (
              <p className="text-xs text-[var(--muted)]">{signedInEmail}</p>
            )}
            <p className="mt-1 text-xs text-[var(--brand-orange)]">
              Link your mobile to finish setup
            </p>
          </div>
        )}

        <div id="recaptcha-container" className="mt-4" />

        {!confirmation ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <Input
              label="Mobile number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              required
            />
            <Button type="submit" fullWidth disabled={busy}>
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <Input
              label={linkMode ? "Code sent — link to your account" : "Verification code"}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
            />
            <Button type="submit" fullWidth disabled={busy}>
              Verify & continue
            </Button>
            <button
              type="button"
              className="w-full text-center text-xs font-medium text-[var(--brand-orange)] hover:underline"
              disabled={busy}
              onClick={() => {
                trackEvent("login_otp_cancelled", {
                  ...eventGroupMeta("navigation"),
                  ...phaseMeta("exit"),
                  ...linkPhoneMeta(),
                  ...(activeOtpAttemptRef.current || {}),
                  ...attemptBucketMeta(activeOtpAttemptRef.current),
                  ...authStateMeta(),
                  ...authRequirementMeta(),
                  ...loginPathMeta(),
                  ...methodMeta("otp"),
                  ...loginMeta(),
                });
                setOtpSent(false);
                setCode("");
                setError("");
                cancelOtp();
              }}
            >
              Use a different number
            </button>
          </form>
        )}

        {!showPhoneOnly && (
          <>
            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs text-[var(--muted)]">or</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={busy}
              onClick={handleGoogle}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </span>
            </Button>
          </>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          <Link
            href={appPath("/search")}
            className="text-[var(--accent)] hover:underline"
            onClick={() => {
              trackEvent("login_exit_clicked", {
                exit_target: appPath("/search"),
                exit_stage: loginStage(),
                ...eventGroupMeta("navigation"),
                ...phaseMeta("exit"),
                ...resolutionChannelMeta("manual_exit"),
                ...dwellMeta(),
                ...linkPhoneMeta(),
                ...authStateMeta(),
                ...authRequirementMeta(),
                ...loginPathMeta(),
                ...methodMeta("none"),
                ...loginMeta(),
              });
            }}
          >
            Continue browsing without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
