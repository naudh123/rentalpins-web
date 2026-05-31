# Autonomous Progress Log

This log is a restart handoff so work can continue exactly from the latest state.

## Session: 2026-05-29 (fix — map zoom snapping back on pan/zoom)

**Symptom:** Zooming into a cluster, the map repeatedly snapped back / re-fit and re-rendered — not smooth.

**Root cause:** Debounced viewport URL sync used `router.replace()`. On the dynamic `/search` route that forces a server round-trip (re-runs SSR `fetchListingsInBounds`), re-rendering the tree and re-running `GoogleMap` `onLoad` → `fitBounds(urlState.bounds)`, snapping the camera. Every pan/zoom rescheduled it → loop.

**Fix:** `hooks/useSearchUrlSync.ts` now updates the URL via `window.history.replaceState(history.state, "", url)` instead of `router.replace`. Keeps the link shareable (Next syncs into `useSearchParams`) with no navigation/SSR/remount. `CopySearchLinkButton` now reads live `window.location.search` so shared links stay current. Build + 20 tests green.

---

## Session: 2026-05-29 (Phase C — items 1–5 complete)

Implemented the rest of Phase C one by one. Build + 20 unit tests green.

1. **Saved-search drawn area** — `area` string field on `saved_searches`; `SavedSearch`/`SaveSearchInput.drawnArea`; `createSavedSearch`/`docToSavedSearch`/`sameSavedSearch`/`savedSearchToUrlState` updated; `SaveSearchButton` + `SearchMap` pass `drawnShape`; alerts cron (`saved-search-alerts-process.ts`) fetches enclosing bounds (`shapeToBounds`) and filters by `pointInArea`. Doc field added to `firestore-saved-searches.md`.
2. **Hub → map links** — `AreaClient` "Browse on Map" + category cards wrapped in `appPath`, pass category, sub-area zoom 13.
3. **SSR center-only** — `app/search/page.tsx` derives bounds from `lat/lng/zoom` when `bounds` missing.
4. **Marker perf** — `ListingMarkerCluster` diffs per-marker state; only rebuilds SVG icon when visual key changes (big win on hover/pan with 100s of pins). No WebGL rewrite (not warranted).
5. **Polish** — panel width persisted to `localStorage`; `map-search-url.test.ts` added.

---

## Session: 2026-05-29 (Phase C — polygon draw)

**Completed:** Polygon + rectangle draw area, shareable via URL.

- `lib/map-area.ts` — `MapAreaShape` (`rect` | `poly`), `encodeMapArea`/`decodeMapArea`/`shapeToBounds`
- `lib/map-geometry.ts` — `pointInPolygon`, `pointInArea`
- `lib/search-url.ts` — `area=` param + `drawnArea` on `SearchUrlState` (excluded from viewport key)
- `useSearchUrlSync` — pushes drawn area via `drawnShapeRef`
- `MapDrawAreaController` — draws/edits rectangle and polygon; `MapDrawAreaTool` — "Draw box" / "Draw shape" / Clear
- `SearchMap` — `drawnShape` state, `pointInArea` filter, URL restore on load + external change
- Tests: `lib/__tests__/map-area.test.ts` + area round-trip; **15 tests pass**, build green

**Still open in Phase C item 1:** persist drawn area in Firestore saved-search schema.

---

## Session: 2026-05-28 (shutdown handoff)

**Primary doc:** `docs/NEXT_STARTUP.md` — Phase C done/left, verify steps, key files.

**Completed this session:**

- Fixed map re-render / zoom loop (URL sync guards, `skipMapSyncRef`, viewport-only apply)
- Fixed `useMapSelection` duplicate `map` + moved URL `selected` restore into hook
- Build + 7 unit tests green

**Next session — start here:**

1. Read `docs/NEXT_STARTUP.md`
2. `npm run build && npm test` then smoke `/search`
3. Phase C remainder: polygon draw + URL encoding → hub map SSR → WebGL markers

---

## Session: 2026-05-27

### Completed map/search upgrades

1. Added local map-view persistence utilities in `lib/map-last-view.ts`.
2. Restored map viewport from storage on bare `/search` when URL has no viewport params.
3. Added debounced persisted-map writes and flush-on-unmount behavior.
4. Expanded persisted state to include:
   - viewport bounds
   - category/sort
   - priceMin/priceMax
   - placeQuery
   - selectedId
5. Added map-state validation and expiration:
   - lat/lng/zoom range checks
   - bounds validity checks
   - price sanitization and min/max auto-correction
   - stale storage TTL handling
6. Added `Reset view` action in map controls:
   - clears persisted map storage
   - resets filters/query/selection/viewport
   - refetch + URL sync
7. Added location-search clear consistency:
   - clear button and manual deletion both clear map query state
   - immediate URL sync for clear/reset flows
8. Added current-location flow in map search:
   - `Near me` button
   - geolocation error handling
   - reverse-geocoded label when available
   - bounds derived from GPS accuracy
   - async unmount safety guards
9. Added keyboard map productivity shortcuts:
   - Arrow Up/Down = select previous/next listing
   - Enter = open selected listing (or first visible listing if none selected)
   - Escape = clear selected listing
   - `/` = focus location search input
10. Added shortcut safety guards:
    - ignore shortcuts when typing in inputs/textarea/select/contenteditable
    - ignore when focus is on links/buttons
    - ignore when dialogs are open
11. Added keyboard hint text in sidebar (desktop and mobile-specific wording).
12. Added keyboard shortcut discoverability metadata to location input:
    - `aria-keyshortcuts="/"` and tooltip title.
13. Added empty-state recovery CTA:
    - `Reset map and filters` shown when applicable.
14. Improved selection continuity:
    - immediate persistence flush on select/deselect.

### Completed sharing/saved-search upgrades

1. Hardened `CopySearchLinkButton`:
   - staging-safe URLs using `appPath(...)`
   - native share fallback before clipboard
   - manual prompt fallback if share/clipboard fail
   - timer cleanup on unmount
   - method analytics values: `native_share`, `clipboard`, `manual_prompt`
2. Added saved-search place label support:
   - `placeQuery` in types + save/read/restore path
   - displayed in saved-search list when distinct from title
3. Improved saved-search auto naming:
   - includes normalized place label
   - truncates overly long generated names for readability.

### Completed filter UX/analytics upgrades

1. Added quick `Clear` button in map filter header when filters are active.
2. Added “No active filters” helper in expanded panel.
3. Disabled expanded clear action when nothing is active.
4. Reset flow now avoids no-op analytics when already at defaults.
5. Filter analytics now track final normalized applied values (not raw patch values).
6. Price range entry auto-corrects inverted min/max at apply time.

### Completed chat/listing readability upgrade

1. Chat room list now shows relative last-message time (`Now`, `5m`, `2h`, etc.).

### Documentation updates completed

1. `docs/PRE_CUTOVER_CHECKLIST.md` GA4 events expanded to include new map events:
   - `map_view_reset_clicked`
   - `map_location_search_cleared`
   - `map_use_current_location_applied`
   - `map_use_current_location_succeeded`
   - `map_use_current_location_failed`
   - `map_keyboard_shortcut_used`
2. `RENTALPINS_WEB_ROADMAP.md` GA4 core events updated to include above map events.

### Validation status

- Production build (`npm run build`) passed after each batch.
- No unresolved linter errors in touched files.
- No commits were created in this autonomous run.

## Resume notes for next start

1. Continue autonomous incremental upgrades from current state.
2. Prioritize high-impact polish and resilience:
   - map/list accessibility
   - analytics completeness
   - saved-search usability
   - chat inbox quality-of-life
3. Keep validating with `npm run build` after substantive changes.

## Session: 2026-05-28

### Completed map/list accessibility polish

1. Improved map results panel accessibility in `components/map/SearchMap.tsx`:
   - added `aria-expanded` + `aria-controls` on mobile panel toggles
   - added panel/list landmarks (`id`, `aria-label`, list/listitem roles)
2. Added polite live status announcements for map state:
   - loading state
   - fetch error state
   - results count
   - selected listing context

### Completed chat analytics + accessibility polish

1. Added chat filter analytics in `app/chat/page.tsx`:
   - `chat_filter_changed` for unread-only toggle
   - `chat_filter_changed` for role filter changes
2. Added `chat_mark_all_read` analytics with room count payload.
3. Added accessibility improvements:
   - `aria-pressed` for role filter chips
   - `aria-label` for chat search input

### Validation status

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.
- No commits were created in this autonomous run.

### Completed saved-search usability polish

1. Improved discoverability in `app/saved-searches/page.tsx`:
   - added local filter input for saved searches
   - added live result count text (`Showing X of Y saved searches`)
   - added filtered-empty state with quick `Clear filter` action
2. Reduced accidental destructive actions:
   - delete now requires explicit browser confirm
   - per-item busy disable state added for toggle/delete actions
3. Added saved-search interaction analytics:
   - `saved_search_opened`
   - `saved_search_deleted`
   - `saved_search_alert_toggled`
4. Added small accessibility enhancements:
   - labeled filter input
   - live region style feedback for count changes

### Validation status (saved-search batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat inbox quality-of-life polish

1. Added keyboard productivity shortcuts in `app/chat/page.tsx`:
   - `/` focuses inbox search input
   - Arrow Up/Down navigates visible chat rooms
   - Escape clears chat search, and closes active room on mobile
2. Added lightweight keyboard analytics:
   - `chat_keyboard_shortcut_used` (de-duplicated per shortcut/action per session)
3. Improved chat list usability:
   - unread count badge near `Messages` header
   - active room auto-scroll into view when selection changes
4. Improved message pane behavior:
   - smart stick-to-bottom behavior while reading older messages
   - `Jump to latest` sticky button when scrolled away from bottom
5. Consolidated query-param sync for chat filters/search/open-room/close-room into shared URL sync helper for consistency.

### Validation status (chat QoL batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed analytics/documentation parity + shortcut discoverability

1. Added chat shortcut discoverability in `app/chat/page.tsx`:
   - `aria-keyshortcuts` + tooltip title on chat search input
   - inline shortcut hint under inbox search (`/`, Arrow keys, Escape)
2. Updated GA4 event dictionaries in docs to include newly shipped events:
   - `saved_search_opened`
   - `saved_search_deleted`
   - `saved_search_alert_toggled`
   - `chat_filter_changed`
   - `chat_mark_all_read`
   - `chat_keyboard_shortcut_used`
3. Files updated for docs parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`

### Validation status (docs parity batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map/list micro-interactions + analytics completeness

1. Improved map error-recovery observability in `components/map/SearchMap.tsx`:
   - added `map_fetch_retry_clicked` event on fetch-error Retry action
2. Improved empty-state recovery observability:
   - added `map_empty_state_reset_clicked` when users reset from empty-state CTA
3. Improved keyboard hint completeness in map sidebar:
   - desktop tip now includes `Esc` behavior (clear selection)
4. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added: `map_fetch_retry_clicked`, `map_empty_state_reset_clicked`

### Validation status (map micro-interactions batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat inbox feedback + analytics refinement

1. Improved chat inbox feedback in `app/chat/page.tsx`:
   - added live result-count text (`Showing X of Y chats`) under chat search
2. Added analytics for additional inbox actions:
   - `chat_search_cleared` when clearing search via button or `Escape`
   - `chat_jump_to_latest_clicked` when tapping the jump-to-latest control
3. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added: `chat_search_cleared`, `chat_jump_to_latest_clicked`

### Validation status (chat feedback batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search action reliability hardening

1. Improved error handling in `app/saved-searches/page.tsx`:
   - added dedicated `actionError` UI for alert-toggle/delete failures
   - catches async errors for `setSavedSearchAlerts` and `deleteSavedSearch`
2. Improved action UX resilience:
   - clears stale action error before each new toggle/delete attempt
   - preserves existing busy/disabled behavior while actions are in-flight

### Validation status (saved-search reliability batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search keyboard productivity polish

1. Added saved-search filter keyboard shortcuts in `app/saved-searches/page.tsx`:
   - `/` focuses and selects filter input
   - `Escape` clears active filter text
2. Added shortcut discoverability metadata:
   - `aria-keyshortcuts` + tooltip title on filter input
   - lightweight inline shortcut hint text
3. Added analytics for saved-search keyboard usage:
   - `saved_search_keyboard_shortcut_used` with key/action payloads
4. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added: `saved_search_keyboard_shortcut_used`

### Validation status (saved-search shortcut batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed save-search action resiliency polish

1. Hardened `components/map/SaveSearchButton.tsx`:
   - added visible inline error feedback when save fails (`role="alert"`)
   - clears stale error before each new attempt
   - preserves existing success state and busy-state behavior
2. Added save-failure/login-redirect analytics:
   - `saved_search_save_failed`
   - `saved_search_save_login_redirect`
3. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added above save-search resiliency events

### Validation status (save-search resiliency batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search deduplication hardening

1. Added idempotent save behavior in `lib/saved-searches.ts`:
   - `createSavedSearch` now checks recent user saved searches for an equivalent map/filter state
   - returns existing search id when duplicate is detected (instead of creating another record)
2. Updated save button UX in `components/map/SaveSearchButton.tsx`:
   - supports distinct success states: `Saved ✓` vs `Already saved`
   - tracks duplicate-save analytics via `saved_search_already_exists`
3. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added: `saved_search_already_exists`

### Validation status (saved-search dedupe batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed save-button lifecycle + a11y status polish

1. Improved `components/map/SaveSearchButton.tsx` lifecycle safety:
   - replaced raw `setTimeout` usage with tracked timer ref
   - added unmount cleanup to prevent stale timer updates
2. Improved accessible save feedback:
   - added polite live-region status messages for:
     - save success
     - already-saved dedupe response
     - save failure
3. Kept existing functional behavior unchanged:
   - same busy-state interaction model
   - same dedupe + analytics flows from prior batch

### Validation status (save-button lifecycle batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed GA4 documentation parity reconciliation

1. Reconciled docs with currently shipped GA4 events found in code:
   - added missing saved-search events:
     - `saved_search_keyboard_shortcut_used`
     - `saved_search_save_failed`
     - `saved_search_save_login_redirect`
     - `saved_search_already_exists`
   - added missing chat events:
     - `chat_search_cleared`
     - `chat_jump_to_latest_clicked`
2. Updated both GA4 dictionaries:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`

### Validation status (GA4 parity reconciliation)

- Documentation-only update; no runtime code changes in this batch.

### Completed duplicate-save reactivation refinement

1. Enhanced duplicate handling in `lib/saved-searches.ts`:
   - `createSavedSearch` now refreshes `updatedAt` on duplicate match
   - when duplicate had alerts off and incoming save requests alerts on, it re-enables alerts and updates `lastAlertedAt`
   - return payload expanded with `reactivated` flag for caller UX handling
2. Improved save CTA states in `components/map/SaveSearchButton.tsx`:
   - added explicit reactivation feedback state (`Alerts on ✓`)
   - tracks `saved_search_reactivated` analytics for this recovery path
3. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added: `saved_search_reactivated`

### Validation status (duplicate reactivation batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat send robustness + observability upgrade

1. Hardened send interaction in `app/chat/page.tsx`:
   - Enter-to-send now ignores IME composing keystrokes
   - blocks repeated Enter sends while `sending` is true
2. Added chat send analytics for delivery observability:
   - `chat_message_sent` with room/listing + first-message context
   - `chat_message_send_failed` with room/listing context
3. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added above chat send events

### Validation status (chat send robustness batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat search-clear analytics accuracy fix

1. Fixed duplicate analytics emission in `app/chat/page.tsx`:
   - `chat_search_cleared` now emits exactly once per clear action
   - clear method is explicitly passed (`clear_action` vs `escape_shortcut`)
2. Adjusted clear button handler to use explicit method invocation.

### Validation status (chat analytics accuracy fix)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed save-action blocked-state feedback refinement

1. Improved save-action feedback in `components/map/SaveSearchButton.tsx`:
   - when there is no map view context (`bounds` and `center` absent), save now shows a clear user-facing message instead of no-op
2. Added observability for blocked saves:
   - `saved_search_save_blocked_no_view`
3. Corrected GA4 dictionaries to include all current saved-search events:
   - `saved_search_reactivated`
   - `saved_search_save_blocked_no_view`
   - updated in `docs/PRE_CUTOVER_CHECKLIST.md` and `RENTALPINS_WEB_ROADMAP.md`

### Validation status (save blocked-state batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat send-state UX polish

1. Improved send button feedback in `app/chat/page.tsx`:
   - button text now shows `Sending...` while message is in-flight
   - added `aria-busy` on send button for better accessibility semantics
2. Improved send enabled-state clarity:
   - switched button disabled check to shared `trimmedText` value for consistency with send guard logic

### Validation status (chat send-state UX batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map retry-action state polish

1. Improved error-retry button behavior in `components/map/SearchMap.tsx`:
   - prevents duplicate retry clicks while fetch is already running
   - disables retry action during loading (`disabled` + `aria-busy`)
   - shows clearer in-flight text (`Retrying...`)
2. Existing retry analytics remain intact (`map_fetch_retry_clicked`) and now reflect intentional single retries.

### Validation status (map retry-state batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search filter clear observability pass

1. Improved filter-clear UX in `app/saved-searches/page.tsx`:
   - added inline `Clear filter` action near the filter input when active
   - unified all clear paths through one helper for consistency
2. Added explicit filter-clear analytics:
   - `saved_search_filter_cleared` with source method:
     - `button`
     - `escape_shortcut`
     - `empty_state_cta`
3. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added: `saved_search_filter_cleared`

### Validation status (saved-search filter clear batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mark-all-read failure visibility upgrade

1. Improved failure handling in `app/chat/page.tsx`:
   - `markAllRead` now catches errors and shows an inline alert banner in the inbox pane
   - stale mark-all-read error is cleared before a new attempt
2. Added analytics for failure observability:
   - `chat_mark_all_read_failed`
3. Updated GA4 dictionaries for parity:
   - `docs/PRE_CUTOVER_CHECKLIST.md`
   - `RENTALPINS_WEB_ROADMAP.md`
   - added: `chat_mark_all_read_failed`

### Validation status (mark-all-read reliability batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat send-error recovery polish

1. Improved compose UX in `app/chat/page.tsx`:
   - send-error banner now auto-clears when user starts editing a non-empty draft again
   - avoids stale error persistence after user correction attempts
2. No analytics schema changes in this batch (behavior-only UX refinement).

### Validation status (chat send-error recovery batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search action-error lifecycle polish

1. Improved transient error UX in `app/saved-searches/page.tsx`:
   - action-level error banner now auto-dismisses after a short timeout
2. Added lifecycle-safe timer handling:
   - clears/restarts dismiss timer on new errors
   - cleans up timer on unmount to avoid stale updates
3. No analytics schema changes in this batch (UX/lifecycle refinement only).

### Validation status (saved-search error lifecycle batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed save blocked-error auto-recovery polish

1. Improved `components/map/SaveSearchButton.tsx` blocked-save UX:
   - introduced shared `hasMapContext` guard for save precondition checks
   - blocked-save error now auto-clears once valid map context is available
2. Improved save button guidance:
   - tooltip now explains when map context is missing (`Move or search on the map first`)
3. No analytics schema changes in this batch (existing blocked-save event retained).

### Validation status (save blocked-error recovery batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mark-all-read stale error auto-clear polish

1. Improved chat inbox error lifecycle in `app/chat/page.tsx`:
   - mark-all-read error banner now auto-clears when unread state becomes non-actionable
   - specifically clears when unread list is empty or unread-only mode is toggled off
2. No analytics schema changes in this batch (UX/lifecycle refinement only).

### Validation status (mark-all-read error lifecycle batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat mark-all-read telemetry refinement

1. Improved failure observability in `app/chat/page.tsx`:
   - `chat_mark_all_read_failed` now includes structured context:
     - `room_count`
     - truncated failure `reason`
2. No GA4 event-name changes in this batch (payload enrichment only).

### Validation status (mark-all-read telemetry batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search shortcut analytics deduplication

1. Improved `app/saved-searches/page.tsx` analytics signal quality:
   - deduplicated `saved_search_keyboard_shortcut_used` tracking to fire once per shortcut/action per session
   - aligned saved-search shortcut telemetry behavior with existing map/chat keyboard analytics patterns
2. No GA4 event-name changes in this batch (tracking precision refinement only).

### Validation status (saved-search shortcut dedupe batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mark-all-read error timeout lifecycle polish

1. Improved chat error UX in `app/chat/page.tsx`:
   - mark-all-read error banner now auto-dismisses after a short timeout
2. Added lifecycle-safe timer behavior:
   - clears/restarts timer on new mark-all-read errors
   - cleans timer on unmount to avoid stale state updates
3. No analytics schema changes in this batch (UX/lifecycle refinement only).

### Validation status (mark-all-read timeout batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search keyboard listener stability refinement

1. Improved handler stability in `app/saved-searches/page.tsx`:
   - wrapped `clearSavedSearchFilter` in `useCallback`
   - reduces unnecessary keyboard-listener churn caused by handler identity changes
2. No behavior or analytics-schema changes in this batch (stability/perf refinement only).

### Validation status (saved-search listener stability batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat role-filter no-op telemetry guard

1. Improved `app/chat/page.tsx` role filter click behavior:
   - added early return when user clicks the already-active role chip
2. Impact:
   - avoids redundant `chat_filter_changed` events for no-op clicks
   - avoids unnecessary URL replace/navigation churn
3. No GA4 schema changes in this batch (event-quality refinement only).

### Validation status (chat role-filter no-op guard)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat active-room click no-op guard

1. Improved room-open behavior in `app/chat/page.tsx`:
   - `openRoom` now returns early when the target room is already active
2. Impact:
   - avoids redundant state writes and URL replace calls on repeat clicks
   - reduces unnecessary work during frequent inbox interactions
3. No GA4 schema changes in this batch (interaction efficiency refinement only).

### Validation status (chat open-room no-op guard)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search dedupe correctness fix

1. Improved duplicate detection in `lib/saved-searches.ts`:
   - removed artificial `limit(50)` cap when scanning user saved searches for duplicates
   - dedupe logic now checks the full user saved-search set, preventing missed matches from older entries
2. No event-schema changes in this batch (data correctness refinement only).

### Validation status (saved-search dedupe correctness batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed saved-search keydown listener stability refinement

1. Improved `app/saved-searches/page.tsx` global keydown efficiency:
   - moved Escape-query check to `queryTextRef` to avoid stale closures
   - rewired `clearSavedSearchFilter` to updater form so it no longer depends on `queryText`
2. Impact:
   - keyboard listener effect dependencies are now stable (no rebind on each keystroke)
   - behavior and analytics outcomes remain unchanged

### Validation status (saved-search keydown stability batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat unread-toggle no-op safety guard

1. Added defensive no-op guard in `app/chat/page.tsx` unread toggle handler:
   - early return if computed unread state is unchanged
2. Impact:
   - protects against accidental duplicate analytics/URL sync churn in edge interaction paths
3. No GA4 schema changes in this batch.

### Validation status (chat unread-toggle guard batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed chat search-clear no-op guard

1. Improved `app/chat/page.tsx` clear handler:
   - `clearInboxSearch` now returns early when search query is already empty
2. Impact:
   - prevents unnecessary URL sync calls for no-op clears
   - keeps `chat_search_cleared` emission strictly tied to actual clear actions
3. No GA4 schema changes in this batch.

### Validation status (chat clear no-op guard batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map discovery UX + a11y batch (map focus)

1. **List selection semantics** (`components/map/SearchMap.tsx`):
   - `aria-current="true"` on the active list item
   - hover preview only calls `selectListing` when the hovered card changes (avoids redundant pan/sync)
2. **Mobile results sheet**:
   - toggle button label shows `N · M in area` when filters hide listings
   - `map_mobile_sheet_toggled` analytics with `{ open }`
3. **Map preview** (`components/map/MapListingPreview.tsx`):
   - `role="dialog"` + descriptive `aria-label`
   - `map_listing_preview_closed` when user dismisses preview
4. **Filters panel** (`components/map/SearchFilters.tsx`):
   - `aria-pressed` on category chips; `aria-expanded` on Filters toggle
5. **Live region**: fetch-error status now mentions retry affordance
6. GA4 dictionaries updated: `map_mobile_sheet_toggled`, `map_listing_preview_closed`

### Validation status (map discovery UX batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map mobile sheet focus-management batch (map focus)

1. Improved mobile results-sheet accessibility in `components/map/SearchMap.tsx`:
   - added a mobile-only focus trap while the sheet is open
   - added `Escape` handling to close the sheet from keyboard
   - restores focus to the initiating control when the sheet closes
2. Improved sheet interaction telemetry:
   - `map_mobile_sheet_toggled` now includes method metadata (`cta_button`, `drag_handle`, `escape_key`, `selected_from_url`)
3. Preserved desktop behavior:
   - focus-trap logic is bypassed at desktop breakpoints
   - existing map keyboard shortcuts remain unchanged on desktop

### Validation status (map mobile sheet focus-management batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map marker keyboard + pin accessibility batch (map focus)

1. **Marker / cluster semantics**:
   - listing pins now expose descriptive `title` tooltips (title, location, price)
   - cluster bubbles expose zoom hints and track `map_cluster_clicked` with `{ count }`
2. **Map keyboard surface** (`components/map/SearchMap.tsx`):
   - map region is focusable (`tabIndex={0}`, `role="application"`) with screen-reader instructions
   - added `M` shortcut to focus map (`map_keyboard_shortcut_used` action `focus_map`)
   - dedicated `aria-live` status for pin selection/count
   - Enter-from-keyboard now records listing clicks with `map` source (was `list`)
3. **Filtered empty state**:
   - shows in-area count when filters hide results
   - added **Clear filters only** CTA (`map_filters_cleared`) separate from full reset
4. GA4 dictionaries updated: `map_cluster_clicked`, `map_filters_cleared`

### Validation status (map marker keyboard batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map selection + toolbar polish batch (map focus)

1. **Stale selection fixes** (`components/map/SearchMap.tsx`):
   - clears pin selection immediately when filters change and refetches listings
   - avoids clearing deep-linked selection while initial results are still loading
   - tracks `map_selection_cleared` with `filters_changed` or `listing_unavailable`
2. **Share / save toolbar**:
   - `CopySearchLinkButton` and `SaveSearchButton` disable while map fetch is in-flight
   - share button now has screen-reader copy/error feedback
   - save success shows **View saved searches** link (`saved_search_view_list_clicked`)
3. GA4 dictionaries updated for new events.

### Validation status (map selection + toolbar batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map list loading + fetch reliability batch (map focus)

1. **List loading UX**:
   - added `MapListingCardSkeleton` placeholders for first-load / empty-list fetches
   - in-flight refresh keeps prior cards visible with dimmed state + top progress bar
   - filter header shows `Updating results…` while loading
2. **Fetch edge cases** (`components/map/SearchMap.tsx`):
   - in-flight listing requests are aborted when a newer fetch starts (plus generation guard)
   - place search / reset clear stale list data before refetch
   - partial refresh failures show inline banner while keeping previous results visible
3. No GA4 schema changes in this batch.

### Validation status (map list loading batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map preview + location UX batch (map focus)

1. **Listing preview dialog** (`MapListingPreview.tsx`):
   - fixed Escape being blocked by global map shortcut guard
   - preview now traps focus (`aria-modal`), auto-focuses close, and closes on Escape
   - listing image uses descriptive alt text
2. **Map keyboard shortcuts** (`SearchMap.tsx`):
   - arrow/Enter shortcuts work while preview is open; other dialogs still block
   - listing impressions on `/search` now use `source: map`
   - selecting a pin on mobile auto-opens the results sheet (`pin_selected`)
3. **Location search** (`MapLocationSearch.tsx`):
   - geolocation errors show a **Try again** action

### Validation status (map preview + location batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map mobile list sync + marker refresh batch (map focus)

1. **Mobile two-tap list cards** (`ListingCard.tsx`):
   - on coarse pointers, first tap selects/previews on map without navigating
   - second tap on the selected card opens listing detail (matches mobile tip copy)
2. **Map/list sync while refreshing**:
   - markers dim during in-flight refresh (`ListingMarkerCluster` `dimmed` prop)
   - map shows a compact results count pill (`N shown · M in area` when filtered)
3. **Motion/accessibility**:
   - mobile sheet respects `prefers-reduced-motion`
   - selected map cards expose `aria-current` on the link

### Validation status (map mobile list sync batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map fit-all + selection analytics batch (map focus)

1. **Fit all results** (`SearchMap.tsx`):
   - toolbar **Fit all** zooms the map to include every visible listing pin (2+ results)
   - tracks `map_fit_all_results_clicked` with `{ count }`
2. **Selection analytics cleanup**:
   - `listing_pin_clicked` only for pin/keyboard selection (not list hover/tap preview)
   - mobile sheet auto-opens only when a **pin** is tapped (not list/keyboard navigation)
3. **Filter stability** (`SearchFilters.tsx`):
   - filter controls disabled while results are loading (avoids overlapping fetches)
4. GA4 dictionaries updated: `map_fit_all_results_clicked`

### Validation status (map fit-all batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map location geocode + idle-fetch batch (map focus)

1. **Manual location search** (`MapLocationSearch.tsx`, `lib/map-place-search.ts`):
   - Enter submits free-text queries via Geocoder when autocomplete is not used
   - avoids double-fly when an autocomplete suggestion was just picked
   - tracks `map_location_geocoded` / `map_location_geocode_failed`
2. **Fit-all fetch optimization** (`SearchMap.tsx`):
   - skips redundant listing refetch after programmatic fit-all when viewport bounds are unchanged
3. GA4 dictionaries updated for geocode events.

### Validation status (map location geocode batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed map URL restore + marker hardening batch (map focus)

1. **Saved-search / shared URL restore** (`SearchMap.tsx`, `lib/search-url.ts`):
   - clears stale list results only when viewport/filters/place change (not when only `selected` changes)
   - tracks one-time `map_search_view_restored` for deep-linked map views
2. **Markers** (`ListingMarkerCluster.tsx`):
   - skips invalid lat/lng rows when rendering pins
   - cluster zoom uses the same idle-fetch skip optimization as Fit all
3. **Location search** (`MapLocationSearch.tsx`):
   - added visible **Go** button beside the input (in addition to Enter)
4. **Analytics**: expanded map listing impressions cap from 8 → 20 visible cards
5. GA4 dictionaries updated: `map_search_view_restored`

### Validation status (map URL restore batch)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail observability + a11y batch (listing detail focus)

1. **Page view analytics** (`ListingDetailViewTracker.tsx`):
   - fires once per load: `listing_detail_viewed` with category, promoted, owner contact flags
2. **Navigation / map links**:
   - `listing_back_clicked` on back link with destination type
   - `listing_map_link_clicked` on “View on map” (`ListingMapLink.tsx`)
3. **Contact & save UX**:
   - Message owner: login redirect + failure analytics, `aria-busy`, alert/live regions
   - Save button: `aria-pressed`, `aria-busy`, screen-reader save feedback
4. **Gallery** — lightbox auto-focuses close button on open
5. **Share bar** — screen-reader feedback for copy/share success and errors
6. **Engagement** — view count updates announced via `aria-live`
7. GA4 dictionaries updated for new listing-detail events

### Validation status (listing detail batch 1)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail reviews + contact batch (listing detail focus)

1. **Reviews** (`ListingReviews.tsx`):
   - tap-to-rate star buttons with `aria-pressed` (replaces dropdown)
   - sign-in prompt with link; `listing_review_login_redirect` analytics
   - success confirmation + live region after save
2. **Owner trust**:
   - profile link tracks `listing_owner_profile_clicked` (`ListingOwnerProfileLink.tsx`)
3. **Sticky contact bar** (`ListingStickyBar.tsx`):
   - visible from `sm` breakpoint (tablets) when scrolled
   - adds **Call** alongside WhatsApp when phone is available
4. **Contact panel** (`ListingActions.tsx`):
   - Call now records `lead_submitted` (parity with WhatsApp)
   - clearer copy when phone missing but chat is available

### Validation status (listing detail batch 2)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail gallery + report + related batch (listing detail focus)

1. **Report modal** (`ReportListingButton.tsx`):
   - Escape to close, body scroll lock, initial focus in dialog
   - details character count, `aria-busy`, live region
   - analytics: `listing_report_opened`, `listing_report_modal_closed`, `listing_report_login_redirect`
   - uses `appPath` for sign-in links
2. **Gallery** (`ListingGallery.tsx`):
   - arrow keys on inline gallery; swipe on main photo (mobile)
   - `listing_gallery_opened` when lightbox opens
   - stable keys for duplicate image URLs
3. **Related listings** (`ListingRelatedListingCard.tsx`):
   - tracks `listing_related_clicked` for similar, owner, and recently-viewed rails

### Validation status (listing detail batch 3)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail polish batch (listing detail focus)

1. **Report modal** (`ReportListingButton.tsx`):
   - Tab focus trap inside dialog; Escape routes through single `close()` path (no duplicate close events)
   - `doneRef` for accurate `submitted` on close analytics
2. **Gallery** (`ListingGallery.tsx`):
   - `listingId` prop; `listing_gallery_photo_changed` with `source` (inline/lightbox, thumb/arrow/swipe)
3. **Similar rail** (`app/listings/[id]/page.tsx`):
   - “View similar on map →” deep-link with category filter (`mapSearchUrl` category param)
   - `ListingMapLink` optional `linkSource` dimension
4. **Save** (`ListingSaveButton.tsx`):
   - `listing_save_login_redirect`; login uses `appPath`

### Validation status (listing detail batch 4)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail nav + share + sticky batch (listing detail focus)

1. **Share URL** (`app/listings/[id]/page.tsx`):
   - canonical/share/WhatsApp links use `siteUrl` + `appPath` (staging `basePath` safe)
2. **Share bar** (`ListingShareBar.tsx`):
   - native share → clipboard → manual prompt fallback (aligned with map search share)
   - `listing_shared` methods: `native_share`, `clipboard`, `manual_prompt`
3. **Sticky bar** (`ListingStickyBar.tsx`):
   - mobile top bar when scrolled (title, price, save); desktop keeps Call/WhatsApp
4. **Back link** (`ListingBackLink.tsx`):
   - labels for saved, chat, profile, home; `has_from_param` + `listing_id` on `listing_back_clicked`
5. **Chat** (`MessageOwnerButton.tsx`):
   - post-login room navigation uses `appPath`

### Validation status (listing detail batch 5)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail engagement + SEO batch (listing detail focus)

1. **View counting** (`ListingEngagement.tsx`):
   - GA4 `listing_view_counted` on successful POST; `listing_view_count_failed` on HTTP/network errors
2. **Owner profile share** (`OwnerProfileShareButton.tsx`):
   - native share → clipboard → manual prompt; methods `native_share`, `clipboard`, `manual_prompt`
3. **SEO / JSON-LD** (`app/listings/[id]/page.tsx`):
   - metadata canonical uses `appPath`; Product schema adds `sku`, `category`, `contentLocation` geo when valid
   - breadcrumb JSON-LD URLs include `basePath`
4. **Owner storefront** (`app/u/[uid]/page.tsx`):
   - profile canonical uses `appPath`

### Validation status (listing detail batch 6)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail reviews SEO + analytics batch (listing detail focus)

1. **Review aggregate** (`lib/listing-review-summary.ts` + `page.tsx`):
   - server fetch for JSON-LD `aggregateRating` when reviews exist
   - parallelized detail-page data fetches with `Promise.all`
2. **Detail view tracker** (`ListingDetailViewTracker.tsx`):
   - enriched `listing_detail_viewed`: `sub_category`, `photo_count`, `has_description`, `review_count`
3. **Recently viewed rail** (`RecentlyViewedRail.tsx`):
   - `listing_recently_viewed_rail_shown` with `listing_count`, `context` (detail/home)

### Validation status (listing detail batch 7)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail map + reviews UX batch (listing detail focus)

1. **Reviews** (`ListingReviews.tsx`):
   - server `initialReviewCount` / `initialAvgRating` in header until live data loads
   - `listing_reviews_section_viewed` on mount
2. **Map snippet** (`ListingMapSnippet.tsx`):
   - client component; lazy-loads Google embed when scrolled near viewport
   - `listing_map_snippet_shown`; map link uses `linkSource=location_snippet`
3. **Header map link** (`page.tsx`):
   - `linkSource=location_header` for `listing_map_link_clicked` segmentation

### Validation status (listing detail batch 8)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail navigation + reviews a11y batch (listing detail focus)

1. **Related listing cards** (`ListingCard.tsx`, `ListingRelatedListingCard.tsx`):
   - optional `returnPath`; rails pass `from` current detail URL for “Back” on child listings
2. **Owner profile links** (`ListingOwnerProfileLink.tsx`, `page.tsx`, `ListingOwnerTrust.tsx`):
   - “View all listings” uses tracked profile link with `link_source=owner_rail`; trust line uses `trust_line`
3. **Reviews form** (`ListingReviews.tsx`):
   - `radiogroup` / `radio` pattern, arrow-key rating, section landmarks, comment `aria-label`

### Validation status (listing detail batch 9)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail return-path + deep-link batch (listing detail focus)

1. **Saved/Profile grid detail links** (`app/saved-listings/page.tsx`, `app/u/[uid]/page.tsx`):
   - pass explicit `returnPath` into `ListingCard` so detail pages can return to saved/profile views
2. **Detail page metadata** (`app/listings/[id]/page.tsx`):
   - Open Graph image now prefers first gallery image (`imageUrls[0]`) before fallback
3. **Description navigation** (`app/listings/[id]/page.tsx`):
   - added “Jump to description” anchor and stable section id (`#listing-description`)

### Validation status (listing detail batch 10)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail contextual back-link batch (listing detail focus)

1. **Related cards return path** (`ListingRelatedListingCard.tsx`):
   - when `sourceListingId` exists, preserve explicit detail-parent return path
   - otherwise derive return path from current `pathname + searchParams` to keep context on home/saved/profile rails

### Validation status (listing detail batch 11)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail quick-jump anchors batch (listing detail focus)

1. **Detail quick links** (`app/listings/[id]/page.tsx`):
   - added compact in-page anchors for Reviews, Location (when geo is valid), and Description
2. **Location section anchors** (`components/listings/ListingMapSnippet.tsx`):
   - added stable `id="listing-location"` and heading linkage for anchor navigation and semantics

### Validation status (listing detail batch 12)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail jump analytics + contact batch (listing detail focus)

1. **Section jump links** (`ListingDetailJumpLinks.tsx`):
   - client nav with Reviews/Location/Description/Contact; `listing_detail_section_jump` on click
2. **Contact section** (`ListingActions.tsx`):
   - `#listing-contact` anchor + `scroll-mt-24`; `listing_contact_section_viewed` when panel enters viewport
   - lead events include `lead_placement` (`desktop` / `mobile`)
3. **Sticky bar leads** (`ListingStickyBar.tsx`):
   - `lead_placement=sticky_bar` on Call/WhatsApp
4. **Lead helpers** (`lib/ga4.ts`):
   - optional `placement` param on `trackLeadStarted` / `trackLeadSubmitted`
5. **Legacy listing URL** (`app/[listingId]/page.tsx`):
   - redirect + canonical use `appPath` for staging `basePath`

### Validation status (listing detail batch 13)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail rails + chat placement batch (listing detail focus)

1. **Jump links** (`ListingDetailJumpLinks.tsx`):
   - Recent / Lister / Similar section jumps when rails exist (recent from browser history)
2. **Rail impressions** (`ListingRailImpressionTracker.tsx`):
   - `listing_owner_rail_viewed`, `listing_similar_rail_viewed` with `listing_count`
3. **Section anchors** (`page.tsx`, `RecentlyViewedRail.tsx`):
   - `listing-owner-rail`, `listing-similar-rail`, `listing-recently-viewed` with `scroll-mt-24`
4. **Chat leads** (`MessageOwnerButton.tsx`):
   - `lead_placement` on chat start/login/failure; uses `trackLeadStarted` / `trackLeadSubmitted`
5. **Error boundary** (`app/listings/[id]/error.tsx`):
   - recoverable listing detail error UI with retry + map link

### Validation status (listing detail batch 14)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail not-found UX batch (listing detail focus)

1. **Custom not-found page** (`app/listings/[id]/not-found.tsx`):
   - clear “Listing not found” message for inactive/removed/invalid IDs
   - recovery CTAs to map browsing and saved listings

### Validation status (listing detail batch 15)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail anchor semantics batch (listing detail focus)

1. **Anchor landing offsets** (`ListingReviews.tsx`, `page.tsx`):
   - added `scroll-mt-24` to Reviews and Description sections for cleaner jump-link landing
2. **Section semantics** (`page.tsx`, `RecentlyViewedRail.tsx`):
   - owner/similar/recent rails now use `aria-labelledby` with stable heading ids

### Validation status (listing detail batch 16)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail route-loading UX batch (listing detail focus)

1. **Route loading skeleton** (`app/listings/[id]/loading.tsx`):
   - added route-level skeleton for gallery, header card, description, and reviews blocks
   - improves perceived speed while listing detail server data resolves

### Validation status (listing detail batch 17)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail failure-state telemetry batch (listing detail focus)

1. **Not-found telemetry** (`app/listings/[id]/not-found.tsx`):
   - `listing_detail_not_found_viewed`
   - CTA tracking via `listing_detail_not_found_cta_clicked` (`search` / `saved_listings`)
2. **Error telemetry** (`app/listings/[id]/error.tsx`):
   - `listing_detail_error_viewed` (includes error message + digest when available)
   - `listing_detail_error_retry_clicked`
   - `listing_detail_error_back_to_map_clicked`
3. **Safety restoration**:
   - restored `ListingDetailJumpLinks.tsx` and `ListingRailImpressionTracker.tsx` after accidental deletion during edits

### Validation status (listing detail batch 18)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail failure telemetry enrichment batch (listing detail focus)

1. **Route-param enrichment** (`app/listings/[id]/not-found.tsx`, `app/listings/[id]/error.tsx`):
   - adds `listing_id` to not-found/error viewed and CTA/retry events using `useParams()`
2. **Schema compatibility**:
   - no new event names in this batch (payload enrichment only)

### Validation status (listing detail batch 19)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail jump-links visibility telemetry batch (listing detail focus)

1. **Jump-links shown tracking** (`ListingDetailJumpLinks.tsx`):
   - `listing_detail_jump_links_shown` fired once per render with `link_count` and comma-delimited visible `sections`
2. **Docs updates**:
   - added new event to `PRE_CUTOVER_CHECKLIST.md` and `RENTALPINS_WEB_ROADMAP.md`

### Validation status (listing detail batch 20)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail jump-link focus-navigation batch (listing detail focus)

1. **Jump link behavior** (`ListingDetailJumpLinks.tsx`):
   - links now perform smooth in-page scroll and move focus to destination section
   - improves keyboard and screen-reader navigation after section jumps
2. **Analytics continuity**:
   - existing `listing_detail_section_jump` tracking preserved (no event schema changes)

### Validation status (listing detail batch 21)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail jump-link motion + cleanup batch (listing detail focus)

1. **Reduced motion support** (`ListingDetailJumpLinks.tsx`):
   - section jumps now respect `prefers-reduced-motion` (`auto` instead of `smooth`)
2. **Timer lifecycle cleanup** (`ListingDetailJumpLinks.tsx`):
   - tracks focus timer in ref, clears on repeat click and component unmount
   - prevents stale focus callbacks after rapid navigation

### Validation status (listing detail batch 22)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail loading a11y batch (listing detail focus)

1. **Loading semantics** (`app/listings/[id]/loading.tsx`):
   - added `role="status"`, `aria-live="polite"`, `aria-busy="true"`, and sr-only loading text
2. **Reduced-motion loading** (`app/listings/[id]/loading.tsx`):
   - switched to `motion-safe:animate-pulse` so shimmer does not animate for reduced-motion users

### Validation status (listing detail batch 23)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail jump-link hash-sync batch (listing detail focus)

1. **URL hash sync** (`ListingDetailJumpLinks.tsx`):
   - section jump clicks now update browser URL hash via `history.replaceState` while keeping smooth scroll + focus behavior
   - improves shareability/back-context for in-page section jumps
2. **Schema continuity**:
   - no event-name changes in this batch (`listing_detail_section_jump` unchanged)

### Validation status (listing detail batch 24)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail hash-focus restore batch (listing detail focus)

1. **Hash deep-link focus restore** (`ListingHashFocusRestorer.tsx`, `page.tsx`):
   - on initial load with section hash (`#listing-reviews`, etc.), focus moves to destination section
   - improves screen-reader context for shared deep links
2. **Schema continuity**:
   - no event-name changes in this batch

### Validation status (listing detail batch 25)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail hash-focus retry batch (listing detail focus)

1. **Hash focus reliability** (`ListingHashFocusRestorer.tsx`):
   - retries focus up to a short bounded window for late-mounted sections
   - adds cleanup for pending timers on unmount
2. **Schema continuity**:
   - no event-name changes in this batch

### Validation status (listing detail batch 26)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail jump-link active-state batch (listing detail focus)

1. **Active section state** (`ListingDetailJumpLinks.tsx`):
   - tracks current hash and marks matching jump link with `aria-current="location"`
   - updates on both click-driven hash changes and browser `hashchange` events
2. **Schema continuity**:
   - no event-name changes in this batch

### Validation status (listing detail batch 27)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail jump-link visual active-state batch (listing detail focus)

1. **Active link styling** (`ListingDetailJumpLinks.tsx`):
   - current hash target link now gets visible underline emphasis (in addition to `aria-current`)
   - keeps jump nav state clearer for sighted keyboard users
2. **Schema continuity**:
   - no event-name changes in this batch

### Validation status (listing detail batch 28)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post listing form telemetry batch (post listing focus)

1. **Form viewed telemetry** (`components/post/PostListingForm.tsx`):
   - `post_listing_form_viewed` for create/edit modes (with `listing_id` in edit mode)
   - gated to fire when post access is allowed and edit draft is ready
2. **Validation telemetry** (`components/post/PostListingForm.tsx`):
   - `post_listing_validation_failed` with structured `reason` for title/description/price/location/photo checks
3. **Docs updates**:
   - added new post events to `PRE_CUTOVER_CHECKLIST.md` and `RENTALPINS_WEB_ROADMAP.md`

### Validation status (post listing batch 30)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed listing detail hash-focus observability batch (listing detail focus)

1. **Hash focus telemetry** (`ListingHashFocusRestorer.tsx`):
   - emits `listing_detail_hash_focus_restored` on successful focus restore
   - includes `section_id` and `attempt_count` for deep-link reliability monitoring
2. **Docs updates**:
   - added event to `PRE_CUTOVER_CHECKLIST.md` and `RENTALPINS_WEB_ROADMAP.md`

### Validation status (listing detail batch 29)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate telemetry batch (post listing focus)

1. **Activation page view telemetry** (`app/post/activate/page.tsx`):
   - `post_activate_viewed` once per listing activation session
2. **Plan-load telemetry** (`app/post/activate/page.tsx`):
   - `post_activate_plans_loaded` with `plan_count` and active `gateway`
3. **Activation wait-state telemetry** (`app/post/activate/page.tsx`):
   - `post_activate_wait_timed_out` when activation exceeds timeout window
   - `post_activate_wait_retry_clicked` when user selects “Keep waiting”
4. **Docs updates**:
   - added new post activate events to checklist + roadmap GA4 event lists

### Validation status (post listing batch 31)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate status + payment telemetry batch (post listing focus)

1. **Activation status states** (`app/post/activate/page.tsx`):
   - `post_activate_status_viewed` once per status (`missing`, `forbidden`, `live`)
2. **Payment interaction telemetry** (`app/post/activate/page.tsx`):
   - `post_activate_payment_dismissed` on Razorpay checkout close
   - `post_activate_payment_failed` for both Razorpay and PayPal failures
3. **Docs updates**:
   - added new post activate events to checklist + roadmap GA4 lists

### Validation status (post listing batch 32)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate pre-checkout edge-state telemetry batch (post listing focus)

1. **Activation guard telemetry** (`app/post/activate/page.tsx`):
   - `post_activate_missing_listing_id` when activation page is opened without a listing id
2. **Plan readiness edge-state telemetry** (`app/post/activate/page.tsx`):
   - `post_activate_plans_empty_viewed` when no plans are returned for the user/gateway context
   - `post_activate_plans_error_viewed` when plan-fetch flow enters error state
3. **Docs updates**:
   - added new post activate events to checklist + roadmap GA4 lists

### Validation status (post listing batch 33)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate plan-selection telemetry batch (post listing focus)

1. **Plan selection telemetry** (`app/post/activate/page.tsx`):
   - emits `post_activate_plan_selected` before checkout handoff
   - includes `plan_id`, `plan_name`, `plan_price`, `plan_currency`, `plan_duration_days`, `plan_position`, and `gateway`
2. **Flow wiring cleanup** (`app/post/activate/page.tsx`):
   - centralized pay-button click handling into `handlePlanCheckout` to ensure instrumentation executes consistently for both Razorpay and PayPal paths
3. **Docs updates**:
   - added `post_activate_plan_selected` to checklist + roadmap GA4 lists

### Validation status (post listing batch 34)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate exit-action telemetry batch (post listing focus)

1. **Exit CTA telemetry** (`app/post/activate/page.tsx`):
   - emits `post_activate_exit_clicked` for secondary navigation actions on activation flow
   - captures `destination`, `source`, and active `gateway` context
2. **Coverage across activation states** (`app/post/activate/page.tsx`):
   - tracked exits from missing-id, missing listing, forbidden, already-live, timed-out wait state, and footer actions (`Edit draft`, `My listings`)
3. **Docs updates**:
   - added `post_activate_exit_clicked` to checklist + roadmap GA4 lists

### Validation status (post listing batch 35)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate plans retry telemetry + UX batch (post listing focus)

1. **Plan reload control** (`app/post/activate/page.tsx`):
   - added `Retry plans` CTA for `plansStatus === "error"` and `plansStatus === "empty"` states
   - refactored plan fetching into reusable `loadPlans()` callback for both initial load and manual retry
2. **Retry intent telemetry** (`app/post/activate/page.tsx`):
   - emits `post_activate_plans_retry_clicked` on manual plan reload attempts
   - includes `listing_id`, `home_iso`, and `gateway` dimensions for troubleshooting regional/gateway gaps
3. **Docs updates**:
   - added `post_activate_plans_retry_clicked` to checklist + roadmap GA4 lists

### Validation status (post listing batch 36)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate retry-outcome telemetry batch (post listing focus)

1. **Retry resolution telemetry** (`app/post/activate/page.tsx`):
   - emits `post_activate_plans_retry_result` once each manual retry reaches a terminal plan state (`ready`, `empty`, or `error`)
   - includes `result`, `retry_count`, and `plan_count` to measure whether retries recover the flow
2. **Manual retry tracking context** (`app/post/activate/page.tsx`):
   - tracks retry attempts with local counters and pending resolution state so outcome events map to explicit user retry intent
3. **Docs updates**:
   - added `post_activate_plans_retry_result` to checklist + roadmap GA4 lists

### Validation status (post listing batch 37)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate wait-resolution telemetry batch (post listing focus)

1. **Wait recovery telemetry** (`app/post/activate/page.tsx`):
   - emits `post_activate_wait_resolved` when a payment wait session resolves to a live listing
   - includes `had_timeout` and `wait_retry_count` to show whether users recovered after timeout + keep-wait actions
2. **Exit context enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_exit_clicked` now includes `wait_state` (`idle`, `waiting`, `timed_out`) and `wait_retry_count`
   - enables segmentation of users exiting during uncertain payment wait windows
3. **Docs updates**:
   - added `post_activate_wait_resolved` to checklist + roadmap GA4 lists

### Validation status (post listing batch 38)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate dwell-time telemetry enrichment batch (post listing focus)

1. **Dwell-time dimensions** (`app/post/activate/page.tsx`):
   - added shared dwell metadata (`dwell_seconds`, `dwell_bucket`) based on elapsed time since activation view opened
   - bucket values: `lt_10s`, `10_to_30s`, `30_to_60s`, `gte_60s`
2. **Outcome + exit enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_wait_resolved` now includes dwell metadata
   - `post_activate_exit_clicked` now includes dwell metadata in addition to existing wait-state context
3. **Docs updates**:
   - recorded dwell-time telemetry enrichment notes in checklist + roadmap GA4 sections

### Validation status (post listing batch 39)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate checkout-attempt sequencing telemetry batch (post listing focus)

1. **Attempt sequencing state** (`app/post/activate/page.tsx`):
   - added session-level and per-plan attempt counters for activation checkout actions
   - counters persist during the current activation page session to reflect true retry progression
2. **Checkout + failure enrichment** (`app/post/activate/page.tsx`):
   - `checkout_started` now includes `checkout_attempt` and `plan_attempt`
   - `post_activate_payment_failed` and `post_activate_payment_dismissed` now include the same attempt dimensions
   - applies across both Razorpay and PayPal paths
3. **Docs updates**:
   - documented attempt-dimension enrichment in checklist + roadmap telemetry notes

### Validation status (post listing batch 40)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate success-outcome enrichment batch (post listing focus)

1. **Success event enrichment** (`app/post/activate/page.tsx`):
   - `payment_success` now includes `checkout_attempt`, `plan_attempt`, `dwell_seconds`, and `dwell_bucket`
   - `listing_published` now includes the same attempt + dwell dimensions
2. **Attempt context carry-forward** (`app/post/activate/page.tsx`):
   - stores the most recent checkout attempt metadata at checkout start and reuses it when activation later resolves to live
   - enables attribution of successful activation to first attempt vs retried payment flows
3. **Docs updates**:
   - recorded success-event enrichment notes in checklist + roadmap telemetry sections

### Validation status (post listing batch 41)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate return-visit telemetry batch (post listing focus)

1. **Return-visit tracking** (`app/post/activate/page.tsx`):
   - added sessionStorage-backed per-listing visit counter for activation page opens
   - emits `post_activate_return_visit_viewed` from the second visit onward with `visit_count`
2. **Resilience handling** (`app/post/activate/page.tsx`):
   - safely guards storage reads/writes for privacy-restricted environments where sessionStorage may be unavailable
3. **Docs updates**:
   - added `post_activate_return_visit_viewed` to checklist + roadmap GA4 event lists

### Validation status (post listing batch 42)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate pre-checkout abandon telemetry batch (post listing focus)

1. **Abandon-before-checkout event** (`app/post/activate/page.tsx`):
   - emits `post_activate_abandoned_before_checkout` on activation page exit when user can pay but never started checkout
   - includes dwell metadata to separate quick bounces from longer consideration sessions
2. **Eligibility guardrails** (`app/post/activate/page.tsx`):
   - event only fires when listing is payable (`canPay` true), listing id is present, and checkout attempts remain zero
   - avoids pollution from non-owner, missing-id, and already-checked-out sessions
3. **Docs updates**:
   - added `post_activate_abandoned_before_checkout` to checklist + roadmap GA4 event lists

### Validation status (post listing batch 43)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate plan-impression telemetry batch (post listing focus)

1. **Plan impressions event** (`app/post/activate/page.tsx`):
   - emits `post_activate_plans_shown` once when plans render in ready state
   - includes `plan_count`, ordered `plan_ids`, and ordered `plan_prices` for impression-to-selection analysis
2. **Instrumentation coverage alignment** (`app/post/activate/page.tsx`):
   - complements existing `post_activate_plan_selected` and `checkout_started` instrumentation to complete top-of-funnel visibility on activation pricing UI
3. **Docs updates**:
   - added `post_activate_plans_shown` to checklist + roadmap GA4 event lists

### Validation status (post listing batch 44)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate plan-position outcome telemetry batch (post listing focus)

1. **Checkout outcome position context** (`app/post/activate/page.tsx`):
   - added `plan_position` to `checkout_started`, `post_activate_payment_failed`, and `post_activate_payment_dismissed`
   - ensures position-based funnel analysis remains consistent across selection, checkout start, and payment outcomes
2. **Shared plan-position resolver** (`app/post/activate/page.tsx`):
   - introduced a small helper to resolve position from current plan list by `plan_id`
   - safely falls back to `0` if a plan cannot be resolved in edge cases
3. **Docs updates**:
   - recorded plan-position enrichment notes in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 45)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate plan-signature telemetry enrichment batch (post listing focus)

1. **Normalized plan signature dimension** (`app/post/activate/page.tsx`):
   - added shared `plan_signature` format (`price_currency_duration`) for activation plans
   - ensures tier-level rollups remain stable even if plan IDs change between environments
2. **Cross-funnel propagation** (`app/post/activate/page.tsx`):
   - added `plan_signature` to `post_activate_plan_selected`, `checkout_started`, `post_activate_payment_failed`, and `post_activate_payment_dismissed`
   - carried `plan_signature` (and `plan_position`) into `payment_success` and `listing_published` via last checkout context refs
3. **Docs updates**:
   - documented plan-signature enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 46)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate plan-signature impression alignment batch (post listing focus)

1. **Plan impression enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_plans_shown` now includes ordered `plan_signatures`
   - signature list uses the same normalized tier key format as selection/checkout/success events
2. **Funnel key consistency** (`app/post/activate/page.tsx`):
   - plan impression and downstream conversion/failure events now share one tier-level grouping dimension
   - reduces dashboard joins on plan IDs and improves comparability across environments
3. **Docs updates**:
   - recorded `plan_signatures` impression enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 47)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate option-set context telemetry batch (post listing focus)

1. **Option-set context helper** (`app/post/activate/page.tsx`):
   - added shared plan-context dimensions: `visible_plan_count` and `has_multiple_plans`
   - computed from currently visible activation plans
2. **Cross-funnel propagation** (`app/post/activate/page.tsx`):
   - added plan-context dimensions to `post_activate_plan_selected`, `checkout_started`, `post_activate_payment_failed`, `post_activate_payment_dismissed`, `payment_success`, and `listing_published`
   - enables fast segmentation of single-option vs multi-option user behavior throughout activation funnel
3. **Docs updates**:
   - recorded option-set context enrichment notes in checklist + roadmap activation telemetry sections

### Validation status (post listing batch 48)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate retry-option-context telemetry batch (post listing focus)

1. **Retry outcome context parity** (`app/post/activate/page.tsx`):
   - enriched `post_activate_plans_retry_result` with `visible_plan_count` and `has_multiple_plans`
   - keeps retry recovery analysis aligned with selection/checkout/success option-set segmentation
2. **Funnel consistency improvement** (`app/post/activate/page.tsx`):
   - option-set dimensions now cover both conversion path and retry-resolution path
   - simplifies dashboard slicing for “single option vs multi option” behavior across activation states
3. **Docs updates**:
   - documented retry-result option-set enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 49)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate availability option-context telemetry batch (post listing focus)

1. **Availability event enrichment** (`app/post/activate/page.tsx`):
   - added `visible_plan_count` and `has_multiple_plans` to `post_activate_plans_loaded`
   - added the same option-set dimensions to `post_activate_plans_empty_viewed`
2. **Option-set parity completion** (`app/post/activate/page.tsx`):
   - plan availability, impression, selection, checkout, retry outcome, and success paths now share the same option-set context dimensions
   - enables consistent segmentation across the complete activation pricing lifecycle
3. **Docs updates**:
   - documented availability-event option-set enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 50)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate loaded-state plan-signature enrichment batch (post listing focus)

1. **Loaded-state signature context** (`app/post/activate/page.tsx`):
   - enriched `post_activate_plans_loaded` with ordered `plan_signatures`
   - uses the same normalized signature format as impression/selection/checkout/success events
2. **Tier-analysis continuity** (`app/post/activate/page.tsx`):
   - allows direct comparison of loaded plan mixes against shown/selected/converted plan signatures without ID remapping
3. **Docs updates**:
   - recorded loaded-state `plan_signatures` enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 51)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate availability-state normalization telemetry batch (post listing focus)

1. **Availability-state dimension** (`app/post/activate/page.tsx`):
   - added `availability_state` to `post_activate_plans_loaded`, `post_activate_plans_shown`, `post_activate_plans_empty_viewed`, and `post_activate_plans_error_viewed`
   - added `availability_state` to `post_activate_plans_retry_result` (mirrors resolved retry state)
2. **Cross-event state filtering** (`app/post/activate/page.tsx`):
   - enables unified ready/empty/error slicing across availability and retry events without relying on event-name joins
3. **Docs updates**:
   - documented `availability_state` normalization in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 52)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate retry-intent state-context telemetry batch (post listing focus)

1. **Pre-retry state enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_plans_retry_clicked` now includes `availability_state` at click time
   - captures whether retry intent came from `ready`, `empty`, or `error` states
2. **Option-set context on retry intent** (`app/post/activate/page.tsx`):
   - added `visible_plan_count` and `has_multiple_plans` to retry-click event
   - aligns retry-intent instrumentation with downstream retry-result and funnel segmentation dimensions
3. **Docs updates**:
   - documented retry-click state/context enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 53)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate retry-click sequencing telemetry batch (post listing focus)

1. **Retry click attempt sequencing** (`app/post/activate/page.tsx`):
   - `post_activate_plans_retry_clicked` now includes `retry_count_before_click` and `retry_count_after_click`
   - provides explicit first/second/third retry intent ordering without post-processing
2. **Retry state handling update** (`app/post/activate/page.tsx`):
   - retry count increment now uses derived before/after values to keep telemetry payload and state update aligned
3. **Docs updates**:
   - documented retry-click sequencing enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 54)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate wait-retry sequencing telemetry batch (post listing focus)

1. **Wait-retry attempt sequencing** (`app/post/activate/page.tsx`):
   - `post_activate_wait_retry_clicked` now includes `retry_count_before_click` and `retry_count_after_click`
   - aligns wait-retry telemetry with plan-retry sequencing dimensions
2. **State + telemetry consistency** (`app/post/activate/page.tsx`):
   - wait retry count update now uses derived before/after values to keep event payload and state mutation synchronized
3. **Docs updates**:
   - documented wait-retry sequencing enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 55)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate wait-retry state-context telemetry batch (post listing focus)

1. **Wait-retry context enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_wait_retry_clicked` now includes `availability_state`, `visible_plan_count`, and `has_multiple_plans`
   - aligns wait-retry intent with the same state/context dimensions used in plan-retry instrumentation
2. **Retry telemetry parity** (`app/post/activate/page.tsx`):
   - wait retry events now carry sequencing (`retry_count_before_click` / `retry_count_after_click`) and state/option context together
   - enables uniform retry-intent analysis across activation wait and plan-loading branches
3. **Docs updates**:
   - documented wait-retry state/context enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 56)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate ready-state explicitness telemetry batch (post listing focus)

1. **Explicit ready-state propagation** (`app/post/activate/page.tsx`):
   - added `availability_state: "ready"` to `post_activate_plan_selected` and `checkout_started`
   - added the same explicit ready-state field to checkout outcome events (`post_activate_payment_failed`, `post_activate_payment_dismissed`)
2. **Query consistency improvement** (`app/post/activate/page.tsx`):
   - removes downstream assumptions that selection/checkout events only happen in ready state
   - enables straightforward state filters across mixed event groups
3. **Docs updates**:
   - documented explicit ready-state enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 57)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate success-state explicitness telemetry batch (post listing focus)

1. **End-state availability field parity** (`app/post/activate/page.tsx`):
   - added explicit `availability_state: "ready"` to `payment_success` and `listing_published`
   - aligns success events with ready-state explicitness already present on selection/checkout/outcome events
2. **Funnel consistency improvement** (`app/post/activate/page.tsx`):
   - enables uniform state filtering across activation events from plan shown through final publish without inferred assumptions
3. **Docs updates**:
   - documented success-event availability-state explicitness in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 58)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate entry-state context telemetry batch (post listing focus)

1. **Entry event enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_viewed` now includes `availability_state`, `visible_plan_count`, and `has_multiple_plans`
   - aligns entry instrumentation with downstream activation segmentation dimensions
2. **Funnel consistency improvement** (`app/post/activate/page.tsx`):
   - enables entry-to-outcome analysis by state and option-set context without relying on joins from later events
3. **Docs updates**:
   - documented `post_activate_viewed` state/context enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 59)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate status-transition context telemetry batch (post listing focus)

1. **Status event enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_status_viewed` now includes `availability_state`, `visible_plan_count`, and `has_multiple_plans`
   - captures option-set context alongside status transitions (`missing`, `forbidden`, `live`)
2. **Transition parity improvement** (`app/post/activate/page.tsx`):
   - aligns status-transition telemetry with entry/retry/checkout event context dimensions
   - supports consistent segmentation across activation lifecycle branches
3. **Docs updates**:
   - documented status-viewed context enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 60)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate missing-id guardrail context telemetry batch (post listing focus)

1. **Missing-id event enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_missing_listing_id` now includes `availability_state`, `visible_plan_count`, and `has_multiple_plans`
   - provides the same context dimensions as other activation entry/state events
2. **Guardrail parity improvement** (`app/post/activate/page.tsx`):
   - missing listing-id path now participates in unified state/option-set segmentation
   - reduces blind spots when analyzing non-standard activation entry flows
3. **Docs updates**:
   - documented missing-id context enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 61)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate timeout-path context telemetry batch (post listing focus)

1. **Timeout event enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_wait_timed_out` now includes `availability_state`, `visible_plan_count`, and `has_multiple_plans`
   - captures plan-state/option context at timeout moment
2. **Timeout-path parity improvement** (`app/post/activate/page.tsx`):
   - timeout branch now shares the same context dimensions as entry, retry, and checkout outcome events
   - enables uniform segmentation of delayed-payment experiences
3. **Docs updates**:
   - documented timeout-event state/context enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 62)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate resolved-wait context telemetry batch (post listing focus)

1. **Resolved-wait event enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_wait_resolved` now includes `availability_state`, `visible_plan_count`, and `has_multiple_plans`
   - captures plan-state/option context when wait flow resolves to live
2. **Wait-path symmetry improvement** (`app/post/activate/page.tsx`):
   - timed-out and resolved wait events now share the same context dimensions
   - supports consistent segmentation for delayed-payment path outcomes
3. **Docs updates**:
   - documented resolved-wait state/context enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 63)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate shared checkout-state telemetry refinement batch (post listing focus)

1. **Shared checkout-state helper** (`app/post/activate/page.tsx`):
   - introduced a reusable helper that emits `availability_state` with option-set context (`visible_plan_count`, `has_multiple_plans`)
   - centralizes selection/checkout/outcome/success context payload generation
2. **Hardcoded ready-state removal** (`app/post/activate/page.tsx`):
   - replaced hardcoded `availability_state: "ready"` payloads on `post_activate_plan_selected`, `checkout_started`, `post_activate_payment_failed`, `post_activate_payment_dismissed`, `payment_success`, and `listing_published`
   - improves future-proofing if activation flow state assumptions evolve
3. **Docs updates**:
   - documented shared checkout-state payload refinement in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 64)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate retry-channel normalization telemetry batch (post listing focus)

1. **Retry channel dimension** (`app/post/activate/page.tsx`):
   - added `retry_channel: "plan_retry"` to `post_activate_plans_retry_clicked` and `post_activate_plans_retry_result`
   - added `retry_channel: "wait_retry"` to `post_activate_wait_retry_clicked`
2. **Cross-branch retry comparability** (`app/post/activate/page.tsx`):
   - plan-load retries and wait retries can now be compared using one shared dimension instead of event-name grouping
3. **Docs updates**:
   - documented retry-channel enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 65)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate wait-branch retry-channel parity batch (post listing focus)

1. **Wait-path branch key enrichment** (`app/post/activate/page.tsx`):
   - added `retry_channel: "wait_retry"` to `post_activate_wait_timed_out`
   - added `retry_channel: "wait_retry"` to `post_activate_wait_resolved`
2. **Retry taxonomy consistency** (`app/post/activate/page.tsx`):
   - plan retry and wait retry branches now share explicit branch keys across intent and outcome events
   - simplifies unified retry dashboards and branch-level filtering
3. **Docs updates**:
   - documented wait-path retry-channel parity in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 66)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate non-retry branch-key normalization batch (post listing focus)

1. **Non-retry channel normalization** (`app/post/activate/page.tsx`):
   - added `retry_channel: "none"` across non-retry activation events (entry/status/availability/selection/checkout/outcome/success/exit)
   - keeps retry-path events on `plan_retry`/`wait_retry` while non-retry events use a consistent explicit branch key
2. **Null-free branch segmentation** (`app/post/activate/page.tsx`):
   - dashboards can now segment the full activation funnel by `retry_channel` without null handling or event-name-derived branching
3. **Docs updates**:
   - documented non-retry channel normalization in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 67)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate exit-path context parity telemetry batch (post listing focus)

1. **Exit event context enrichment** (`app/post/activate/page.tsx`):
   - `post_activate_exit_clicked` now includes shared checkout-state context (`availability_state`, `visible_plan_count`, `has_multiple_plans`)
   - preserves existing wait-state/dwell metadata while aligning exit analytics with the rest of activation funnel dimensions
2. **Parity completion check**:
   - activation-related telemetry remains centralized in `app/post/activate/page.tsx`
   - no additional activation event emitters outside this file required retry-channel/context updates
3. **Docs updates**:
   - documented exit-path context parity enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 68)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate phase-dimension telemetry batch (post listing focus)

1. **Activation phase taxonomy** (`app/post/activate/page.tsx`):
   - introduced normalized `activation_phase` values: `entry`, `availability`, `selection`, `checkout`, `wait`, `outcome`, `exit`
   - added a shared helper for phase payload consistency
2. **Cross-funnel phase propagation** (`app/post/activate/page.tsx`):
   - wired `activation_phase` into key activation events across entry/state, availability, selection, checkout, wait, outcomes, and exits
   - enables top-level funnel slicing without event-name grouping heuristics
3. **Docs updates**:
   - documented phase-dimension enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 69)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate flow-version telemetry batch (post listing focus)

1. **Activation flow version constant** (`app/post/activate/page.tsx`):
   - introduced `activation_flow_version` constant (`2026-05-post-activate-v1`) with a shared payload helper
2. **Cross-event version propagation** (`app/post/activate/page.tsx`):
   - added `activation_flow_version` to activation events across entry, availability, selection, checkout, wait, outcome, and exit branches
   - enables safe historical comparisons when telemetry schema evolves in future batches
3. **Docs updates**:
   - documented activation flow versioning in checklist + roadmap telemetry notes

### Validation status (post listing batch 71)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate event-group taxonomy telemetry batch (post listing focus)

1. **Event-group taxonomy helper** (`app/post/activate/page.tsx`):
   - introduced normalized `activation_event_group` values: `entry`, `availability`, `selection`, `payment`, `retry`, `outcome`, `navigation`
   - added shared helper for consistent taxonomy payload injection
2. **Cross-event group propagation** (`app/post/activate/page.tsx`):
   - applied `activation_event_group` across activation events spanning entry, availability, selection, checkout/payment, retry flows, outcomes, and exits
   - enables compact high-level reporting views without custom event buckets
3. **Docs updates**:
   - documented event-group taxonomy enrichment in checklist + roadmap telemetry notes

### Validation status (post listing batch 72)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate path-taxonomy telemetry batch (post listing focus)

1. **Activation path taxonomy** (`app/post/activate/page.tsx`):
   - introduced normalized `activation_path` values: `normal`, `plan_retry`, `wait_retry`, `guardrail`
   - added shared helper for consistent path payload injection
2. **Cross-event path propagation** (`app/post/activate/page.tsx`):
   - applied `activation_path` across activation events using event-appropriate semantics (e.g., retry events -> retry paths, missing/forbidden/empty/error -> guardrail)
   - improves one-field journey segmentation without relying on event-name logic
3. **Docs updates**:
   - documented activation path taxonomy enrichment in checklist + roadmap telemetry notes

### Validation status (post listing batch 73)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate context-completeness marker batch (post listing focus)

1. **Context completeness marker** (`app/post/activate/page.tsx`):
   - extended shared flow metadata to include `activation_context_complete: true`
   - automatically propagates to activation events that already use the common flow metadata helper
2. **QA filtering improvement**:
   - telemetry validation can now filter on one boolean to isolate fully-shaped activation context payloads
3. **Docs updates**:
   - documented `activation_context_complete` marker in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 74)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate schema-tag telemetry batch (post listing focus)

1. **Schema fields tag constant** (`app/post/activate/page.tsx`):
   - introduced `activation_schema_fields` as a compact, pipe-delimited schema signature string
   - includes core context dimensions (flow version, phase/group/path, retry/state, option-set markers)
2. **Shared metadata propagation** (`app/post/activate/page.tsx`):
   - added `activation_schema_fields` to shared flow metadata helper so activation events receive it automatically
   - simplifies schema drift checks in GA exports without custom post-processing
3. **Docs updates**:
   - documented `activation_schema_fields` enrichment in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 75)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate batch-marker telemetry enrichment (post listing focus)

1. **Batch marker constant** (`app/post/activate/page.tsx`):
   - introduced `activation_batch` (`76`) in shared activation flow metadata
   - added marker to schema signature string for explicit schema inventory tracking
2. **Cross-event rollout correlation** (`app/post/activate/page.tsx`):
   - activation events now carry batch id via shared metadata helper
   - enables direct analytics-to-rollout batch attribution without external mapping tables
3. **Docs updates**:
   - documented `activation_batch` telemetry enrichment in checklist + roadmap notes

### Validation status (post listing batch 76)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate schema-summary QA event batch (post listing focus)

1. **Schema summary event** (`app/post/activate/page.tsx`):
   - added one-time `post_activate_schema_summary_viewed` on activation page view for authenticated sessions
   - includes shared schema/version metadata (`activation_flow_version`, `activation_batch`, `activation_schema_fields`, `activation_context_complete`) plus current state/option context
2. **QA shortcut purpose**:
   - enables quick telemetry rollout verification with a single event query row instead of aggregating multiple activation events
3. **Docs updates**:
   - added `post_activate_schema_summary_viewed` to checklist + roadmap GA4 event lists

### Validation status (post listing batch 77)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate schema-summary auth-state coverage batch (post listing focus)

1. **Schema summary auth coverage** (`app/post/activate/page.tsx`):
   - `post_activate_schema_summary_viewed` now fires for both authenticated and unauthenticated activation sessions
   - added `auth_state` dimension (`authenticated` / `unauthenticated`) to separate pre-login redirect traffic
2. **QA continuity improvement**:
   - schema/version marker validation no longer depends on successful auth session entry
3. **Docs updates**:
   - documented schema-summary auth-state coverage in checklist + roadmap telemetry notes

### Validation status (post listing batch 78)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate entry auth-state telemetry batch (post listing focus)

1. **Entry/guardrail auth-state enrichment** (`app/post/activate/page.tsx`):
   - added `auth_state` to `post_activate_viewed`
   - added `auth_state` to `post_activate_missing_listing_id`
2. **Auth-segmented analysis improvement**:
   - activation entry and missing-id guardrail events can now be segmented by authenticated vs unauthenticated users without joining schema-summary event
3. **Docs updates**:
   - documented entry/guardrail auth-state enrichment in checklist + roadmap telemetry notes

### Validation status (post listing batch 79)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate full-funnel auth-state telemetry parity batch (post listing focus)

1. **Shared auth metadata helper** (`app/post/activate/page.tsx`):
   - introduced reusable auth-state payload helper (`authenticated` / `unauthenticated`)
   - replaced inline auth-state payload fragments with shared helper usage
2. **Full-funnel auth propagation** (`app/post/activate/page.tsx`):
   - extended `auth_state` coverage across remaining activation events (availability, retry, wait, checkout, outcome, and exit branches)
   - enables single-dimension auth segmentation across the complete activation telemetry surface
3. **Docs updates**:
   - documented full-funnel auth-state parity in checklist + roadmap telemetry notes

### Validation status (post listing batch 80)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate source-marker telemetry batch (post listing focus)

1. **Shared source marker constant** (`app/post/activate/page.tsx`):
   - introduced `activation_data_source` with value `client_live` in shared activation metadata
   - added marker to schema signature inventory string
2. **Cross-event source attribution** (`app/post/activate/page.tsx`):
   - activation events now carry source marker via shared flow metadata helper
   - supports immediate filtering of client-emitted activation telemetry vs future alternate emitters
3. **Docs updates**:
   - documented `activation_data_source` marker in checklist + roadmap telemetry notes

### Validation status (post listing batch 81)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post flow metadata parity batch (post listing focus)

1. **PostListingForm shared metadata helper** (`components/post/PostListingForm.tsx`):
   - added shared post-flow metadata (`post_flow_version`, `post_flow_batch`, `post_data_source`)
   - metadata is centralized via helper for consistent propagation
2. **Non-activation post event enrichment** (`components/post/PostListingForm.tsx`):
   - enriched `post_listing_form_viewed`, `post_listing_validation_failed`, `listing_draft_created`, and `listing_draft_updated` with post-flow metadata
   - aligns post-form telemetry with activation telemetry’s rollout/source tagging strategy
3. **Docs updates**:
   - documented post-flow metadata enrichment in checklist + roadmap telemetry notes

### Validation status (post listing batch 82)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login flow telemetry foundation batch (login focus)

1. **Login lifecycle instrumentation** (`app/auth/login/page.tsx`):
   - added `login_viewed` and `login_redirected_after_auth` for page entry and auto-redirect visibility
2. **Auth method interaction + failure telemetry** (`app/auth/login/page.tsx`):
   - added OTP events: `login_otp_send_requested`, `login_otp_send_failed`, `login_otp_verify_submitted`, `login_otp_verify_failed`, `login_otp_cancelled`
   - added Google events: `login_google_signin_clicked`, `login_google_signin_failed`
3. **Docs updates**:
   - added login events to checklist + roadmap GA4 event lists

### Validation status (login batch 83)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login flow shared metadata telemetry batch (login focus)

1. **Shared login metadata constants** (`app/auth/login/page.tsx`):
   - added `login_flow_version`, `login_flow_batch`, `login_data_source`, and `login_schema_fields`
   - introduced `loginMeta()` helper for consistent payload injection
2. **Cross-event metadata propagation** (`app/auth/login/page.tsx`):
   - applied shared metadata to existing login events (view, redirect, OTP actions/failures, Google actions/failures, OTP cancellation)
   - aligns login telemetry with post/activation rollout + schema observability pattern
3. **Docs updates**:
   - documented login metadata enrichment in checklist + roadmap telemetry notes

### Validation status (login batch 84)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login auth-state and method normalization telemetry batch (login focus)

1. **Shared login schema/context enrichment** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 85 and expanded `login_schema_fields` with `auth_state` and `login_method`
   - added shared `authStateMeta()` and `methodMeta()` helpers for consistent payload shaping
2. **Cross-event context propagation** (`app/auth/login/page.tsx`):
   - added normalized `auth_state` + `login_method` to all login events (view, auto-redirect, OTP actions/failures/cancel, Google actions/failures)
   - login methods are normalized as `none`, `auto`, `otp`, and `google` for null-free branch segmentation
3. **Docs updates**:
   - documented auth-state/method login telemetry parity in checklist + roadmap notes

### Validation status (login batch 85)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login schema summary QA telemetry batch (login focus)

1. **Schema-summary QA event** (`app/auth/login/page.tsx`):
   - added `login_schema_summary_viewed` on login-page entry after auth loading resolves
   - event includes shared login metadata + existing login context fields for DebugView payload verification
2. **Batch/version alignment** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 86
   - preserves existing `login_flow_version` and `login_data_source` while extending QA observability
3. **Docs updates**:
   - added the new login schema-summary event to GA4 event dictionaries
   - documented schema QA telemetry note in checklist + roadmap

### Validation status (login batch 86)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login outcome telemetry batch (login focus)

1. **Outcome event coverage** (`app/auth/login/page.tsx`):
   - added `login_success` for all successful login completion paths (auto-redirected session, OTP verify completion, Google sign-in completion)
   - added `login_blocked_phone_required` when Google sign-in does not clear phone verification requirements
2. **Schema metadata alignment** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 87
   - extended `login_schema_fields` to include outcome-oriented fields (`destination`, `outcome`, `block_reason`)
3. **Docs updates**:
   - added new login outcome events to checklist + roadmap GA4 dictionaries
   - documented outcome telemetry note for method-to-result funnel analysis

### Validation status (login batch 87)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login attempt sequencing telemetry batch (login focus)

1. **Attempt sequencing helpers** (`app/auth/login/page.tsx`):
   - added shared counters for overall login attempts plus per-method attempts (`otp`, `google`)
   - introduced attempt metadata propagation (`login_attempt`, `method_attempt`) through helper + active-attempt refs
2. **Cross-event attempt propagation** (`app/auth/login/page.tsx`):
   - OTP flow now carries attempt fields across `login_otp_send_requested`, `login_otp_send_failed`, `login_otp_verify_submitted`, `login_otp_verify_failed`, `login_success` (OTP path), and `login_otp_cancelled`
   - Google flow now carries attempt fields across `login_google_signin_clicked`, `login_google_signin_failed`, `login_success` (Google path), and `login_blocked_phone_required`
3. **Schema alignment + docs updates**:
   - bumped `login_flow_batch` to 88 and extended `login_schema_fields` with attempt dimensions
   - documented attempt sequencing telemetry in checklist + roadmap notes

### Validation status (login batch 88)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login abandonment telemetry batch (login focus)

1. **Abandonment-state tracking** (`app/auth/login/page.tsx`):
   - added OTP journey state flags (`otpSent`, `otpVerified`) to detect incomplete OTP journeys
   - emits `login_abandoned_after_otp_sent` on page unmount when OTP was sent but verification did not complete
2. **Abandonment context propagation** (`app/auth/login/page.tsx`):
   - abandonment event includes `abandon_stage: "otp_sent_before_verify"` plus existing login context metadata
   - reuses active OTP attempt metadata (`login_attempt`, `method_attempt`) for retry-depth abandonment analysis
3. **Schema/docs alignment**:
   - bumped `login_flow_batch` to 89 and extended `login_schema_fields` with `abandon_stage`
   - added new abandonment event to checklist + roadmap GA4 dictionaries

### Validation status (login batch 89)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login Google abandonment telemetry batch (login focus)

1. **Google abandonment-state tracking** (`app/auth/login/page.tsx`):
   - added Google journey flags (`googleStarted`, `googleResolved`) to detect unresolved Google sign-in journeys
   - emits `login_abandoned_after_google_click` on unmount when Google sign-in started but no success/failure/block outcome was recorded
2. **Abandonment context propagation** (`app/auth/login/page.tsx`):
   - abandonment event includes `abandon_stage: "google_clicked_before_resolution"` with active Google attempt metadata
   - event reuses shared auth/method/login metadata for parity with other login telemetry
3. **Schema/docs alignment**:
   - bumped `login_flow_batch` to 90
   - added new Google abandonment event to checklist + roadmap GA4 dictionaries and notes

### Validation status (login batch 90)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login dwell-time telemetry batch (login focus)

1. **Dwell-time helpers + schema expansion** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 91
   - extended `login_schema_fields` with `dwell_seconds` and `dwell_bucket`
   - added login view start timestamp ref plus shared `dwellMeta()` helper (`lt_10s`, `10_29s`, `30_59s`, `ge_60s`)
2. **Outcome/abandonment dwell propagation** (`app/auth/login/page.tsx`):
   - added dwell context to login outcomes (`login_success`, `login_blocked_phone_required`)
   - added dwell context to abandonment events (`login_abandoned_after_otp_sent`, `login_abandoned_after_google_click`)
3. **Docs updates**:
   - documented login dwell-time telemetry in checklist + roadmap notes

### Validation status (login batch 91)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login exit telemetry batch (login focus)

1. **Exit event instrumentation** (`app/auth/login/page.tsx`):
   - added `login_exit_clicked` on the explicit "Continue browsing without signing in" link
   - event includes `exit_target` and derived `exit_stage` (`method_select`, `phone_only`, `otp_sent`, `otp_pending_verify`, `google_pending`)
2. **Schema/context enrichment** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 92
   - extended `login_schema_fields` with `exit_target` and `exit_stage`
   - attached shared dwell metadata (`dwell_seconds`, `dwell_bucket`) and existing auth/method metadata to exit events
3. **Docs updates**:
   - documented login exit telemetry in checklist + roadmap analytics notes

### Validation status (login batch 92)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login failure taxonomy telemetry batch (login focus)

1. **Normalized error taxonomy helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 93
   - extended `login_schema_fields` with `error_code`
   - added `errorCodeFromUnknown()` helper to normalize raw errors (`network_error`, `rate_limited`, `invalid_code`, `popup_closed`, `popup_blocked`, `unknown_error`)
2. **Failure-event enrichment** (`app/auth/login/page.tsx`):
   - added `error_code` to `login_otp_send_failed`, `login_otp_verify_failed`, and `login_google_signin_failed`
   - preserves existing attempt/context dimensions for reason-level failure segmentation
3. **Docs updates**:
   - documented failure taxonomy telemetry in checklist + roadmap notes

### Validation status (login batch 93)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login auth-requirement telemetry batch (login focus)

1. **Auth requirement metadata helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 94
   - extended `login_schema_fields` with `auth_requirement`
   - added `authRequirementMeta()` to normalize requirement context as `phone_required` vs `optional`
2. **Cross-event metadata propagation** (`app/auth/login/page.tsx`):
   - propagated `auth_requirement` across login schema/view, redirect, OTP/Google intent/failure/outcome, abandonment, cancellation, and exit events
   - aligns login funnel analysis with explicit requirement-state segmentation
3. **Docs updates**:
   - documented auth-requirement telemetry in checklist + roadmap notes

### Validation status (login batch 94)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login path taxonomy telemetry batch (login focus)

1. **Path taxonomy helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 95
   - extended `login_schema_fields` with `login_path`
   - added `loginPathMeta()` helper with normalized branches: `standard`, `link_phone`, `phone_gate`
2. **Cross-event path propagation** (`app/auth/login/page.tsx`):
   - propagated `login_path` across login schema/view, redirect/outcome, OTP and Google intent/failure/outcome, abandonment, cancellation, and exit events
   - enables null-free branch segmentation across full login journey telemetry
3. **Docs updates**:
   - documented login path taxonomy telemetry in checklist + roadmap notes

### Validation status (login batch 95)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login payload completeness marker batch (login focus)

1. **Shared metadata completeness marker** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 96
   - extended `login_schema_fields` with `login_context_complete`
   - added `login_context_complete: true` to shared `loginMeta()` payload
2. **Cross-event QA parity** (`app/auth/login/page.tsx`):
   - all login events that spread `loginMeta()` now automatically include completeness marker
   - simplifies QA filtering for fully-shaped login telemetry rows
3. **Docs updates**:
   - documented login payload completeness marker in checklist + roadmap notes

### Validation status (login batch 96)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login resolution-channel telemetry batch (login focus)

1. **Resolution channel taxonomy helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 97
   - extended `login_schema_fields` with `resolution_channel`
   - added `resolutionChannelMeta()` helper with normalized channels (`auto_redirect`, `otp_verified`, `google_success`, `google_blocked`, `otp_abandon`, `google_abandon`, `manual_exit`)
2. **Resolution-event propagation** (`app/auth/login/page.tsx`):
   - added `resolution_channel` to completion events (`login_success`, `login_blocked_phone_required`)
   - added `resolution_channel` to abandonment events (`login_abandoned_after_otp_sent`, `login_abandoned_after_google_click`) and explicit exit event (`login_exit_clicked`)
3. **Docs updates**:
   - documented login resolution-channel telemetry in checklist + roadmap notes

### Validation status (login batch 97)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login event-group taxonomy telemetry batch (login focus)

1. **Event-group taxonomy helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 98
   - extended `login_schema_fields` with `login_event_group`
   - added `eventGroupMeta()` helper with normalized groups: `entry`, `intent`, `failure`, `outcome`, `abandonment`, `navigation`
2. **Cross-event group propagation** (`app/auth/login/page.tsx`):
   - propagated `login_event_group` across all major login events (schema/view, intent, failure, outcome, abandonment, navigation/exit)
   - enables top-level aggregation without event-name branching
3. **Docs updates**:
   - documented login event-group taxonomy in checklist + roadmap notes

### Validation status (login batch 98)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login phase taxonomy telemetry batch (login focus)

1. **Phase taxonomy helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 99
   - extended `login_schema_fields` with `login_phase`
   - added `phaseMeta()` helper with normalized phases: `entry`, `auth`, `verification`, `outcome`, `abandonment`, `exit`
2. **Cross-event phase propagation** (`app/auth/login/page.tsx`):
   - propagated `login_phase` across entry, auth intent/failure, verification intent/failure, outcome, abandonment, and navigation/exit events
   - enables stage-level funnel views without event-name conditionals
3. **Docs updates**:
   - documented login phase taxonomy telemetry in checklist + roadmap notes

### Validation status (login batch 99)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login attempt-depth bucket telemetry batch (login focus)

1. **Attempt-depth bucket helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 100
   - extended `login_schema_fields` with `method_attempt_bucket`
   - added `methodAttemptBucket()` + `attemptBucketMeta()` helpers with normalized buckets (`1`, `2`, `3`, `4_plus`)
2. **Attempt-based event enrichment** (`app/auth/login/page.tsx`):
   - propagated `method_attempt_bucket` across attempt-carrying OTP/Google events (intent, failure, outcome, abandonment, cancellation)
   - preserves raw `method_attempt` while enabling easier high-level retry-depth segmentation
3. **Docs updates**:
   - documented login attempt-depth bucket telemetry in checklist + roadmap notes

### Validation status (login batch 100)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login link-mode parity telemetry batch (login focus)

1. **Shared link-mode helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 101
   - added `linkPhoneMeta()` helper to consistently shape `link_phone_mode`
2. **Cross-event parity propagation** (`app/auth/login/page.tsx`):
   - propagated `link_phone_mode` to previously missing branches (Google intent/failure/outcome, Google abandonment, OTP success/cancel, auto-redirect success, manual exit)
   - closes remaining link-mode context gaps across login outcome/abandonment/navigation events
3. **Docs updates**:
   - documented login link-mode parity telemetry in checklist + roadmap notes

### Validation status (login batch 101)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login return-visit telemetry batch (login focus)

1. **Return-visit session tracker** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 102
   - extended `login_schema_fields` with `return_visit_count`
   - added session-scoped visit counter keyed by login destination + mode
2. **Repeat-visit event coverage** (`app/auth/login/page.tsx`):
   - added `login_return_visit_viewed` for visits after the first session-scoped login page view
   - event includes `return_visit_count` with existing login context metadata for repeat-intent analysis
3. **Docs updates**:
   - added `login_return_visit_viewed` to checklist + roadmap GA4 event dictionaries
   - documented return-visit telemetry notes

### Validation status (login batch 102)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login failure-summary telemetry batch (login focus)

1. **Failure summary state tracking** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 103
   - extended `login_schema_fields` with `failure_count`, `last_failure_code`, and `last_failure_method`
   - added local failure summary state updated by OTP send/verify and Google signin failure branches
2. **Failure summary QA event** (`app/auth/login/page.tsx`):
   - added `login_failure_summary_viewed` emitted after at least one failure while on login page
   - event includes aggregated failure snapshot fields plus existing login context metadata
3. **Docs updates**:
   - added `login_failure_summary_viewed` to checklist + roadmap GA4 event dictionaries
   - documented failure-summary telemetry notes

### Validation status (login batch 103)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login failure-recovery telemetry batch (login focus)

1. **Recovery schema/context fields** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 104
   - extended `login_schema_fields` with `failure_count_before_success` and `recovered_from_failure`
2. **Recovery outcome event** (`app/auth/login/page.tsx`):
   - added `login_failure_recovered` emitted when a success occurs after one or more prior failures in the same login session state
   - covers auto-redirect, OTP verify success, and Google success branches with failure snapshot context
3. **Docs updates**:
   - added `login_failure_recovered` to checklist + roadmap GA4 event dictionaries
   - documented failure-recovery telemetry notes

### Validation status (login batch 104)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login failure-recovery implementation parity batch (login focus)

1. **Recovery event implementation** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 105
   - added `login_failure_recovered` emission on all success resolution branches after prior failures (auto-redirect, OTP success, Google success)
2. **Recovery schema field parity** (`app/auth/login/page.tsx`):
   - extended `login_schema_fields` with `failure_count_before_success` and `recovered_from_failure`
   - recovery event now carries last failure snapshot (`last_failure_code`, `last_failure_method`) plus failure count context
3. **Docs updates**:
   - added implementation parity notes in checklist + roadmap to reflect that documented recovery telemetry is now live in code

### Validation status (login batch 105)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login failure-depth bucket telemetry batch (login focus)

1. **Failure-depth bucket helper** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 106
   - extended `login_schema_fields` with `failure_count_bucket`
   - added `failureCountBucket()` helper with normalized buckets (`1`, `2`, `3`, `4_plus`)
2. **Failure summary/recovery enrichment** (`app/auth/login/page.tsx`):
   - added `failure_count_bucket` to `login_failure_summary_viewed`
   - added `failure_count_bucket` to `login_failure_recovered` across auto-redirect, OTP success, and Google success recovery branches
3. **Docs updates**:
   - documented login failure-depth bucket telemetry in checklist + roadmap notes

### Validation status (login batch 106)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed login recovery-latency telemetry batch (login focus)

1. **Recovery-latency schema fields** (`app/auth/login/page.tsx`):
   - bumped `login_flow_batch` to 107
   - extended `login_schema_fields` with `failure_recovery_seconds` and `failure_recovery_bucket`
2. **Latency tracking helper + propagation** (`app/auth/login/page.tsx`):
   - added first-failure timestamp tracking (`firstFailureAtMs`) and `failureRecoveryMeta()` helper
   - enriched `login_failure_recovered` with recovery latency seconds + bucket (`lt_10s`, `10_29s`, `30_59s`, `ge_60s`) across auto-redirect, OTP success, and Google success recovery branches
3. **Docs updates**:
   - documented login recovery-latency telemetry in checklist + roadmap notes

### Validation status (login batch 107)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile browser friendliness baseline batch (mobile UX focus)

1. **Viewport safe-area support** (`app/layout.tsx`):
   - enabled `viewportFit: "cover"` so safe-area insets are respected more consistently on modern mobile browsers
2. **Mobile form/browser usability improvements** (`app/globals.css`):
   - added mobile-only `.rp-input { font-size: 16px; }` to reduce iOS Safari input-focus zoom behavior
   - added tap-highlight suppression + `overflow-x: hidden` to reduce accidental horizontal bleed and touch flash artifacts
3. **Mobile nav touch-target improvements** (`components/layout/AppShell.tsx`):
   - increased bottom-nav item target size (`min-h-14`, larger text/spacing) for better thumb ergonomics and accessibility

### Validation status (mobile batch 108)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile map filter rail ergonomics batch (mobile UX focus)

1. **Filter action touch targets** (`components/map/SearchFilters.tsx`):
   - increased touch-target size for mobile filter actions (`Clear`, `Filters`) with taller min-height and padding
2. **Horizontal filter rail behavior** (`components/map/SearchFilters.tsx`):
   - added snap scrolling (`snap-x`, `snap-mandatory`, per-chip `snap-start`) for steadier one-thumb horizontal browsing
   - enlarged chip size (`text-sm`, larger padding) to reduce tap misses on small screens
3. **Validation**:
   - verified mobile filter UX changes compile and pass lint checks

### Validation status (mobile batch 109)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile map sheet control ergonomics batch (mobile UX focus)

1. **Map sheet toggle CTA touch-target upgrade** (`components/map/SearchMap.tsx`):
   - enlarged the mobile "Show list" floating CTA (`min-h-11`, larger text/padding)
   - offset CTA using safe-area-aware bottom spacing (`bottom-[max(1rem,env(safe-area-inset-bottom))]`)
2. **Bottom sheet safe-area + handle ergonomics** (`components/map/SearchMap.tsx`):
   - added mobile sheet bottom safe-area padding (`pb-[env(safe-area-inset-bottom)]`)
   - increased drag-handle tap target area (`min-h-8`, wider handle)
3. **Validation**:
   - verified sheet-control ergonomics changes compile and pass lint checks

### Validation status (mobile batch 110)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat keyboard/composer ergonomics batch (mobile UX focus)

1. **Safe-area-aware action spacing** (`app/chat/page.tsx`):
   - added safe-area-aware bottom offset for "Jump to latest" sticky action
   - added safe-area-aware bottom padding for chat composer container
2. **Textarea focus visibility aid** (`app/chat/page.tsx`):
   - added textarea `onFocus` behavior to gently scroll the field into view (`scrollIntoView`) after focus
   - reduces keyboard overlap friction on mobile browsers
3. **Validation**:
   - verified chat mobile ergonomics changes compile and pass lint checks

### Validation status (mobile batch 111)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat header/action density batch (mobile UX focus)

1. **Narrow-screen header resilience** (`app/chat/page.tsx`):
   - updated chat header containers to allow wrapping (`flex-wrap`) so title/badge/actions do not crowd or clip on very narrow mobile widths
   - preserved readable hierarchy while reducing overflow pressure in the top bar
2. **Larger action/filter touch targets** (`app/chat/page.tsx`):
   - increased unread toggle, role chips, and top action controls ("Mark all read", "Browse") to `min-h-9` with larger padding/text sizing
   - converted lightweight text actions to pill-style buttons for stronger mobile hit areas and clearer affordance
3. **Validation**:
   - verified chat header/action mobile updates compile and pass lint checks

### Validation status (mobile batch 112)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat thread-list density batch (mobile UX focus)

1. **Conversation row hit-area upgrade** (`app/chat/page.tsx`):
   - increased per-thread row minimum height (`min-h-[4.5rem]`) so mobile taps are more forgiving during rapid inbox scanning
   - preserves existing active/unread visual state while improving touch ergonomics
2. **Narrow-screen metadata resilience** (`app/chat/page.tsx`):
   - adjusted title/time row layout with stronger `min-w-0`, `flex-1`, and `whitespace-nowrap` usage to prevent title/time collisions
   - refined message preview spacing/line-height so truncation remains stable and readable on small viewport widths
3. **Validation**:
   - verified chat thread-list mobile updates compile and pass lint checks

### Validation status (mobile batch 113)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile active-chat header density batch (mobile UX focus)

1. **Header spacing/layout refinement** (`app/chat/page.tsx`):
   - tuned active-thread header spacing for small screens with tighter default paddings and responsive upshift on larger breakpoints
   - aligned items for narrow layouts while preserving previous desktop/tablet visual balance
2. **Back/title/link ergonomics upgrade** (`app/chat/page.tsx`):
   - upgraded mobile back control to a bordered `min-h-9`/`min-w-9` touch target and added explicit aria label
   - tightened title typography/truncation and converted "View listing" into an inline pill-style control for cleaner narrow-screen wrapping behavior
3. **Validation**:
   - verified active-thread header mobile updates compile and pass lint checks

### Validation status (mobile batch 114)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat composer row density batch (mobile UX focus)

1. **Ultra-narrow composer layout fallback** (`app/chat/page.tsx`):
   - updated composer row container to allow wrapping on small widths while retaining single-row behavior from `sm` and above
   - ensured textarea column can safely shrink (`min-w-0`) without causing horizontal overflow
2. **Send CTA tap-target + alignment update** (`app/chat/page.tsx`):
   - switched send button to full-width fallback on narrow screens with `min-h-10` for easier thumb taps
   - preserves compact `sm`+ layout (`sm:w-auto`) while keeping character counter alignment stable below the textarea
3. **Validation**:
   - verified chat composer row mobile updates compile and pass lint checks

### Validation status (mobile batch 115)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat bubble readability batch (mobile UX focus)

1. **Long-token overflow protection** (`app/chat/page.tsx`):
   - added `break-words` + `[overflow-wrap:anywhere]` to message bubbles so long URLs/unbroken text wrap instead of overflowing horizontally
   - improves resilience for mixed-language or pasted-link messages on narrow devices
2. **Mobile-first bubble sizing tune** (`app/chat/page.tsx`):
   - shifted bubble width to `max-w-[90%]` on small screens with `sm:max-w-[85%]` for larger breakpoints
   - slightly reduced mobile bubble horizontal padding (`px-3.5`, restoring `sm:px-4`) to keep readable line lengths without cramped text
3. **Validation**:
   - verified chat bubble readability updates compile and pass lint checks

### Validation status (mobile batch 116)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat search micro-ergonomics batch (mobile UX focus)

1. **Search field touch-layout tuning** (`app/chat/page.tsx`):
   - increased inbox search input minimum touch height (`min-h-10`) and right padding (`pr-10`) to reserve cleaner space for clear control
   - prevents clear-icon overlap with typed text while preserving existing keyboard-shortcut behavior
2. **Clear control + helper readability upgrade** (`app/chat/page.tsx`):
   - expanded clear action into an inline-flex circular target (`min-h-8` / `min-w-8`) with hover background affordance for easier tapping
   - increased shortcut/status helper copy from `10px` to `11px` with `leading-4` for better legibility on narrow screens
3. **Validation**:
   - verified chat search micro-ergonomics updates compile and pass lint checks

### Validation status (mobile batch 117)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat empty/error state ergonomics batch (mobile UX focus)

1. **Shared EmptyState mobile tap-target improvements** (`components/ui/EmptyState.tsx`):
   - reduced card padding on small screens (`p-6`, `sm:p-10`) for tighter viewport fit in low-content states
   - increased primary action button touch comfort with `min-h-10` and stronger horizontal padding
2. **Chat-specific empty/error readability tuning** (`app/chat/page.tsx`):
   - tightened mobile spacing around unauthenticated/empty-thread wrappers (`py-8`, `p-4`) while preserving larger-screen spacing
   - improved error/empty message resilience with `leading-*` and `[overflow-wrap:anywhere]` on mark-all-read, bootstrap, and no-results copy blocks
3. **Validation**:
   - verified empty/error state mobile updates compile and pass lint checks

### Validation status (mobile batch 118)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat loading-state ergonomics batch (mobile UX focus)

1. **In-page loading viewport tuning** (`app/chat/page.tsx`):
   - increased mobile loading container minimum height (`min-h-[58vh]`) with responsive fallback (`sm:min-h-[50vh]`)
   - added mobile padding and upgraded loading copy to `text-sm` + `leading-6` for clearer narrow-screen readability
2. **Suspense fallback parity improvements** (`app/chat/page.tsx`):
   - aligned top-level chat Suspense fallback to mobile-first centering (`min-h-[50vh]`, `sm:min-h-[40vh]`) and matching text sizing/line-height
   - standardized fallback copy rendering to avoid cramped appearance on short viewports
3. **Validation**:
   - verified chat loading-state mobile updates compile and pass lint checks

### Validation status (mobile batch 119)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat shortcut-helper discoverability batch (mobile UX focus)

1. **Viewport-adaptive shortcut guidance** (`app/chat/page.tsx`):
   - split search helper copy into mobile and desktop variants (`sm:hidden` / `sm:block`)
   - keeps compact high-signal guidance on small screens while preserving full keyboard-help detail on larger viewports
2. **Small-screen clutter reduction** (`app/chat/page.tsx`):
   - replaced dense mobile helper sentence with concise text (`/ search`, `Esc clear`) to improve scanability under the inbox search field
   - retained unchanged helper typography and spacing to stay visually consistent with previous mobile polish batches
3. **Validation**:
   - verified viewport-adaptive shortcut-helper updates compile and pass lint checks

### Validation status (mobile batch 120)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat sticky-inbox-controls batch (mobile UX focus)

1. **Sticky inbox control container** (`app/chat/page.tsx`):
   - wrapped chat sidebar header/actions/filters/search into a single sticky top container (`sticky top-0 z-20`)
   - keeps primary inbox controls visible while the room list scrolls beneath
2. **Scroll-context usability improvement** (`app/chat/page.tsx`):
   - preserved existing borders, spacing, and error/shortcut/status sub-blocks inside the sticky region
   - maintains prior mobile ergonomics work while reducing scroll-back friction for filter/search/action access
3. **Validation**:
   - verified sticky inbox control updates compile and pass lint checks

### Validation status (mobile batch 121)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat sticky-scroll-separation batch (mobile UX focus)

1. **Scroll-aware sticky shadow state** (`app/chat/page.tsx`):
   - added `showInboxStickyShadow` state and `handleRoomListScroll()` to detect sidebar list scroll depth
   - toggles once the list moves (`scrollTop > 4`) so visual elevation appears only when useful
2. **Sticky controls visual feedback** (`app/chat/page.tsx`):
   - applied conditional `transition-shadow` styling to sticky inbox controls
   - uses a subtle shadow only while scrolling to separate fixed controls from moving chat rows without constant visual noise
3. **Validation**:
   - verified sticky scroll-separation updates compile and pass lint checks

### Validation status (mobile batch 122)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat day-divider readability batch (mobile UX focus)

1. **Divider spacing tune** (`app/chat/page.tsx`):
   - increased day-divider vertical spacing (`my-1.5`) to improve separation between message groups during fast scroll
   - keeps timeline chunk boundaries easier to parse on dense mobile threads
2. **Day-chip legibility upgrade** (`app/chat/page.tsx`):
   - enlarged chip text and padding (`text-[11px]`, `px-3`, `py-1`) with stronger weight/contrast (`font-semibold`, `text-[var(--brand-navy)]`)
   - improves quick date-anchor recognition without changing conversation structure
3. **Validation**:
   - verified day-divider readability updates compile and pass lint checks

### Validation status (mobile batch 123)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat timestamp readability batch (mobile UX focus)

1. **Timestamp legibility tune** (`app/chat/page.tsx`):
   - increased per-message timestamp size to `text-[11px]` with `leading-4`
   - adjusted muted contrast slightly (`text-[var(--muted)]/90`) to keep timestamps visible but unobtrusive
2. **Spacing polish for scan flow** (`app/chat/page.tsx`):
   - increased top gap and horizontal padding around timestamps (`mt-1`, `px-1.5`) for cleaner separation from message bubbles
   - improves quick chronology scanning when rapidly scrolling dense chat threads
3. **Validation**:
   - verified timestamp readability updates compile and pass lint checks

### Validation status (mobile batch 124)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat send-state feedback batch (mobile UX focus)

1. **Textarea disabled-state affordance** (`app/chat/page.tsx`):
   - added conditional disabled styling to composer textarea during send (`cursor-not-allowed`, reduced opacity)
   - improves clarity that input is temporarily locked while message commit is in progress
2. **Busy CTA clarity improvements** (`app/chat/page.tsx`):
   - updated in-flight button label from `Sending...` to `Sending message...` for clearer action context
   - added busy-interaction guard styling (`pointer-events-none`) and `aria-live="polite"` for improved assistive announcement behavior
3. **Validation**:
   - verified send-state feedback updates compile and pass lint checks

### Validation status (mobile batch 125)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat unread-state emphasis batch (mobile UX focus)

1. **Unread row prominence tuning** (`app/chat/page.tsx`):
   - added subtle unread-only row highlighting (light brand tint + soft border accent) for non-active threads
   - preserves active-thread style priority while making pending threads easier to spot in long lists
2. **Unread metadata contrast upgrade** (`app/chat/page.tsx`):
   - increased unread indicator dot size and strengthened unread timestamp/message preview emphasis (weight + color)
   - improves quick “what needs attention now” scanning on narrow mobile inbox views
3. **Validation**:
   - verified unread-state emphasis updates compile and pass lint checks

### Validation status (mobile batch 126)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat keyboard-navigation visibility batch (mobile UX focus)

1. **Focus-visible affordance for room rows** (`app/chat/page.tsx`):
   - added explicit `focus-visible` ring treatment (`ring-2`, brand color, offset) to conversation row buttons
   - ensures keyboard users can quickly identify the currently focused room target while navigating with arrows/tab
2. **Parity with existing visual language** (`app/chat/page.tsx`):
   - matched focus ring color/offset to existing brand/background palette for consistent emphasis
   - leaves unread/active row semantics intact while adding an independent focus channel
3. **Validation**:
   - verified keyboard-navigation visibility updates compile and pass lint checks

### Validation status (mobile batch 127)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat hover/focus parity polish batch (mobile UX focus)

1. **Unified row interaction feedback** (`app/chat/page.tsx`):
   - added `focus-visible:bg-[var(--surface)]` on conversation rows so keyboard focus receives comparable background emphasis to hover
   - keeps active/unread semantic styling intact while improving non-pointer interaction clarity
2. **Transition consistency tuning** (`app/chat/page.tsx`):
   - refined row transitions to `transition-colors duration-150 ease-out` for smoother and more consistent hover/focus visual response
   - reduces abrupt state changes across pointer and keyboard interaction modes
3. **Validation**:
   - verified hover/focus parity updates compile and pass lint checks

### Validation status (mobile batch 128)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat short-height density batch (mobile UX focus)

1. **Low-height row compaction** (`app/chat/page.tsx`):
   - added viewport-height-aware row adjustments for short screens (`@media(max-height:740px)`) to reduce row min-height and vertical padding
   - preserves baseline roomy layout on standard/taller screens
2. **Avatar scale parity in compact mode** (`app/chat/page.tsx`):
   - reduced room avatar size under short-height conditions (`h-10/w-10`) to match tighter row rhythm
   - improves number of visible threads without introducing cramped text
3. **Validation**:
   - verified short-height density updates compile and pass lint checks

### Validation status (mobile batch 129)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile chat short-height control-compression batch (mobile UX focus)

1. **Sticky header stack compaction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` spacing reductions for sticky inbox header, filter row, and search panel containers
   - keeps control block functional while reducing vertical overhead on short-height devices
2. **Low-height micro-spacing refinements** (`app/chat/page.tsx`):
   - reduced mark-all-read error banner vertical padding and helper/status caption top margins under short-height conditions
   - preserves legibility while freeing additional room for visible conversation rows
3. **Validation**:
   - verified short-height control-compression updates compile and pass lint checks

### Validation status (mobile batch 130)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile active-thread short-height compression batch (mobile UX focus)

1. **Active header low-height compaction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` vertical padding reduction for the active-thread header container
   - preserves existing structure while reducing non-message overhead on short-height devices
2. **Composer stack low-height spacing tune** (`app/chat/page.tsx`):
   - tightened composer container, error banner, row gap, and counter spacing for low-height screens
   - keeps send/input ergonomics intact while freeing additional vertical space for chat history
3. **Validation**:
   - verified active-thread short-height compression updates compile and pass lint checks

### Validation status (mobile batch 131)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile active-thread short-height message-spacing batch (mobile UX focus)

1. **Message list low-height density tune** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` compaction for active-thread message list spacing (`space-y`) and container padding
   - keeps default spacing on normal/tall viewports while improving visible history on short-height screens
2. **Bubble/timestamp rhythm refinement** (`app/chat/page.tsx`):
   - reduced low-height bubble vertical padding and timestamp top margin for tighter but readable message cadence
   - preserves legibility and chronology cues while reducing vertical overhead
3. **Validation**:
   - verified active-thread short-height message-spacing updates compile and pass lint checks

### Validation status (mobile batch 132)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile short-height jump-to-latest ergonomics batch (mobile UX focus)

1. **Low-height CTA footprint reduction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` compaction for sticky jump CTA padding (`px`/`py`) to reduce visual footprint
   - keeps the control tappable while minimizing overlay obstruction on short-height screens
2. **Low-height CTA offset tuning** (`app/chat/page.tsx`):
   - reduced low-height bottom offset for the jump CTA (`bottom-[max(0.5rem,env(safe-area-inset-bottom))]`)
   - aligns with earlier short-height spacing passes so more messages remain visible near the composer area
3. **Validation**:
   - verified short-height jump CTA ergonomics updates compile and pass lint checks

### Validation status (mobile batch 133)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile short-height composer send-button density batch (mobile UX focus)

1. **Low-height send CTA compaction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` send-button compaction (`min-h-9`, reduced `px`, `text-xs`)
   - preserves full-width mobile behavior while reducing vertical/visual footprint in constrained-height layouts
2. **Composer balance in constrained height** (`app/chat/page.tsx`):
   - keeps send affordance clear and tappable while aligning with recent low-height message/composer spacing refinements
   - improves message viewport retention during active compose sessions on short screens
3. **Validation**:
   - verified low-height send-button density updates compile and pass lint checks

### Validation status (mobile batch 134)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile short-height filter/search control-density batch (mobile UX focus)

1. **Low-height action/chip compaction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` compaction for top action pills and role filter chips (`min-h-8`, reduced `px`/`py`)
   - preserves control clarity while lowering sticky control-stack height on short screens
2. **Low-height search control compaction** (`app/chat/page.tsx`):
   - tightened search input and clear button dimensions under low-height conditions (`min-h-9`, smaller clear control)
   - retains usability and keyboard affordance while reducing vertical overhead
3. **Validation**:
   - verified short-height filter/search control-density updates compile and pass lint checks

### Validation status (mobile batch 135)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile short-height helper-typography tuning batch (mobile UX focus)

1. **Low-height helper caption compaction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` typography compaction for shortcut and count helper captions (`text-[10px]`, tighter leading)
   - keeps helper content readable while reducing sticky-stack vertical overhead in short-height viewports
2. **Sticky-stack rhythm consistency** (`app/chat/page.tsx`):
   - aligned low-height helper text rhythm with prior spacing/padding compression passes for header/filter/search controls
   - avoids abrupt size jumps while preserving glanceability
3. **Validation**:
   - verified low-height helper-typography updates compile and pass lint checks

### Validation status (mobile batch 136)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile short-height unread-badge micro-scaling batch (mobile UX focus)

1. **Unread badge low-height compaction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` unread counter badge compaction (`px`, `py`, and font-size)
   - keeps unread counts prominent while reducing header footprint in short-height inbox layouts
2. **Header density parity refinement** (`app/chat/page.tsx`):
   - aligns unread badge sizing with prior low-height pill/chip/helper compaction so the sticky stack remains visually balanced
   - avoids over-dominant badge weight in compressed viewport conditions
3. **Validation**:
   - verified unread-badge micro-scaling updates compile and pass lint checks

### Validation status (mobile batch 137)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile short-height day-chip polish batch (mobile UX focus)

1. **Low-height day-divider compaction** (`app/chat/page.tsx`):
   - added `@media(max-height:740px)` compaction for day-divider spacing (`my`) and chip size (`px`/`py`, font-size)
   - keeps chronology anchors clear while reducing vertical consumption in dense short-height threads
2. **Timeline rhythm consistency** (`app/chat/page.tsx`):
   - aligned low-height day-chip sizing with recent short-height bubble/timestamp/list-spacing refinements
   - improves active-thread visual consistency without changing message ordering semantics
3. **Validation**:
   - verified short-height day-chip polish updates compile and pass lint checks

### Validation status (mobile batch 138)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed mobile short-height consistency sweep batch (mobile UX focus)

1. **Shared short-viewport variant** (`app/globals.css`):
   - added Tailwind `@custom-variant short (@media (max-height: 740px))` for centralized low-height breakpoint control
   - documents intent for landscape/short mobile viewport compaction behavior
2. **Chat compaction class migration** (`app/chat/page.tsx`):
   - replaced 58 inline `[@media(max-height:740px)]:*` utilities with `short:*` equivalents across inbox and active-thread surfaces
   - preserves existing compaction behavior while improving maintainability and readability
3. **Validation**:
   - verified short-variant consolidation compiles and passes lint checks

### Validation status (mobile batch 139)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.

### Completed post activate full phase-coverage telemetry batch (post listing focus)

1. **Phase coverage completion** (`app/post/activate/page.tsx`):
   - added `activation_phase` to `post_activate_plans_retry_clicked`
   - closes the remaining phase-tag gap in activation retry-intent telemetry
2. **Event taxonomy consistency** (`app/post/activate/page.tsx`):
   - activation events now have consistent phase tagging across entry, availability, selection, checkout, wait, outcome, and exit branches
3. **Docs updates**:
   - documented final phase-coverage refinement in checklist + roadmap activation telemetry notes

### Validation status (post listing batch 70)

- Production build (`npm run build`) passed.
- No unresolved linter errors in touched files.
