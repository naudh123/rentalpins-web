"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  filterSavedSearches,
  SAVED_SEARCH_FILTER_INPUT_ID,
} from "@/lib/saved-search-filter";
import { trackEvent } from "@/lib/ga4";
import type { SavedSearch } from "@/lib/types/saved-search";

type ClearMethod = "button" | "escape_shortcut" | "empty_state_cta";

/** Filter state, visible list, and / + Esc keyboard shortcuts for saved searches. */
export function useSavedSearchFilter(searches: SavedSearch[]) {
  const [queryText, setQueryText] = useState("");
  const [shortcutHintVisible, setShortcutHintVisible] = useState(true);
  const queryTextRef = useRef(queryText);
  queryTextRef.current = queryText;
  const keyboardEventsTrackedRef = useRef<Set<string>>(new Set());

  const clearFilter = useCallback((method: ClearMethod) => {
    setQueryText((prev) => {
      if (prev.trim().length > 0) {
        trackEvent("saved_search_filter_cleared", { method });
      }
      return "";
    });
  }, []);

  const trackShortcut = useCallback(
    (key: "/" | "escape", action: "focus_filter" | "clear_filter") => {
      const id = `${key}_${action}`;
      if (keyboardEventsTrackedRef.current.has(id)) return;
      keyboardEventsTrackedRef.current.add(id);
      trackEvent("saved_search_keyboard_shortcut_used", { key, action });
    },
    []
  );

  useEffect(() => {
    function isTypingTarget(target: HTMLElement | null): boolean {
      if (!target) return false;
      return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      );
    }

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (document.querySelector("[role='dialog']")) return;
      if (e.key === "/" && !isTypingTarget(target)) {
        const input = document.getElementById(
          SAVED_SEARCH_FILTER_INPUT_ID
        ) as HTMLInputElement | null;
        if (!input) return;
        e.preventDefault();
        trackShortcut("/", "focus_filter");
        input.focus();
        input.select();
        setShortcutHintVisible(false);
        return;
      }
      if (e.key === "Escape" && queryTextRef.current.trim()) {
        e.preventDefault();
        clearFilter("escape_shortcut");
        trackShortcut("escape", "clear_filter");
        setShortcutHintVisible(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearFilter, trackShortcut]);

  const visibleSearches = useMemo(
    () => filterSavedSearches(searches, queryText),
    [searches, queryText]
  );

  return {
    filterInputId: SAVED_SEARCH_FILTER_INPUT_ID,
    queryText,
    setQueryText,
    visibleSearches,
    shortcutHintVisible,
    clearFilter,
  };
}
