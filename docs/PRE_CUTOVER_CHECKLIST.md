# Pre-cutover checklist (production launch)

Use this before swapping `www.rentalpins.com` to the Next.js app. Staging should pass every item first.

## 1. Environment

Run locally:

```bash
npm run check:env
npm run check:env:prod   # before production cutover
```

For production env validation, all warnings from `check:env:prod` must be resolved on the host.

| Variable | Local dev | Staging (`/staging`) | Production |
|----------|-----------|----------------------|------------|
| `NEXT_PUBLIC_BASE_PATH` | **unset** | `/staging` | **unset** |
| `NEXT_PUBLIC_DEPLOY_ENV` | `staging` | `staging` | `production` |
| `NEXT_PUBLIC_SHOW_STAGING_BANNER` | `true` optional | `true` | **unset / false** |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://www.rentalpins.com` | `https://www.rentalpins.com` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | required | required | required |
| `FIREBASE_CLIENT_EMAIL` | required (map API) | required | required |
| `FIREBASE_PRIVATE_KEY` | required | required | required |
| `NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION` | `false` OK | `false` OK | **`true`** |

After deploy, hit `GET /api/health` — should return `{ "ok": true }`.

## 2. Firestore (deploy from `rentit_clean`)

Web-only additions are **add-only** (safe for Android/iOS).

Verify indexes/rules are merged before deploy:

```bash
npm run check:firestore-sync
```

1. Merge rules from `docs/firestore-saved-searches.md` into `rentit_clean/firestore.rules`.
2. Merge indexes from `firestore.indexes.web-additions.json` into `rentit_clean/firestore.indexes.json`.
3. Deploy:

```bash
cd C:\RentIt_Dev\apps\rentit_clean
firebase deploy --only firestore:rules,firestore:indexes
```

4. Wait for index builds in Firebase Console (saved_searches composite).

**Indexes: Console vs file** — `firestore.indexes.json` is not a full inventory. Many indexes were created via Firebase error links in Console and may be **Enabled** there but absent from the file. That is OK:

- `firebase deploy --only firestore:indexes` **adds** indexes from the file; it does **not** delete Console-only indexes.
- **Runtime truth:** Firebase Console → Firestore → Indexes (status **Enabled**).
- **File check:** `npm run check:firestore-sync` only verifies web additions are merged into `rentit_clean`, not that the file lists every live index.
- **List live indexes:** from `rentit_clean`, run `firebase firestore:indexes` (JSON) or `firebase firestore:indexes --pretty`. Optionally merge gaps into `firestore.indexes.json` for documentation — not required for cutover.
- If only rules changed: `firebase deploy --only firestore:rules` (skip indexes deploy).

See `docs/firestore-web-queries.md` for every client query the web app runs.

## 2b. Automated CI (GitHub Actions)

On push/PR touching `apps/RentalPins_Full_web/**`:

- [x] `npm run lint`
- [x] `npm test -- --run`
- [x] `node scripts/verify-firestore-web-sync.mjs`
- [x] `npm run build` (CI env placeholders)

Workflow: `.github/workflows/rentalpins-web-ci.yml`

## 2c. API & route hardening (code)

- [x] `GET /api/listings` — bounds validation (`lib/listings-api-bounds.ts`) + rate limit (120/min per IP)
- [x] Route error boundaries: `/search`, `/post`, `/chat`, `/saved-searches`, `/profile` (`components/RouteError.tsx`)
- [x] Security headers in `next.config.ts` (X-Frame-Options, HSTS when `NEXT_PUBLIC_DEPLOY_ENV=production`)
- [x] `.env.example` — placeholders only (no real dev keys)

## 3. SEO & URLs

- [ ] Export current GSC URL list + production sitemap.
- [ ] Crawl staging: no 404 on top 70+ indexed paths.
- [ ] Legacy `/rentals/{city}` → `/rentals/in/{city}` returns **308** (middleware).
- [ ] `/{listingId}` redirects to `/listings/{id}` with canonical on detail page.
- [ ] `/sitemap.xml` includes rentals hub, cities, areas, blog, legal.
- [ ] `robots.txt` allows crawl; staging may use `noindex` at host level if desired.
- [ ] JSON-LD present on marketing layout.

## 4. Functional QA (staging)

| Flow | Pass |
|------|------|
| Map loads pins in Chandigarh viewport | ☐ |
| Pan/zoom refetches listings (no stuck “Updating…”) | ☐ |
| Filters + saved search restore from URL | ☐ |
| Listing detail + WhatsApp opens `wa.me` with owner phone | ☐ |
| Phone OTP sign-in | ☐ |
| Google sign-in | ☐ |
| Post listing → draft → activate → Razorpay (IN) | ☐ |
| Post listing → PayPal (non-IN profile) | ☐ |
| Chat from listing → send/receive message | ☐ |
| Profile → my listings (live + draft) | ☐ |
| Mobile bottom sheet on `/search` | ☐ |

## 5. Performance (mobile-first)

Target on `/search` and `/listings/[id]` (Lighthouse mobile):

- [ ] LCP &lt; 2.5s
- [ ] INP &lt; 200ms
- [ ] CLS &lt; 0.1

## 6. Android app regression

Same Firebase project — smoke test after rules/index deploy:

- [ ] Map search still works
- [ ] Post + pay + activate unchanged
- [ ] Chat unchanged

## 7. Analytics

GA4 events wired: `search_initiated`, `map_viewport_changed`, `map_view_reset_clicked`, `map_location_search_cleared`, `map_use_current_location_applied`, `map_use_current_location_succeeded`, `map_use_current_location_failed`, `map_keyboard_shortcut_used`, `map_fetch_retry_clicked`, `map_empty_state_reset_clicked`, `map_mobile_sheet_toggled`, `map_listing_preview_closed`, `map_cluster_clicked`, `map_filters_cleared`, `map_selection_cleared`, `map_fit_all_results_clicked`, `map_location_geocoded`, `map_location_geocode_failed`, `map_search_view_restored`, `saved_search_view_list_clicked`, `filter_applied`, `listing_detail_viewed`, `listing_detail_jump_links_shown`, `listing_detail_section_jump`, `listing_detail_hash_focus_restored`, `listing_contact_section_viewed`, `listing_detail_not_found_viewed`, `listing_detail_not_found_cta_clicked`, `listing_detail_error_viewed`, `listing_detail_error_retry_clicked`, `listing_detail_error_back_to_map_clicked`, `listing_view_counted`, `listing_view_count_failed`, `listing_back_clicked`, `listing_map_link_clicked`, `listing_map_snippet_shown`, `listing_reviews_section_viewed`, `listing_review_submitted`, `listing_review_login_redirect`, `listing_owner_profile_clicked`, `listing_reported`, `listing_report_opened`, `listing_report_modal_closed`, `listing_report_login_redirect`, `listing_gallery_opened`, `listing_gallery_photo_changed`, `listing_related_clicked`, `listing_recently_viewed_rail_shown`, `listing_owner_rail_viewed`, `listing_similar_rail_viewed`, `listing_save_login_redirect`, `contact_owner_login_redirect`, `contact_owner_failed`, `listing_impression`, `listing_pin_clicked`, `listing_card_clicked`, `listing_saved`, `listing_shared`, `search_link_copied`, `saved_search_opened`, `saved_search_deleted`, `saved_search_alert_toggled`, `saved_search_keyboard_shortcut_used`, `saved_search_save_failed`, `saved_search_save_login_redirect`, `saved_search_save_blocked_no_view`, `saved_search_already_exists`, `saved_search_reactivated`, `chat_filter_changed`, `chat_mark_all_read`, `chat_keyboard_shortcut_used`, `chat_search_cleared`, `chat_jump_to_latest_clicked`, `contact_owner_started`, `lead_submitted`, `search_alert_created`, `checkout_started`, `payment_success`, `listing_published`, `post_listing_form_viewed`, `post_listing_validation_failed`, `post_activate_viewed`, `post_activate_schema_summary_viewed`, `post_activate_return_visit_viewed`, `post_activate_abandoned_before_checkout`, `post_activate_plans_loaded`, `post_activate_plans_shown`, `post_activate_wait_timed_out`, `post_activate_wait_retry_clicked`, `post_activate_wait_resolved`, `post_activate_status_viewed`, `post_activate_payment_dismissed`, `post_activate_payment_failed`, `post_activate_missing_listing_id`, `post_activate_plans_empty_viewed`, `post_activate_plans_error_viewed`, `post_activate_plan_selected`, `post_activate_exit_clicked`, `post_activate_plans_retry_clicked`, `post_activate_plans_retry_result`, `login_schema_summary_viewed`, `login_return_visit_viewed`, `login_failure_summary_viewed`, `login_failure_recovered`, `login_viewed`, `login_redirected_after_auth`, `login_success`, `login_blocked_phone_required`, `login_abandoned_after_otp_sent`, `login_abandoned_after_google_click`, `login_otp_send_requested`, `login_otp_send_failed`, `login_otp_verify_submitted`, `login_otp_verify_failed`, `login_google_signin_clicked`, `login_google_signin_failed`, `login_otp_cancelled`.

Activation telemetry enrichment: `post_activate_wait_resolved` and `post_activate_exit_clicked` now include `dwell_seconds` + `dwell_bucket` to segment short vs long activation sessions.
Activation telemetry enrichment: `checkout_started`, `post_activate_payment_failed`, and `post_activate_payment_dismissed` now include `checkout_attempt` + `plan_attempt` for retry sequencing diagnostics.
Activation telemetry enrichment: `payment_success` and `listing_published` now include attempt (`checkout_attempt`, `plan_attempt`) and dwell (`dwell_seconds`, `dwell_bucket`) dimensions.
Activation telemetry enrichment: `checkout_started`, `post_activate_payment_failed`, and `post_activate_payment_dismissed` now include `plan_position` to align position analytics from selection through outcome.
Activation telemetry enrichment: plan-related selection/checkout/success events now include normalized `plan_signature` (`price_currency_duration`) for stable tier-level dashboard grouping.
Activation telemetry enrichment: `post_activate_plans_shown` now includes ordered `plan_signatures` so impression events align directly with downstream tier keys.
Activation telemetry enrichment: selection/checkout/success outcome events now include `visible_plan_count` and `has_multiple_plans` for quick single-vs-multi-option behavior segmentation.
Activation telemetry enrichment: `post_activate_plans_retry_result` now includes `visible_plan_count` and `has_multiple_plans` for option-set-aware retry recovery diagnostics.
Activation telemetry enrichment: plan availability events (`post_activate_plans_loaded`, `post_activate_plans_empty_viewed`) now include `visible_plan_count` and `has_multiple_plans` for full option-set parity.
Activation telemetry enrichment: `post_activate_plans_loaded` now includes ordered `plan_signatures` to align loaded-state and impression/outcome tier analysis.
Activation telemetry enrichment: plan availability events now include normalized `availability_state` (`ready`/`empty`/`error`) for cross-event filtering without event-name branching.
Activation telemetry enrichment: `post_activate_plans_retry_clicked` now includes pre-retry `availability_state`, `visible_plan_count`, and `has_multiple_plans` for intent-state analysis.
Activation telemetry enrichment: `post_activate_plans_retry_clicked` now includes `retry_count_before_click` and `retry_count_after_click` for direct retry-attempt sequencing analysis.
Activation telemetry enrichment: `post_activate_wait_retry_clicked` now includes `retry_count_before_click` and `retry_count_after_click` for wait-retry sequencing parity.
Activation telemetry enrichment: `post_activate_wait_retry_clicked` now includes `availability_state`, `visible_plan_count`, and `has_multiple_plans` for state/context parity with other retry intents.
Activation telemetry enrichment: `post_activate_plan_selected`, `checkout_started`, and checkout outcome events now carry explicit `availability_state: "ready"` for assumption-free downstream filtering.
Activation telemetry enrichment: `payment_success` and `listing_published` now also carry explicit `availability_state: "ready"` for end-state parity with activation funnel events.
Activation telemetry enrichment: `post_activate_viewed` now includes `availability_state` and option-set context (`visible_plan_count`, `has_multiple_plans`) for entry-to-outcome segmentation consistency.
Activation telemetry enrichment: `post_activate_status_viewed` now includes `availability_state` and option-set context (`visible_plan_count`, `has_multiple_plans`) for state-transition parity.
Activation telemetry enrichment: `post_activate_missing_listing_id` now includes `availability_state` and option-set context (`visible_plan_count`, `has_multiple_plans`) for guardrail-path parity.
Activation telemetry enrichment: `post_activate_wait_timed_out` now includes `availability_state` and option-set context (`visible_plan_count`, `has_multiple_plans`) for timeout-path parity.
Activation telemetry enrichment: `post_activate_wait_resolved` now includes `availability_state` and option-set context (`visible_plan_count`, `has_multiple_plans`) for resolved-wait parity.
Activation telemetry refinement: selection/checkout/outcome/success events now use a shared checkout-state context helper (`availability_state` + option-set fields) instead of hardcoded ready-state assumptions.
Activation telemetry enrichment: retry events now include `retry_channel` (`plan_retry` / `wait_retry`) for unified cross-branch retry analysis.
Activation telemetry enrichment: `post_activate_wait_timed_out` and `post_activate_wait_resolved` now explicitly include `retry_channel: "wait_retry"` for wait-path branch-key parity.
Activation telemetry enrichment: non-retry activation events now include `retry_channel: "none"` for null-free branch segmentation across the full funnel.
Activation telemetry enrichment: `post_activate_exit_clicked` now includes `availability_state` and option-set context (`visible_plan_count`, `has_multiple_plans`) for exit-path parity.
Activation telemetry enrichment: key activation events now include normalized `activation_phase` (`entry`, `availability`, `selection`, `checkout`, `wait`, `outcome`, `exit`) for top-level funnel slicing.
Activation telemetry refinement: `post_activate_plans_retry_clicked` now also carries `activation_phase` for full phase coverage across activation events.
Activation telemetry versioning: activation events now include `activation_flow_version` (`2026-05-post-activate-v1`) for safe schema/version comparisons in analytics.
Activation telemetry taxonomy: activation events now include `activation_event_group` (`entry`, `availability`, `selection`, `payment`, `retry`, `outcome`, `navigation`) for simplified top-level reporting groups.
Activation telemetry taxonomy: activation events now include `activation_path` (`normal`, `plan_retry`, `wait_retry`, `guardrail`) for one-field journey-pattern segmentation.
Activation telemetry QA marker: activation events now include `activation_context_complete: true` to simplify filtering for fully-shaped context payloads.
Activation telemetry schema tag: activation events now include `activation_schema_fields` to quickly detect schema drift in raw exports.
Activation telemetry rollout marker: activation events now include `activation_batch` for direct analytics-to-batch mapping.
Activation schema summary event now includes `auth_state` and fires for unauthenticated activation sessions (pre-login redirect) as well.
Activation entry/guardrail events (`post_activate_viewed`, `post_activate_missing_listing_id`) now include `auth_state` for direct auth-segmented analysis.
Activation auth coverage: remaining activation events now include `auth_state` via shared helper for full-funnel auth segmentation consistency.
Activation telemetry source marker: activation events now include `activation_data_source: "client_live"` for quick client-vs-other source filtering.
Post flow telemetry metadata: `post_listing_form_viewed`, `post_listing_validation_failed`, `listing_draft_created`, and `listing_draft_updated` now include `post_flow_version`, `post_flow_batch`, and `post_data_source`.
Login flow telemetry metadata: login events now include `login_flow_version`, `login_flow_batch`, `login_data_source`, and `login_schema_fields`.
Login flow context parity: login events now include normalized `auth_state` and `login_method` for auth-segmented, method-level funnel analysis.
Login schema QA telemetry: `login_schema_summary_viewed` now fires on login page entry with shared metadata + context fields for quick DebugView payload verification.
Login outcome telemetry: login flow now emits `login_success` and `login_blocked_phone_required` to close method-level intent-to-outcome analysis.
Login attempt telemetry: OTP and Google intent/failure/outcome events now include `login_attempt` and `method_attempt` for retry-depth diagnostics.
Login abandonment telemetry: login flow now emits `login_abandoned_after_otp_sent` when users leave after OTP send and before verify.
Login Google abandonment telemetry: login flow now emits `login_abandoned_after_google_click` when users exit after Google click and before a success/failure/block outcome.
Login dwell telemetry: login outcome/abandonment events now include `dwell_seconds` and `dwell_bucket` for time-to-result and drop-off latency analysis.
Login exit telemetry: login flow now emits `login_exit_clicked` (continue-browsing path) with `exit_target`, `exit_stage`, and dwell context.
Login failure taxonomy telemetry: OTP/Google failure events now include normalized `error_code` for reason-level failure diagnostics.
Login auth-requirement telemetry: login events now include normalized `auth_requirement` (`phone_required`/`optional`) for cleaner requirement-based segmentation.
Login path taxonomy telemetry: login events now include normalized `login_path` (`standard`/`link_phone`/`phone_gate`) for branch-level journey analysis.
Login payload completeness marker: login events now include `login_context_complete: true` for quick QA filtering of fully-shaped payloads.
Login resolution-channel telemetry: login completion/abandonment/exit events now include `resolution_channel` for normalized session-resolution branch analysis.
Login event-group telemetry: login events now include normalized `login_event_group` (`entry`/`intent`/`failure`/`outcome`/`abandonment`/`navigation`) for compact top-level reporting.
Login phase telemetry: login events now include normalized `login_phase` (`entry`/`auth`/`verification`/`outcome`/`abandonment`/`exit`) for stage-level funnel analysis.
Login attempt-depth telemetry: attempt-based OTP/Google events now include `method_attempt_bucket` (`1`/`2`/`3`/`4_plus`) for simplified retry-depth segmentation.
Login link-mode parity telemetry: all login events now consistently include `link_phone_mode` (including Google/outcome/abandon/exit paths) for complete link-mode slicing.
Login return-visit telemetry: repeat visits now emit `login_return_visit_viewed` with `return_visit_count` using session-scoped tracking.
Login failure-summary telemetry: aggregated failure snapshots now emit `login_failure_summary_viewed` with `failure_count`, `last_failure_code`, and `last_failure_method`.
Login failure-recovery telemetry: successful post-failure completions now emit `login_failure_recovered` with `failure_count_before_success` and last-known failure context.
Login recovery implementation parity: `login_failure_recovered` is now emitted on auto-redirect, OTP success, and Google success branches after prior failures.
Login recovery latency telemetry: `login_failure_recovered` now includes `failure_recovery_seconds` and `failure_recovery_bucket` to segment fast vs slow recoveries.
Login failure-depth buckets: failure summary/recovery telemetry now includes `failure_count_bucket` (`1`/`2`/`3`/`4_plus`) for compact failure-depth segmentation.
Mobile browser readiness: enabled viewport safe-area fit (`viewportFit: "cover"`), reduced iOS input zoom risk (`.rp-input` at 16px on mobile), and increased mobile bottom-nav tap target size.
Mobile map filters usability: improved mobile filter chip rail with snap scrolling and larger tap targets for one-handed browsing.
Mobile map sheet controls: enlarged "Show list" CTA and drag handle touch targets, and added bottom safe-area padding for the mobile results sheet.
Mobile chat composer ergonomics: added safe-area-aware composer/jump-button bottom spacing and textarea focus-to-visible behavior to reduce keyboard overlap friction.
Mobile chat header/action density: improved narrow-screen resilience with wrapping header/actions plus larger unread/filter/action tap targets for easier thumb use.
Mobile chat thread-list density: increased conversation-row tap area and strengthened narrow-screen title/time/message truncation behavior to reduce overlap/clipping.
Mobile active-chat header density: improved tiny-screen back/title/link balance with larger back-button hit area and tighter header spacing/wrapping behavior.
Mobile chat composer row density: enabled ultra-narrow wrap behavior with full-width send CTA fallback and cleaner counter alignment for keyboard-safe composing.
Mobile chat bubble readability: added long-token/URL wrap handling and tiny-screen bubble sizing tweaks to prevent overflow while preserving message legibility.
Mobile chat search micro-ergonomics: enlarged clear-search hit target and increased helper/status text readability in the inbox search panel on narrow screens.
Mobile chat empty/error states: improved narrow-screen spacing, long-copy wrapping, and action-button touch comfort for sign-in/empty/error surfaces.
Mobile chat loading states: improved small-screen vertical centering and loading-copy readability for both in-page loading and Suspense fallback surfaces.
Mobile chat shortcut helper discoverability: made shortcut guidance responsive (compact on small screens, full detail on larger screens) to reduce mobile clutter.
Mobile chat sticky inbox controls: pinned header/filter/search controls during sidebar scroll so key actions remain reachable while browsing long chat lists.
Mobile chat sticky scroll separation: added a scroll-activated subtle shadow under sticky inbox controls to reinforce visual separation from long chat lists.
Mobile chat day-divider readability: strengthened day-label contrast and spacing in the active thread to improve timeline scanning during quick mobile scroll.
Mobile chat timestamp readability: slightly increased timestamp size/spacing and contrast so per-message send times remain glanceable on small screens.
Mobile chat send-state feedback: improved in-flight composer clarity with stronger sending label, textarea disabled affordance, and clearer busy-button behavior.
Mobile chat unread-state emphasis: added subtle unread-row highlighting and stronger unread metadata contrast for faster scanning of pending conversations.
Mobile chat keyboard-navigation visibility: added stronger focus-visible ring treatment on room rows to improve active-target clarity for arrow-key navigation.
Mobile chat hover/focus parity: aligned conversation-row keyboard focus background and transition timing with pointer hover states for consistent interaction feedback.
Mobile chat short-height density: tightened row min-height/padding and avatar size under low viewport heights to surface more conversations without sacrificing touch usability.
Mobile chat short-height control compression: reduced sticky header/filter/search vertical spacing on low-height screens to keep more conversation rows above the fold.
Mobile active-thread short-height compression: reduced active-chat header/composer/error spacing on low-height screens to preserve message viewport space and input usability.
Mobile active-thread short-height message spacing: tightened low-height message list rhythm (container gaps/padding, bubble/timestamp spacing) to maximize visible chat history.
Mobile short-height jump-to-latest ergonomics: reduced low-height CTA offset/padding for the sticky “Jump to latest” control to stay visible but less intrusive.
Mobile short-height composer send-button density: compacted low-height send-button height/padding/label sizing to reduce composer footprint while keeping it tappable.
Mobile short-height filter/search control density: compacted low-height action pills, role chips, and search clear/input controls to improve above-the-fold thread visibility.
Mobile short-height helper typography tuning: compacted low-height shortcut/count helper typography rhythm for better sticky-stack density without losing readability.
Mobile short-height unread badge/chip scaling: slightly reduced low-height unread counter badge sizing to maintain header clarity while preserving at-a-glance unread prominence.
Mobile short-height day-chip polish: compacted low-height day-divider chip spacing/size to keep active-thread timeline anchors clear with lower vertical overhead.
Mobile short-height consistency sweep: centralized `max-height: 740px` compaction behind a shared `short:` Tailwind variant for easier maintenance and consistent chat low-height behavior.

- [ ] Verify in GA4 DebugView on staging.

## 8. Cutover day

- [ ] Set production env: `NEXT_PUBLIC_DEPLOY_ENV=production`, remove staging banner.
- [ ] Set `NEXT_PUBLIC_REQUIRE_PHONE_VERIFICATION=true`.
- [ ] Point DNS/hosting to Next.js build (no `NEXT_PUBLIC_BASE_PATH`).
- [ ] Monitor GSC coverage 2–4 weeks post-launch.

---

*Working repo: `RentalPins_Full_web`. Rules/index source of truth: `rentit_clean`.*
