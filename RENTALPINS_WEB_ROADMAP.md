# RentalPins Web Roadmap (Locked Decisions)

## Locked product decisions (confirmed)

| Decision | Choice |
|----------|--------|
| Production site | **Replace** `www.rentalpins.com` (not a parallel beta on production) |
| Launch model | **Single cutover** when the final website is fully complete — no phased public launch |
| Timeline | **No rush** — prioritize quality and completeness over speed |
| Staging | `https://www.rentalpins.com/staging` |
| Implementation base | `C:\RentIt_Dev\apps\RentalPins_Full_web` |
| Auth (web) | **Firebase Auth phone OTP** directly (+ Google login per prior choice) |
| Product scope | **Global SaaS** — country-agnostic base for search, listings, payments, and UX |
| Maps | **Google Maps** |
| Primary lead CTA | **WhatsApp** — each listing uses **owner’s phone number** (`ownerPhone`) |
| Phone requirement | User **must provide mobile number** and **verify (Firebase OTP)** before posting a listing |
| Verification rollout | **Exempt verification initially** on staging/early build; enforce before production cutover |
| Mobile | **Mobile-first** (ad traffic priority) |
| SEO | Preserve **70+ indexed URLs**; no broken links at cutover |
| Backend | Existing **Firestore** schema — add-only, no breaking changes for Android/iOS app |
| Flutter | Keep Flutter for **Android + iOS only**; remove Flutter Web dependency |

## Build vs launch (important distinction)

- **Internal build** may be organized in workstreams (map, auth, post-listing, SEO, GA4, etc.).
- **Public launch** happens once: swap production to the new site when feature-complete and QA passes.
- Current production site stays live until cutover day.

## Vision

- Premium, ultra-luxury map-first rental discovery (beyond Zillow-style UX).
- Same Firebase project / Firestore data as mobile apps.
- Global defaults: multi-country URLs, currency display, locale-ready copy, ISO-aware listing fields (`homeIso`, `billingCurrency`, etc.).

## Hard guardrails

1. **URL stability** — keep existing public paths; `301` only if unavoidable.
2. **Firestore compatibility** — no renames/removals of fields the Android app uses.
3. **Privileged writes** — payments, activation, invoices via **Cloud Functions** only.
4. **SEO cutover checklist** — sitemap, canonicals, redirects, GSC validation before DNS/switch.

## Recommended stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js + TypeScript |
| UI | Tailwind + shadcn/ui + Framer Motion (subtle) |
| Maps | Google Maps JavaScript API |
| Reads | Firebase Admin (server) for listings/SEO pages |
| Auth | Firebase Auth (phone OTP + Google) |
| Writes | Cloud Functions + Firestore rules-safe client writes |
| Analytics | GA4 (consent-aware) |
| Hosting | TBD (Vercel vs Firebase Hosting) |

## Global SaaS architecture notes

- **Location model**: country → city → area (existing rentals URL pattern); extensible for new markets.
- **User profile**: respect `homeIso`, `billingCurrency`, phone E.164, `verifiedLevel`.
- **Listings**: geohash + `position.geopoint`; `isActive` gate for public search.
- **Payments**: gateway routing by region (Razorpay / PayPal via existing functions) — web calls functions, never direct `payments` writes.
- **i18n**: plan for English first; structure strings for future locales.
- **Time zones**: store UTC in Firestore; display in user/local context on web.

## Full v1 launch scope (all required — confirmed)

**Included at cutover:** map + search + listing detail + post-listing + payments + chat.

**Not in scope for “partial launch”:** post-listing-only or map-only releases.

### Discovery & map
- Map + list sync, viewport search, filters, sort
- Native listing detail (no Flutter web handoff)
- Saved searches / alerts
- Mobile bottom-sheet map UX

### Auth & accounts
- Firebase phone OTP
- Google sign-in
- User profile sync to `users/{uid}` (existing fields)

### Listings & leads
- Post listing from web (rules-compliant: `isActive: false` until activation)
- **Phone verified** before post (Firebase phone OTP); optional exemption flag during early staging only
- WhatsApp CTA on listing detail → `wa.me` / WhatsApp link using **`ownerPhone`** on listing doc
- In-app **chat** (`chat_rooms` + messages) — parity with mobile

### Monetization (parity with app)
- Plan selection + payment via Cloud Functions (Razorpay/PayPal)
- Promotions / boosts where applicable

### SEO & content
- All current indexed routes live
- Blog + legal pages
- Sitemap, robots, JSON-LD
- GA4 full event dictionary

### Quality gates before cutover
- [ ] Zero 404 on top 70+ indexed URLs
- [ ] Lighthouse mobile performance targets (LCP, INP, CLS)
- [ ] Firestore rules/index validation for all web queries
- [ ] Android app regression smoke test (same Firebase project)
- [ ] Staging sign-off

## SEO preservation (single cutover)

- Export current sitemap + GSC URL list from production.
- Map 1:1 routes in new Next.js app.
- Middleware for legacy paths if any slug changed.
- Post-cutover: monitor GSC coverage 2–4 weeks.

## GA4 core events

`search_initiated`, `map_viewport_changed`, `map_view_reset_clicked`, `map_location_search_cleared`, `map_use_current_location_applied`, `map_use_current_location_succeeded`, `map_use_current_location_failed`, `map_keyboard_shortcut_used`, `map_fetch_retry_clicked`, `map_empty_state_reset_clicked`, `map_mobile_sheet_toggled`, `map_listing_preview_closed`, `map_cluster_clicked`, `map_filters_cleared`, `map_selection_cleared`, `map_fit_all_results_clicked`, `map_location_geocoded`, `map_location_geocode_failed`, `map_search_view_restored`, `saved_search_view_list_clicked`, `filter_applied`, `listing_detail_viewed`, `listing_detail_jump_links_shown`, `listing_detail_section_jump`, `listing_detail_hash_focus_restored`, `listing_contact_section_viewed`, `listing_detail_not_found_viewed`, `listing_detail_not_found_cta_clicked`, `listing_detail_error_viewed`, `listing_detail_error_retry_clicked`, `listing_detail_error_back_to_map_clicked`, `listing_view_counted`, `listing_view_count_failed`, `listing_back_clicked`, `listing_map_link_clicked`, `listing_map_snippet_shown`, `listing_reviews_section_viewed`, `listing_review_submitted`, `listing_review_login_redirect`, `listing_owner_profile_clicked`, `listing_reported`, `listing_report_opened`, `listing_report_modal_closed`, `listing_report_login_redirect`, `listing_gallery_opened`, `listing_gallery_photo_changed`, `listing_related_clicked`, `listing_recently_viewed_rail_shown`, `listing_owner_rail_viewed`, `listing_similar_rail_viewed`, `listing_save_login_redirect`, `contact_owner_login_redirect`, `contact_owner_failed`, `listing_impression`, `listing_pin_clicked`, `listing_card_clicked`, `listing_saved`, `listing_shared`, `search_link_copied`, `saved_search_opened`, `saved_search_deleted`, `saved_search_alert_toggled`, `saved_search_keyboard_shortcut_used`, `saved_search_save_failed`, `saved_search_save_login_redirect`, `saved_search_save_blocked_no_view`, `saved_search_already_exists`, `saved_search_reactivated`, `chat_filter_changed`, `chat_mark_all_read`, `chat_keyboard_shortcut_used`, `chat_search_cleared`, `chat_jump_to_latest_clicked`, `contact_owner_started`, `lead_submitted`, `search_alert_created`, `checkout_started`, `payment_success`, `listing_published`, `post_listing_form_viewed`, `post_listing_validation_failed`, `post_activate_viewed`, `post_activate_schema_summary_viewed`, `post_activate_return_visit_viewed`, `post_activate_abandoned_before_checkout`, `post_activate_plans_loaded`, `post_activate_plans_shown`, `post_activate_wait_timed_out`, `post_activate_wait_retry_clicked`, `post_activate_wait_resolved`, `post_activate_status_viewed`, `post_activate_payment_dismissed`, `post_activate_payment_failed`, `post_activate_missing_listing_id`, `post_activate_plans_empty_viewed`, `post_activate_plans_error_viewed`, `post_activate_plan_selected`, `post_activate_exit_clicked`, `post_activate_plans_retry_clicked`, `post_activate_plans_retry_result`, `login_schema_summary_viewed`, `login_return_visit_viewed`, `login_failure_summary_viewed`, `login_failure_recovered`, `login_viewed`, `login_redirected_after_auth`, `login_success`, `login_blocked_phone_required`, `login_abandoned_after_otp_sent`, `login_abandoned_after_google_click`, `login_otp_send_requested`, `login_otp_send_failed`, `login_otp_verify_submitted`, `login_otp_verify_failed`, `login_google_signin_clicked`, `login_google_signin_failed`, `login_otp_cancelled`

Activation telemetry enrichment: `post_activate_wait_resolved` and `post_activate_exit_clicked` now carry dwell-time dimensions (`dwell_seconds`, `dwell_bucket`) for friction analysis.
Activation telemetry enrichment: `checkout_started`, `post_activate_payment_failed`, and `post_activate_payment_dismissed` now carry attempt dimensions (`checkout_attempt`, `plan_attempt`) for retry/failure sequencing analysis.
Activation telemetry enrichment: `payment_success` and `listing_published` now carry attempt + dwell dimensions (`checkout_attempt`, `plan_attempt`, `dwell_seconds`, `dwell_bucket`) for end-to-end conversion analysis.
Activation telemetry enrichment: checkout start/failure/dismiss flows now carry `plan_position` for consistent position-based funnel analysis.
Activation telemetry enrichment: activation selection/checkout/success flow now carries normalized `plan_signature` for easier tier-level conversion and failure analysis.
Activation telemetry enrichment: plan impression event (`post_activate_plans_shown`) now carries ordered `plan_signatures` to align impression and outcome funnels.
Activation telemetry enrichment: activation selection/checkout/success events now carry `visible_plan_count` and `has_multiple_plans` for fast option-set segmentation.
Activation telemetry enrichment: `post_activate_plans_retry_result` now carries `visible_plan_count` and `has_multiple_plans` for option-set-segmented retry recovery analysis.
Activation telemetry enrichment: `post_activate_plans_loaded` and `post_activate_plans_empty_viewed` now carry `visible_plan_count` and `has_multiple_plans` for consistent option-set context across availability states.
Activation telemetry enrichment: `post_activate_plans_loaded` now carries ordered `plan_signatures` for stronger linkage between availability and tier-level conversion outcomes.
Activation telemetry enrichment: plan availability/retry events now carry normalized `availability_state` (`ready`/`empty`/`error`) for unified state-level filtering.
Activation telemetry enrichment: `post_activate_plans_retry_clicked` now carries pre-retry `availability_state` + option-set context (`visible_plan_count`, `has_multiple_plans`) for intent diagnostics.
Activation telemetry enrichment: `post_activate_plans_retry_clicked` now carries `retry_count_before_click` and `retry_count_after_click` for explicit retry-intent sequencing.
Activation telemetry enrichment: `post_activate_wait_retry_clicked` now carries `retry_count_before_click` and `retry_count_after_click` for wait-retry sequencing parity.
Activation telemetry enrichment: `post_activate_wait_retry_clicked` now carries `availability_state` + option-set context (`visible_plan_count`, `has_multiple_plans`) for retry-intent context parity.
Activation telemetry enrichment: `post_activate_plan_selected`, `checkout_started`, and checkout outcome events now include explicit `availability_state: "ready"` for uniform state filtering.
Activation telemetry enrichment: `payment_success` and `listing_published` now include explicit `availability_state: "ready"` for full activation end-state consistency.
Activation telemetry enrichment: `post_activate_viewed` now includes `availability_state` plus option-set context (`visible_plan_count`, `has_multiple_plans`) for consistent entry segmentation.
Activation telemetry enrichment: `post_activate_status_viewed` now includes `availability_state` plus option-set context (`visible_plan_count`, `has_multiple_plans`) for consistent state-transition segmentation.
Activation telemetry enrichment: `post_activate_missing_listing_id` now includes `availability_state` plus option-set context (`visible_plan_count`, `has_multiple_plans`) for guardrail-path segmentation parity.
Activation telemetry enrichment: `post_activate_wait_timed_out` now includes `availability_state` plus option-set context (`visible_plan_count`, `has_multiple_plans`) for timeout-path segmentation parity.
Activation telemetry enrichment: `post_activate_wait_resolved` now includes `availability_state` plus option-set context (`visible_plan_count`, `has_multiple_plans`) for resolved-wait segmentation parity.
Activation telemetry refinement: selection/checkout/outcome/success events now source state/context from a shared checkout-state helper instead of hardcoded ready-state payloads.
Activation telemetry enrichment: retry events now include `retry_channel` (`plan_retry` / `wait_retry`) to compare retry branches in a single reporting dimension.
Activation telemetry enrichment: wait-path timeout/resolution events now explicitly include `retry_channel: "wait_retry"` for branch-key consistency.
Activation telemetry enrichment: non-retry activation events now carry `retry_channel: "none"` so branch segmentation is complete and null-free across the funnel.
Activation telemetry enrichment: `post_activate_exit_clicked` now carries `availability_state` plus option-set context (`visible_plan_count`, `has_multiple_plans`) for exit-path segmentation parity.
Activation telemetry enrichment: key activation events now carry normalized `activation_phase` (`entry`, `availability`, `selection`, `checkout`, `wait`, `outcome`, `exit`) for cleaner stage-level reporting.
Activation telemetry refinement: `post_activate_plans_retry_clicked` now includes `activation_phase` to complete phase tagging across activation telemetry.
Activation telemetry versioning: activation events now carry `activation_flow_version` (`2026-05-post-activate-v1`) to support schema evolution comparisons.
Activation telemetry taxonomy: activation events now carry `activation_event_group` (`entry`, `availability`, `selection`, `payment`, `retry`, `outcome`, `navigation`) for compact high-level grouping.
Activation telemetry taxonomy: activation events now carry `activation_path` (`normal`, `plan_retry`, `wait_retry`, `guardrail`) for single-dimension journey segmentation.
Activation telemetry QA marker: activation events now carry `activation_context_complete: true` for straightforward validation filters.
Activation telemetry schema tag: activation events now carry `activation_schema_fields` for low-friction schema drift checks.
Activation telemetry rollout marker: activation events now carry `activation_batch` for direct release/batch correlation in reporting.
Activation schema summary event now captures `auth_state` and is emitted for unauthenticated activation visits (before login redirect).
Activation entry/guardrail events now carry `auth_state` (`authenticated` / `unauthenticated`) for straightforward auth-state segmentation.
Activation auth coverage: remaining activation events now carry `auth_state` through shared metadata helper for end-to-end auth segmentation parity.
Activation telemetry source marker: activation events now carry `activation_data_source: "client_live"` for source-level segmentation and QA filtering.
Post flow telemetry metadata: draft/form events now carry `post_flow_version`, `post_flow_batch`, and `post_data_source` for cross-page rollout/source parity.
Login flow telemetry metadata: login events now carry `login_flow_version`, `login_flow_batch`, `login_data_source`, and `login_schema_fields` for rollout/source/schema parity.
Login flow context parity: login events now carry normalized `auth_state` and `login_method` for consistent auth-state and method segmentation.
Login schema QA telemetry: `login_schema_summary_viewed` now fires on login entry with shared login metadata + context fields for quick payload completeness checks.
Login outcome telemetry: login flow now emits `login_success` and `login_blocked_phone_required` to close method-level intent-to-outcome funnel analysis.
Login attempt telemetry: OTP and Google intent/failure/outcome events now carry `login_attempt` and `method_attempt` for retry-depth funnel diagnostics.
Login abandonment telemetry: login flow now emits `login_abandoned_after_otp_sent` when users exit after OTP send and before verify.
Login Google abandonment telemetry: login flow now emits `login_abandoned_after_google_click` when users exit after Google click and before a success/failure/block resolution event.
Login dwell telemetry: login outcome/abandonment events now carry `dwell_seconds` and `dwell_bucket` for latency-aware conversion and drop-off analysis.
Login exit telemetry: login flow now emits `login_exit_clicked` on continue-browsing exits with `exit_target`, `exit_stage`, and dwell context.
Login failure taxonomy telemetry: OTP/Google failure events now carry normalized `error_code` for reason-level failure segmentation.
Login auth-requirement telemetry: login events now carry normalized `auth_requirement` (`phone_required`/`optional`) for requirement-based funnel segmentation.
Login path taxonomy telemetry: login events now carry normalized `login_path` (`standard`/`link_phone`/`phone_gate`) for branch-level journey segmentation.
Login payload completeness marker: login events now carry `login_context_complete: true` for easy QA filtering of complete payloads.
Login resolution-channel telemetry: login completion/abandonment/exit events now carry `resolution_channel` for normalized session-resolution segmentation.
Login event-group telemetry: login events now carry normalized `login_event_group` (`entry`/`intent`/`failure`/`outcome`/`abandonment`/`navigation`) for compact top-level grouping.
Login phase telemetry: login events now carry normalized `login_phase` (`entry`/`auth`/`verification`/`outcome`/`abandonment`/`exit`) for stage-level segmentation.
Login attempt-depth telemetry: attempt-based OTP/Google events now carry `method_attempt_bucket` (`1`/`2`/`3`/`4_plus`) for compact retry-depth segmentation.
Login link-mode parity telemetry: all login events now consistently carry `link_phone_mode` (including Google/outcome/abandon/exit branches) for complete link-mode segmentation.
Login return-visit telemetry: repeat visits now emit `login_return_visit_viewed` with `return_visit_count` via session-scoped tracking.
Login failure-summary telemetry: aggregated failure snapshots now emit `login_failure_summary_viewed` with `failure_count`, `last_failure_code`, and `last_failure_method`.
Login failure-recovery telemetry: successful post-failure completions now emit `login_failure_recovered` with `failure_count_before_success` plus last-known failure context.
Login recovery implementation parity: `login_failure_recovered` now fires across auto-redirect, OTP success, and Google success resolution branches after failures.
Login recovery latency telemetry: `login_failure_recovered` now carries `failure_recovery_seconds` and `failure_recovery_bucket` for fast-vs-slow recovery segmentation.
Login failure-depth buckets: failure summary/recovery telemetry now carries `failure_count_bucket` (`1`/`2`/`3`/`4_plus`) for compact failure-depth segmentation.
Mobile browser readiness: added viewport safe-area fit (`viewportFit: "cover"`), mobile input sizing to reduce iOS zoom, and larger mobile bottom-nav tap targets.
Mobile map filters usability: improved mobile filter rail with snap-scrolling chips and larger filter/clear touch targets for easier thumb interaction.
Mobile map sheet controls: increased "Show list" CTA and sheet-handle tap area, plus mobile sheet bottom safe-area padding.
Mobile chat composer ergonomics: added safe-area-aware spacing and textarea focus visibility behavior to reduce keyboard-overlap friction on mobile browsers.
Mobile chat header/action density: improved narrow-screen layout resilience with wrapping header/action rows and larger unread/filter/action touch targets.
Mobile chat thread-list density: increased conversation row hit area and improved narrow-screen truncation resilience for title/time/last-message metadata.
Mobile active-chat header density: improved very small-screen header ergonomics with larger back-button touch target and tighter title/link layout handling.
Mobile chat composer row density: enabled narrow-screen wrap with full-width send-button fallback and tighter textarea/counter alignment for steadier compose UX.
Mobile chat bubble readability: added aggressive long-word/URL wrapping plus mobile-first bubble sizing/padding refinements to avoid horizontal bleed on tiny screens.
Mobile chat search micro-ergonomics: increased clear-control touch area and improved helper/count copy legibility in the chat inbox search section.
Mobile chat empty/error states: tightened mobile spacing and overflow resilience while increasing EmptyState action-button tap target for better low-content-state usability.
Mobile chat loading states: increased mobile-first loading viewport centering and upgraded fallback/loading text sizing for steadier perceived progress on short screens.
Mobile chat shortcut helper discoverability: introduced viewport-adaptive shortcut copy (compact mobile text, full desktop text) for cleaner search-panel guidance.
Mobile chat sticky inbox controls: made inbox header/actions/filters/search block sticky within the chat sidebar to keep controls visible during long-list scrolling.
Mobile chat sticky scroll separation: added scroll-aware sticky-shadow feedback so fixed inbox controls remain visually distinct as the chat list moves underneath.
Mobile chat day-divider readability: increased day-chip prominence (spacing, size, contrast) for clearer message timeline chunking on small screens.
Mobile chat timestamp readability: tuned timestamp typography spacing/contrast for clearer at-a-glance message chronology on narrow mobile viewports.
Mobile chat send-state feedback: strengthened composing in-flight affordance via explicit send label, textarea disabled visual state, and guarded busy-button interaction.
Mobile chat unread-state emphasis: introduced subtle unread row tinting plus stronger unread time/preview styling to improve inbox triage speed on mobile.
Mobile chat keyboard-navigation visibility: introduced clear focus-visible ring styling for chat rows to improve keyboard traversal confidence across desktop/mobile parity scenarios.
Mobile chat hover/focus parity: normalized chat-row focus/hover background and color-transition behavior so keyboard and pointer navigation feel equivalently clear.
Mobile chat short-height density: added viewport-height-aware row/avatar compaction for low-height screens to increase visible thread count while keeping tap targets practical.
Mobile chat short-height control compression: added low-height vertical compaction for sticky inbox control stack (header/error/filter/search/captions) to expose more list content.
Mobile active-thread short-height compression: added low-height spacing compaction for active-thread header/composer surfaces to maximize visible messages while keeping compose flow comfortable.
Mobile active-thread short-height message spacing: added low-height compaction for message-list spacing/padding and bubble/timestamp rhythm to increase visible conversation context.
Mobile short-height jump-to-latest ergonomics: added low-height-specific offset/padding compaction for the sticky jump CTA to reduce visual obstruction while retaining quick access.
Mobile short-height composer send-button density: added low-height send CTA compaction (min-height/padding/text size) for better vertical efficiency in constrained viewports.
Mobile short-height filter/search control density: added low-height compaction for inbox action pills, role chips, and search clear/input controls to expose more list content.
Mobile short-height helper typography tuning: introduced low-height helper-text size/leading compaction for shortcut/count captions to reduce sticky control-stack vertical load.
Mobile short-height unread badge/chip scaling: added low-height unread badge micro-scaling to keep header density balanced without diluting unread visibility cues.
Mobile short-height day-chip polish: added low-height day-divider chip/spacing compaction to keep chronology anchors readable while improving message viewport efficiency.
Mobile short-height consistency sweep: introduced shared `short:` viewport variant (`max-height: 740px`) and migrated chat compaction utilities from inline media queries.

## Firestore collections (reference — do not break)

Primary web touchpoints: `listings`, `users`, `chat_rooms`, `listing_plans`, `settings`, `payments` (read via functions), `razorpay_pending_orders`, `paypal_pending_orders`.

See Flutter repo `firestore.rules` and `firestore.indexes.json` in `rentit_clean` as source of truth.

## Repository policy (mandatory)

| Path | Role |
|------|------|
| `C:\RentIt_Dev\apps\RentalPins_Full_web` | **Working ground only** — all new code, docs, canvases, and saves go here |
| `C:\Users\naudh\rentalpins-web` | **Read-only** — current production website (reference) |
| `C:\RentIt_Dev\apps\rentit_clean` | **Read-only** — Flutter app + Firebase/functions (reference) |

**Do not modify production paths.** Use them only to study schema, routes, rules, and behavior.

## Repository status

- Path: `C:\RentIt_Dev\apps\RentalPins_Full_web`
- **Currently empty** — greenfield Next.js scaffold goes here.
- Reference (read-only):
  - Production web: `C:\Users\naudh\rentalpins-web`
  - Mobile + backend: `C:\RentIt_Dev\apps\rentit_clean`

## Staging environment

- URL: **`https://www.rentalpins.com/staging`**
- Use for full QA of v1 scope before production cutover.
- During early staging: phone verification **may be exempt** (feature flag / env config).
- Before production cutover: verification **required** for post-listing.

## Post-listing & activation (same as Android app)

1. User signs in (phone OTP + optional Google).
2. Creates listing draft → Firestore `listings` with **`isActive: false`**, `ownerUid`, `ownerPhone`.
3. User selects plan and pays via **Cloud Functions** (Razorpay/PayPal).
4. Webhook/function activates listing → **`isActive: true`** (same lifecycle as app).
5. No direct client writes to `payments` or activation fields.

**Moderation before go-live:** out of v1 scope — evaluate in a **future step** after launch.

## Spec status

All major product decisions are locked. Ready to scaffold Next.js in `RentalPins_Full_web`.

---

*Last updated: staging `rentalpins.com/staging`, draft → pay-to-activate, moderation deferred.*
