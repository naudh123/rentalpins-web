"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import ListingPhotosField, {
  type ListingPhotoSlot,
} from "@/components/post/ListingPhotosField";
import MapsApiKeyMissingNotice, {
  isGoogleMapsConfigured,
} from "@/components/MapsApiKeyMissingNotice";
import LocationPicker, { type PickedLocation } from "@/components/post/LocationPicker";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  MAIN_CATEGORIES,
  PRICE_UNITS,
  getSubCategories,
  isResidentialProperty,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  TENANT_PREFERENCE_OPTIONS,
} from "@/lib/categories";
import { parseListingAttributes } from "@/lib/listing-attributes";
import { getClientDb } from "@/lib/firebase-client";
import {
  buildFetchToken,
  buildPosition,
  createSearchableTitle,
  extractSearchKeywords,
  generateRankingKey,
} from "@/lib/listing-publish";
import { appPath, requirePhoneVerification } from "@/lib/config";
import { parsePostDraftListing } from "@/lib/draft-listing";
import { uploadListingImages } from "@/lib/storage-upload";
import { mapCallableError } from "@/lib/auth-errors";
import { trackEvent } from "@/lib/ga4";
import {
  improveListingText,
  persistListingContentAfterAiWithTimeout,
} from "@/lib/improve-listing-text";
import {
  isValidListingCoordinate,
  pickListingLocationName,
} from "@/lib/listing-location";
import {
  listingCoordsEqual,
  POST_LISTING_DESC_MAX,
  POST_LISTING_DESC_MIN,
  POST_LISTING_TITLE_MAX,
  POST_LISTING_TITLE_MIN,
} from "@/lib/post-listing-limits";

const POST_FLOW_VERSION = "2026-05-post-flow-v1";
const POST_FLOW_BATCH = 82;
const POST_DATA_SOURCE = "client_live";

interface Props {
  listingId?: string | null;
}

export default function PostListingForm({ listingId = null }: Props) {
  const router = useRouter();
  const { user, profile, canPostListing, needsPhoneLink, profileError, isBlocked } =
    useAuth();
  const isEditMode = Boolean(listingId);

  const [mainCategory, setMainCategory] = useState("Property");
  const subCategories = useMemo(
    () => getSubCategories(mainCategory),
    [mainCategory]
  );
  const [subCategory, setSubCategory] = useState("Room");
  const [bhk, setBhk] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [tenantPreference, setTenantPreference] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const isResidential = isResidentialProperty(mainCategory, subCategory);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("per month");
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [photoSlots, setPhotoSlots] = useState<ListingPhotoSlot[]>([]);
  const [draftLoadStatus, setDraftLoadStatus] = useState<
    "idle" | "loading" | "ready" | "missing" | "forbidden" | "live"
  >(listingId ? "loading" : "idle");
  const [error, setError] = useState("");
  const [aiNotice, setAiNotice] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [busy, setBusy] = useState(false);
  const wasAiImprovedRef = useRef(false);
  const aiImproveLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const aiImproveCategoryRef = useRef<{
    category: string;
    subCategory: string;
  } | null>(null);
  const preAiTitleRef = useRef<string | null>(null);
  const preAiDescRef = useRef<string | null>(null);
  // Synchronous re-entrancy guard: prevents a double-click from kicking off a
  // second submit before `busy` state has propagated (avoids duplicate writes).
  const submittingRef = useRef(false);
  const improvingRef = useRef(false);
  const isMountedRef = useRef(true);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function postFlowMeta() {
    return {
      post_flow_version: POST_FLOW_VERSION,
      post_flow_batch: POST_FLOW_BATCH,
      post_data_source: POST_DATA_SOURCE,
    };
  }

  useEffect(() => {
    if (!canPostListing) return;
    if (isEditMode && draftLoadStatus !== "ready") return;
    trackEvent("post_listing_form_viewed", {
      mode: isEditMode ? "edit" : "create",
      ...(listingId ? { listing_id: listingId } : {}),
      ...postFlowMeta(),
    });
  }, [canPostListing, draftLoadStatus, isEditMode, listingId]);

  function failValidation(reason: string, message: string) {
    setAiNotice(null);
    setError(message);
    trackEvent("post_listing_validation_failed", {
      reason,
      mode: isEditMode ? "edit" : "create",
      ...(listingId ? { listing_id: listingId } : {}),
      ...postFlowMeta(),
    });
  }

  function showAiError(text: string) {
    setError("");
    setAiNotice({ type: "error", text });
  }

  function invalidateAiImprovement(
    reason: "location" | "category",
    message: string
  ) {
    if (!wasAiImprovedRef.current) return;
    wasAiImprovedRef.current = false;
    aiImproveLocationRef.current = null;
    aiImproveCategoryRef.current = null;
    setAiNotice({ type: "info", text: message });
    trackEvent(
      reason === "location"
        ? "post_listing_ai_location_invalidated"
        : "post_listing_ai_category_invalidated",
      {
        mode: isEditMode ? "edit" : "create",
        ...(listingId ? { listing_id: listingId } : {}),
        ...postFlowMeta(),
      }
    );
  }

  function handleLocationChange(next: PickedLocation) {
    if (!isValidListingCoordinate(next.lat, next.lng)) {
      failValidation(
        "invalid_location",
        "Invalid map coordinates. Pick a location on the map."
      );
      return;
    }
    const anchor = aiImproveLocationRef.current;
    if (anchor && !listingCoordsEqual(anchor, next)) {
      invalidateAiImprovement(
        "location",
        "Location changed — run Improve with AI again so nearby places match your new pin."
      );
    }
    setLocation(next);
  }

  function handleMainCategoryChange(nextCategory: string) {
    const nextSub = getSubCategories(nextCategory)[0] ?? "Others";
    const anchor = aiImproveCategoryRef.current;
    if (
      anchor &&
      (anchor.category !== nextCategory || anchor.subCategory !== nextSub)
    ) {
      invalidateAiImprovement(
        "category",
        "Category changed — run Improve with AI again so the description matches your listing type."
      );
    }
    setMainCategory(nextCategory);
    setSubCategory(nextSub);
  }

  function handleSubCategoryChange(nextSub: string) {
    const anchor = aiImproveCategoryRef.current;
    if (anchor && anchor.subCategory !== nextSub) {
      invalidateAiImprovement(
        "category",
        "Subcategory changed — run Improve with AI again so the description matches your listing type."
      );
    }
    setSubCategory(nextSub);
  }

  async function handleImproveWithAi(options?: { forceRefresh?: boolean }) {
    if (improvingRef.current || isImproving) return;
    const forceRefresh = options?.forceRefresh === true;

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (trimmedDesc.length < POST_LISTING_DESC_MIN) {
      showAiError(
        `Write at least ${POST_LISTING_DESC_MIN} characters in the description first.`
      );
      return;
    }
    if (trimmedTitle.length < POST_LISTING_TITLE_MIN) {
      showAiError(
        `Title must be at least ${POST_LISTING_TITLE_MIN} characters before using AI improve.`
      );
      return;
    }
    if (!location) {
      showAiError(
        isGoogleMapsConfigured()
          ? "Set location on the map first — AI uses your pin to find nearby places."
          : "Google Maps is not configured here, so you cannot set a location. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the map and AI landmarks."
      );
      return;
    }

    improvingRef.current = true;
    setIsImproving(true);
    setAiNotice(null);
    setError("");

    trackEvent("post_listing_ai_improve_requested", {
      mode: isEditMode ? "edit" : "create",
      description_length: trimmedDesc.length,
      has_location: Boolean(location),
      force_refresh: forceRefresh,
      ...(listingId ? { listing_id: listingId } : {}),
      ...postFlowMeta(),
    });

    try {
      const result = await improveListingText({
        title: trimmedTitle,
        description: trimmedDesc,
        latitude: location.lat,
        longitude: location.lng,
        category: mainCategory,
        subCategory,
        ...(forceRefresh && listingId ? { listingId } : {}),
        ...(forceRefresh && location.label.trim()
          ? { locationName: location.label.trim() }
          : {}),
        forceRefresh,
      });

      if (!isMountedRef.current) return;

      const newTitle = result.improvedTitle.trim();
      const newDesc = result.improvedDescription.trim();
      const titleChanged = Boolean(newTitle && newTitle !== trimmedTitle);
      const descChanged = Boolean(newDesc && newDesc !== trimmedDesc);

      if (!result.success || (!titleChanged && !descChanged)) {
        showAiError(
          result.cached
            ? "Your text is already optimized (cached). Tap Regenerate for a fresh rewrite, or edit and try again."
            : "AI returned no changes. Add more detail to your description and try again."
        );
        trackEvent("post_listing_ai_improve_noop", {
          mode: isEditMode ? "edit" : "create",
          cached: Boolean(result.cached),
          success_flag: result.success,
          ...(listingId ? { listing_id: listingId } : {}),
          ...postFlowMeta(),
        });
        return;
      }

      if (!isMountedRef.current) return;

      if (preAiTitleRef.current === null) preAiTitleRef.current = trimmedTitle;
      if (preAiDescRef.current === null) preAiDescRef.current = trimmedDesc;

      if (titleChanged) setTitle(newTitle);
      if (descChanged) setDescription(newDesc);
      wasAiImprovedRef.current = true;
      aiImproveLocationRef.current = {
        lat: location.lat,
        lng: location.lng,
      };
      aiImproveCategoryRef.current = {
        category: mainCategory,
        subCategory,
      };

      const lang = result.detectedLanguage?.trim();
      const cacheNote = result.cached ? " (from cache)" : "";
      const trimNote =
        result.titleTrimmed || result.descriptionTrimmed
          ? " Some text was trimmed to fit length limits."
          : "";
      setAiNotice({
        type: "success",
        text: `Improved${cacheNote}!${lang ? ` (${lang})` : ""}${trimNote} Review and edit before publishing.`,
      });

      trackEvent("post_listing_ai_improve_succeeded", {
        mode: isEditMode ? "edit" : "create",
        cached: Boolean(result.cached),
        force_refresh: forceRefresh,
        title_trimmed: Boolean(result.titleTrimmed),
        description_trimmed: Boolean(result.descriptionTrimmed),
        detected_language: lang || "unknown",
        ...(listingId ? { listing_id: listingId } : {}),
        ...postFlowMeta(),
      });
    } catch (err) {
      if (!isMountedRef.current) return;
      showAiError(
        mapCallableError(err) || "AI improvement failed. You can still publish manually."
      );
      trackEvent("post_listing_ai_improve_failed", {
        mode: isEditMode ? "edit" : "create",
        ...(listingId ? { listing_id: listingId } : {}),
        ...postFlowMeta(),
      });
    } finally {
      improvingRef.current = false;
      if (isMountedRef.current) setIsImproving(false);
    }
  }

  useEffect(() => {
    if (!listingId || !user) return;

    let cancelled = false;
    setDraftLoadStatus("loading");

    void (async () => {
      try {
        const snap = await getDoc(doc(getClientDb(), "listings", listingId));
        if (cancelled) return;

        if (!snap.exists()) {
          setDraftLoadStatus("missing");
          return;
        }

        const draft = parsePostDraftListing(snap.id, snap.data());
        if (!draft) {
          setDraftLoadStatus("missing");
          return;
        }
        if (draft.ownerUid !== user.uid) {
          setDraftLoadStatus("forbidden");
          return;
        }
        if (draft.isActive) {
          setDraftLoadStatus("live");
          return;
        }

        setMainCategory(draft.category);
        setSubCategory(draft.subCategory);
        const attrs = parseListingAttributes(snap.data());
        setBhk(attrs?.bhk ?? "");
        setFurnishing(attrs?.furnishing ?? "");
        setTenantPreference(attrs?.tenantPreference ?? "");
        setAreaSqft(attrs?.areaSqft != null ? String(attrs.areaSqft) : "");
        setBathrooms(attrs?.bathrooms != null ? String(attrs.bathrooms) : "");
        setTitle(draft.title);
        setDescription(draft.description);
        setPrice(String(draft.price || ""));
        setPriceUnit(draft.priceUnit);
        setLocation({
          lat: draft.lat,
          lng: draft.lng,
          label: draft.locationName || `${draft.lat.toFixed(4)}, ${draft.lng.toFixed(4)}`,
        });
        const fullList = draft.imageUrls.length
          ? draft.imageUrls
          : draft.imageUrl
            ? [draft.imageUrl]
            : [];
        const thumbList = draft.imageThumbnails.length
          ? draft.imageThumbnails
          : fullList;
        const iconList = draft.imageIcons.length ? draft.imageIcons : fullList;

        setPhotoSlots(
          fullList.map((full, i) => ({
            id: `saved_${i}_${full.slice(-12)}`,
            kind: "saved" as const,
            full,
            thumbnail: thumbList[i] || full,
            icon: iconList[i] || full,
          }))
        );
        setDraftLoadStatus("ready");
      } catch {
        if (!cancelled) {
          setError("Could not load this draft.");
          setDraftLoadStatus("missing");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [listingId, user]);

  if (needsPhoneLink) {
    const postNext = listingId ? `/post?listingId=${listingId}` : "/post";
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl">Add your mobile number</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You signed in with Google. To post a listing, verify your mobile number
          once — renters will contact you on WhatsApp using this number.
        </p>
        <Link
          href={appPath(
            `/auth/login?link=1&next=${encodeURIComponent(postNext)}`
          )}
          className="mt-6 inline-block rounded-full bg-[var(--accent)] px-6 py-3 font-medium text-[var(--accent-fg)]"
        >
          Verify mobile (OTP)
        </Link>
      </div>
    );
  }

  if (draftLoadStatus === "loading") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-[var(--muted)]">
        Loading draft…
      </div>
    );
  }

  if (draftLoadStatus === "missing") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl">Draft not found</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">It may have been removed.</p>
        <Link href={appPath("/post")} className="mt-6 inline-block text-[var(--accent)]">
          Create new listing
        </Link>
      </div>
    );
  }

  if (draftLoadStatus === "forbidden") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl">Access denied</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">You can only edit your own drafts.</p>
        <Link href={appPath("/profile")} className="mt-6 inline-block text-[var(--accent)]">
          My listings
        </Link>
      </div>
    );
  }

  if (draftLoadStatus === "live") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl">Listing is live</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Active listings cannot be edited here yet.
        </p>
        <Link
          href={appPath(`/listings/${listingId}`)}
          className="mt-6 inline-block text-[var(--accent)]"
        >
          View listing
        </Link>
      </div>
    );
  }

  if (user && profileError) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Account unavailable</h1>
        <p className="mt-2 text-sm text-red-700">{profileError}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">Refresh the page or sign in again.</p>
        <Link href={appPath("/auth/login?next=/post")} className="mt-6 text-[var(--accent)]">
          Sign in
        </Link>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl text-[var(--brand-navy)]">Account restricted</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You cannot post listings on this account. Contact support if you need help.
        </p>
        <Link href={appPath("/profile")} className="mt-6 text-[var(--accent)]">
          My profile
        </Link>
      </div>
    );
  }

  if (!canPostListing) {
    const postNext = listingId ? `/post?listingId=${listingId}` : "/post";
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-[var(--muted)]">
          {user
            ? "Complete sign-in to post a listing."
            : "Sign in to post a listing."}
        </p>
        <Link
          href={appPath(`/auth/login?next=${encodeURIComponent(postNext)}`)}
          className="mt-4 text-[var(--accent)]"
        >
          {user ? "Continue sign-in" : "Sign in"}
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    if (submittingRef.current || busy) return;

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    if (trimmedTitle.length < POST_LISTING_TITLE_MIN) {
      failValidation(
        "title_too_short",
        `Title must be at least ${POST_LISTING_TITLE_MIN} characters.`
      );
      return;
    }
    if (trimmedTitle.length > POST_LISTING_TITLE_MAX) {
      failValidation(
        "title_too_long",
        `Title must be ${POST_LISTING_TITLE_MAX} characters or fewer.`
      );
      return;
    }
    if (trimmedDesc.length < POST_LISTING_DESC_MIN) {
      failValidation(
        "description_too_short",
        `Description must be at least ${POST_LISTING_DESC_MIN} characters.`
      );
      return;
    }
    if (trimmedDesc.length > POST_LISTING_DESC_MAX) {
      failValidation(
        "description_too_long",
        `Description must be ${POST_LISTING_DESC_MAX} characters or fewer.`
      );
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      failValidation("invalid_price", "Enter a valid price.");
      return;
    }
    if (!location) {
      failValidation(
        isGoogleMapsConfigured() ? "missing_location" : "maps_not_configured",
        isGoogleMapsConfigured()
          ? "Pick a location on the map."
          : "Google Maps is not configured — set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local, restart the dev server, then pick a location."
      );
      return;
    }
    if (!isValidListingCoordinate(location.lat, location.lng)) {
      failValidation(
        "invalid_location",
        "Invalid map coordinates. Pick a location on the map."
      );
      return;
    }
    const locationNameForSave = pickListingLocationName(location.label);
    if (!photoSlots.length) {
      failValidation("missing_photos", "Add at least one photo.");
      return;
    }
    if (isResidential && !bhk) {
      failValidation("missing_bhk", "Select the BHK configuration.");
      return;
    }
    if (isResidential && !furnishing) {
      failValidation("missing_furnishing", "Select the furnishing status.");
      return;
    }

    const ownerPhone = user.phoneNumber || profile.phone || "";
    const phoneDigits = ownerPhone.replace(/\D/g, "");
    if (requirePhoneVerification && !user.phoneNumber) {
      failValidation(
        "phone_not_verified",
        "Verify your mobile number before posting (needed for WhatsApp contact)."
      );
      return;
    }
    if (phoneDigits.length < 8) {
      failValidation(
        "phone_missing",
        "A valid mobile number is required so renters can reach you on WhatsApp."
      );
      return;
    }

    setAiNotice(null);
    setError("");
    submittingRef.current = true;
    setBusy(true);

    try {
      const searchableTitle = createSearchableTitle(trimmedTitle);
      const db = getClientDb();

      const savedCount = photoSlots.filter((s) => s.kind === "saved").length;
      const newFiles = photoSlots
        .filter((s): s is Extract<ListingPhotoSlot, { kind: "new" }> => s.kind === "new")
        .map((s) => s.file);

      let uploadedNew: Awaited<ReturnType<typeof uploadListingImages>> = [];
      if (newFiles.length) {
        setProgress("Uploading photos…");
        uploadedNew = await uploadListingImages(
          user.uid,
          newFiles,
          savedCount,
          (fileIndex, pct) =>
            setProgress(
              `Uploading photo ${savedCount + fileIndex + 1} of ${photoSlots.length}… ${pct}%`
            )
        );
      }

      const imageUrls: string[] = [];
      const imageThumbnails: string[] = [];
      const imageIcons: string[] = [];
      const imagesFull: string[] = [];
      let newIdx = 0;

      for (const slot of photoSlots) {
        if (slot.kind === "saved") {
          imageUrls.push(slot.full);
          imageThumbnails.push(slot.thumbnail);
          imageIcons.push(slot.icon);
          imagesFull.push(slot.full);
        } else {
          const urls = uploadedNew[newIdx++];
          imageUrls.push(urls.full);
          imageThumbnails.push(urls.thumbnail);
          imageIcons.push(urls.icon);
          imagesFull.push(urls.full);
        }
      }

      // Structured attributes (residential property only). Empty map clears any
      // stale attributes when a draft is re-categorised away from property.
      const attributes: Record<string, string | number> = {};
      const attrKeywords: string[] = [];
      if (isResidential) {
        if (bhk) {
          attributes.bhk = bhk;
          const digits = bhk.replace(/\D/g, "");
          if (digits) attrKeywords.push(`${digits}bhk`, `${digits} bhk`);
          attrKeywords.push(bhk.toLowerCase());
        }
        if (furnishing) {
          attributes.furnishing = furnishing;
          attrKeywords.push(furnishing.toLowerCase());
        }
        if (tenantPreference) attributes.tenantPreference = tenantPreference;
        const areaNum = parseFloat(areaSqft);
        if (Number.isFinite(areaNum) && areaNum > 0) attributes.areaSqft = areaNum;
        const bathNum = parseInt(bathrooms, 10);
        if (Number.isFinite(bathNum) && bathNum > 0) attributes.bathrooms = bathNum;
      }

      const fields = {
        title: trimmedTitle,
        description: trimmedDesc,
        originalTitle: preAiTitleRef.current ?? trimmedTitle,
        originalDescription: preAiDescRef.current ?? trimmedDesc,
        price: parseFloat(price),
        priceUnit,
        category: mainCategory,
        subCategory,
        attributes,
        imageUrls,
        imageIcons,
        imageThumbnails,
        imagesFull,
        searchableTitle,
        searchKeywords: Array.from(
          new Set([...extractSearchKeywords(searchableTitle), ...attrKeywords])
        ),
        position: buildPosition(location.lat, location.lng),
        locationName: locationNameForSave,
        fetchToken: buildFetchToken(location.lat, location.lng, mainCategory),
        updatedAt: serverTimestamp(),
      };

      let savedListingId = listingId ?? "";

      if (isEditMode && listingId) {
        setProgress("Saving changes…");
        await updateDoc(doc(db, "listings", listingId), fields);
        savedListingId = listingId;
        trackEvent("listing_draft_updated", {
          listing_id: listingId,
          ...postFlowMeta(),
        });
      } else {
        setProgress("Saving draft…");
        const ref = await addDoc(collection(db, "listings"), {
          ...fields,
          ownerUid: user.uid,
          ownerPhone,
          iso: profile.homeIso,
          homeIso: profile.homeIso,
          billingCurrency: profile.billingCurrency,
          rankingKey: generateRankingKey(),
          isActive: false,
          createdAt: serverTimestamp(),
          appType: "web",
        });
        savedListingId = ref.id;
        trackEvent("listing_draft_created", {
          listing_id: ref.id,
          ...postFlowMeta(),
        });
      }

      if (wasAiImprovedRef.current && savedListingId && location) {
        setProgress("Saving search content…");
        try {
          await persistListingContentAfterAiWithTimeout({
            listingId: savedListingId,
            title: trimmedTitle,
            description: trimmedDesc,
            latitude: location.lat,
            longitude: location.lng,
            category: mainCategory,
            subCategory,
            locationName: locationNameForSave,
          });
          trackEvent("post_listing_ai_persist_succeeded", {
            listing_id: savedListingId,
            ...postFlowMeta(),
          });
        } catch (persistErr) {
          const reason =
            persistErr instanceof Error ? persistErr.message : "unknown";
          trackEvent("post_listing_ai_persist_failed", {
            listing_id: savedListingId,
            reason,
            ...postFlowMeta(),
          });
        }
      }

      router.push(appPath(`/post/activate?listingId=${savedListingId}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save listing");
    } finally {
      submittingRef.current = false;
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-24 md:pb-8">
      <p className="rp-badge">List on the map</p>
      <h1 className="mt-2 font-serif text-3xl text-[var(--brand-navy)]">
        {isEditMode ? "Edit draft" : "Post a listing"}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {isEditMode
          ? "Update your draft, then continue to activation and payment."
          : "Step 1: save draft · Step 2: choose plan & pay to go live (same as the app)."}
      </p>

      {!isGoogleMapsConfigured() && (
        <MapsApiKeyMissingNotice className="mt-4" />
      )}

      <form onSubmit={onSubmit} className="rp-card mt-6 space-y-5 p-5 sm:p-6">
        <div>
          <label className="rp-label">Category</label>
          <select
            value={mainCategory}
            onChange={(e) => handleMainCategoryChange(e.target.value)}
            className="rp-input"
          >
            {MAIN_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="rp-label">Subcategory</label>
          <select
            value={subCategory}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            className="rp-input"
          >
            {subCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="rp-label">Photos (first is cover)</label>
          <div className="mt-1">
            <ListingPhotosField
              slots={photoSlots}
              onChange={setPhotoSlots}
              disabled={busy}
            />
          </div>
        </div>

        <div>
          <label className="rp-label">
            Location on map <span className="text-[var(--accent)]">*</span>
          </label>
          <p className="mb-2 text-xs text-[var(--muted)]">
            Set location before title and AI — the server uses your pin for nearby
            landmarks (schools, metro, malls, etc.).
          </p>
          <LocationPicker
            value={location}
            onChange={handleLocationChange}
            prefillCurrentLocationOnMount={!isEditMode}
            homeIso={profile?.homeIso}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label className="rp-label mb-0">Title</label>
            <span
              className={`text-xs ${
                title.trim().length >= POST_LISTING_TITLE_MIN
                  ? "text-[var(--muted)]"
                  : "text-amber-600"
              }`}
            >
              {title.trim().length}/{POST_LISTING_TITLE_MAX} · min{" "}
              {POST_LISTING_TITLE_MIN}
            </span>
          </div>
          <input
            placeholder="e.g. Furnished 2BHK near Sector 17"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={POST_LISTING_TITLE_MIN}
            maxLength={POST_LISTING_TITLE_MAX}
            className="rp-input mt-1"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="rp-label">Price</label>
            <input
              type="number"
              placeholder="Amount"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={1}
              className="rp-input"
            />
          </div>
          <div className="w-36">
            <label className="rp-label">Unit</label>
            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              className="rp-input !px-2 text-sm"
            >
              {PRICE_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isResidential && (
          <div className="space-y-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg)]/40 p-4">
            <p className="text-xs font-medium text-[var(--brand-navy)]">
              Property details{" "}
              <span className="font-normal text-[var(--muted)]">
                — better details rank higher and convert more
              </span>
            </p>
            <div>
              <label className="rp-label">
                BHK <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {BHK_OPTIONS.map((opt) => {
                  const active = bhk === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBhk(active ? "" : opt)}
                      className={`rp-chip px-3 py-1.5 text-xs ${active ? "rp-chip-active" : ""}`}
                      aria-pressed={active}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="rp-label">
                  Furnishing <span className="text-[var(--accent)]">*</span>
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="rp-input"
                >
                  <option value="">Select…</option>
                  {FURNISHING_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="rp-label">Tenant preference</label>
                <select
                  value={tenantPreference}
                  onChange={(e) => setTenantPreference(e.target.value)}
                  className="rp-input"
                >
                  <option value="">Any</option>
                  {TENANT_PREFERENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="rp-label">Area (sq ft)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 950"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className="rp-input"
                />
              </div>
              <div>
                <label className="rp-label">Bathrooms</label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 2"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="rp-input"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label className="rp-label mb-0">Description</label>
            <span
              className={`text-xs ${
                description.trim().length >= POST_LISTING_DESC_MIN &&
                description.length <= POST_LISTING_DESC_MAX
                  ? "text-[var(--muted)]"
                  : "text-amber-600"
              }`}
            >
              {description.trim().length}/{POST_LISTING_DESC_MAX} · min{" "}
              {POST_LISTING_DESC_MIN}
            </span>
          </div>
          <textarea
            placeholder="Describe condition, facilities, rules, availability, and exact nearby landmark"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={POST_LISTING_DESC_MIN}
            maxLength={POST_LISTING_DESC_MAX}
            rows={4}
            className="rp-input mt-1 min-h-[120px] resize-y"
          />
          {description.trim().length >= POST_LISTING_DESC_MIN &&
            title.trim().length >= POST_LISTING_TITLE_MIN && (
            <button
              type="button"
              disabled={busy || isImproving || !location}
              onClick={() => void handleImproveWithAi()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100 disabled:opacity-50"
            >
              {isImproving ? (
                <>
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"
                    aria-hidden
                  />
                  Improving with AI…
                </>
              ) : (
                <>✨ Improve with AI</>
              )}
            </button>
          )}
          {description.trim().length >= POST_LISTING_DESC_MIN &&
            title.trim().length >= POST_LISTING_TITLE_MIN &&
            !location && (
            <p className="mt-2 text-xs text-amber-700">
              Set location above to enable AI improve with nearby places.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={busy || !location}
          className="rp-btn rp-btn-primary w-full py-3.5 disabled:opacity-50"
        >
          {busy
            ? progress || "Saving…"
            : isEditMode
              ? "Save changes & continue →"
              : "Save draft & continue →"}
        </button>

        {isEditMode && listingId && (
          <Link
            href={appPath(`/post/activate?listingId=${listingId}`)}
            className="block text-center text-sm text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Skip to activation →
          </Link>
        )}
      </form>

      {aiNotice && (
        <p
          className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
            aiNotice.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : aiNotice.type === "info"
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {aiNotice.text}
          {aiNotice.type === "success" && !isImproving && !busy && (
            <button
              type="button"
              disabled={isImproving || busy}
              className="ml-2 font-semibold underline disabled:opacity-50"
              onClick={() => void handleImproveWithAi({ forceRefresh: true })}
            >
              Regenerate
            </button>
          )}
          {aiNotice.type === "error" && !isImproving && !busy && (
            <>
              <button
                type="button"
                disabled={isImproving || busy}
                className="ml-2 font-semibold underline disabled:opacity-50"
                onClick={() => void handleImproveWithAi()}
              >
                Retry
              </button>
              {aiNotice.text.includes("cached") && (
                <button
                  type="button"
                  disabled={isImproving || busy}
                  className="ml-2 font-semibold underline disabled:opacity-50"
                  onClick={() => void handleImproveWithAi({ forceRefresh: true })}
                >
                  Regenerate
                </button>
              )}
            </>
          )}
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
