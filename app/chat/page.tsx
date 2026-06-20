"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import { getClientDb } from "@/lib/firebase-client";
import {
  ensureChatRoom,
  fetchListingForChat,
  mapChatError,
  parseChatRoom,
  tryIncrementInquiry,
  type ChatRoomMeta,
} from "@/lib/chat";
import { trackEvent, trackLeadSubmitted } from "@/lib/ga4";

const CHAT_DRAFT_PREFIX = "rp_chat_draft_";
const CHAT_MAX_CHARS = 1200;
const CHAT_SEARCH_INPUT_ID = "chat-inbox-search-input";
const SCROLL_STICK_THRESHOLD_PX = 80;

function formatMessageTime(ms: number): string {
  if (!ms) return "";
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function dayKey(ms: number): string {
  if (!ms) return "";
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function formatRelativeTime(ms: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(ms).toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatDayLabel(ms: number): string {
  if (!ms) return "";
  const d = new Date(ms);
  const now = new Date();
  const todayKey = dayKey(now.getTime());
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = dayKey(yesterday.getTime());
  const key = dayKey(ms);
  if (key === todayKey) return "Today";
  if (key === yesterdayKey) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingParam = searchParams.get("listing");
  const roomParam = searchParams.get("room");
  const roleParamRaw = searchParams.get("role");
  const roleParam =
    roleParamRaw === "buying" || roleParamRaw === "selling" ? roleParamRaw : "all";
  const unreadParam = searchParams.get("unread") === "1";
  const queryParam = searchParams.get("q") || "";

  const { user, loading } = useAuth();
  const [rooms, setRooms] = useState<ChatRoomMeta[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(roomParam);
  const [messages, setMessages] = useState<
    { id: string; text: string; senderUid: string; createdAtMs: number }[]
  >([]);
  const [text, setText] = useState("");
  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapError, setBootstrapError] = useState("");
  const [sendError, setSendError] = useState("");
  const [sending, setSending] = useState(false);
  const [roleFilter, setRoleFilter] = useState<"all" | "buying" | "selling">(roleParam);
  const [unreadOnly, setUnreadOnly] = useState(unreadParam);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [markAllReadError, setMarkAllReadError] = useState("");
  const [queryText, setQueryText] = useState(queryParam);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [showInboxStickyShadow, setShowInboxStickyShadow] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const roomListRef = useRef<HTMLUListElement>(null);
  const bootstrappedListingRef = useRef<string | null>(null);
  const querySyncDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markAllReadErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyboardEventsTrackedRef = useRef<Set<string>>(new Set());
  const stickToBottomRef = useRef(true);
  const activeRoomIdRef = useRef<string | null>(roomParam);
  activeRoomIdRef.current = activeRoomId;

  const activeRoom = useMemo(
    () => rooms.find((r) => r.id === activeRoomId) ?? null,
    [rooms, activeRoomId]
  );
  const visibleRooms = useMemo(() => {
    if (!user) return rooms;
    let base = rooms;
    if (listingParam) {
      base = base.filter((r) => r.listingId === listingParam);
    }
    if (roleFilter !== "all") {
      base = base.filter((r) =>
        roleFilter === "buying" ? r.buyerUid === user.uid : r.sellerUid === user.uid
      );
    }
    if (unreadOnly) {
      base = base.filter((r) =>
        user.uid === r.buyerUid
          ? r.hasUnreadBuyer
          : user.uid === r.sellerUid
            ? r.hasUnreadSeller
            : false
      );
    }
    const q = queryText.trim().toLowerCase();
    if (!q) return base;
    return base.filter((r) => {
      const hay = `${r.listingTitle} ${r.lastMessage || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rooms, roleFilter, unreadOnly, user, queryText, listingParam]);
  const unreadRooms = useMemo(() => {
    if (!user) return [];
    return rooms.filter((r) =>
      user.uid === r.buyerUid
        ? r.hasUnreadBuyer
        : user.uid === r.sellerUid
          ? r.hasUnreadSeller
          : false
    );
  }, [rooms, user]);
  const roleCounts = useMemo(() => {
    if (!user) return { all: rooms.length, buying: 0, selling: 0 };
    const buying = rooms.filter((r) => r.buyerUid === user.uid).length;
    const selling = rooms.filter((r) => r.sellerUid === user.uid).length;
    return { all: rooms.length, buying, selling };
  }, [rooms, user]);
  const trimmedText = text.trim();

  const draftKey = activeRoomId ? `${CHAT_DRAFT_PREFIX}${activeRoomId}` : null;

  const mergeRooms = useCallback((buyerRooms: ChatRoomMeta[], sellerRooms: ChatRoomMeta[]) => {
    const map = new Map<string, ChatRoomMeta>();
    for (const r of [...buyerRooms, ...sellerRooms]) map.set(r.id, r);
    setRooms(
      [...map.values()].sort((a, b) => b.lastMessageAtMs - a.lastMessageAtMs)
    );
  }, []);

  const syncChatUrl = useCallback(
    (next: {
      roomId?: string | null;
      role?: typeof roleFilter;
      unread?: boolean;
      q?: string;
      listing?: string | null;
    }) => {
      const params = new URLSearchParams();
      const roomId = next.roomId !== undefined ? next.roomId : activeRoomIdRef.current;
      const role = next.role ?? roleFilter;
      const unread = next.unread ?? unreadOnly;
      const q = next.q !== undefined ? next.q : queryText;
      const listing = next.listing !== undefined ? next.listing : listingParam;

      if (roomId) params.set("room", roomId);
      else if (listing) params.set("listing", listing);
      if (role !== "all") params.set("role", role);
      if (unread) params.set("unread", "1");
      if (q.trim()) params.set("q", q.trim());
      const qs = params.toString();
      router.replace(appPath(qs ? `/chat?${qs}` : "/chat"), { scroll: false });
    },
    [router, roleFilter, unreadOnly, queryText, listingParam]
  );

  const openRoom = useCallback(
    (roomId: string) => {
      if (activeRoomIdRef.current === roomId) return;
      setActiveRoomId(roomId);
      activeRoomIdRef.current = roomId;
      setSendError("");
      stickToBottomRef.current = true;
      setShowJumpToLatest(false);
      syncChatUrl({ roomId });
    },
    [syncChatUrl]
  );

  const closeActiveRoom = useCallback(() => {
    setActiveRoomId(null);
    activeRoomIdRef.current = null;
    syncChatUrl({ roomId: null });
  }, [syncChatUrl]);

  const clearInboxSearch = useCallback((method: "clear_action" | "escape_shortcut" = "clear_action") => {
    const hadQuery = queryText.trim().length > 0;
    if (!hadQuery) return;
    setQueryText("");
    if (querySyncDebounceRef.current) clearTimeout(querySyncDebounceRef.current);
    trackEvent("chat_search_cleared", { method });
    syncChatUrl({ q: "" });
  }, [queryText, syncChatUrl]);

  useEffect(() => {
    if (!user) return;
    const db = getClientDb();
    const buyerQ = query(collection(db, "chat_rooms"), where("buyerUid", "==", user.uid));
    const sellerQ = query(collection(db, "chat_rooms"), where("sellerUid", "==", user.uid));
    let buyerRooms: ChatRoomMeta[] = [];
    let sellerRooms: ChatRoomMeta[] = [];
    const unsubBuyer = onSnapshot(buyerQ, (snap) => {
      buyerRooms = snap.docs.map((d) => parseChatRoom(d.id, d.data()));
      mergeRooms(buyerRooms, sellerRooms);
    });
    const unsubSeller = onSnapshot(sellerQ, (snap) => {
      sellerRooms = snap.docs.map((d) => parseChatRoom(d.id, d.data()));
      mergeRooms(buyerRooms, sellerRooms);
    });
    return () => {
      unsubBuyer();
      unsubSeller();
    };
  }, [user, mergeRooms]);

  useEffect(() => {
    setActiveRoomId(roomParam || null);
    setRoleFilter(roleParam);
    setUnreadOnly(unreadParam);
    setQueryText(queryParam);
  }, [roomParam, roleParam, unreadParam, queryParam]);

  useEffect(() => {
    return () => {
      if (querySyncDebounceRef.current) clearTimeout(querySyncDebounceRef.current);
      if (markAllReadErrorTimerRef.current) clearTimeout(markAllReadErrorTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!user || !listingParam || roomParam) return;
    const listingId = listingParam;
    if (bootstrappedListingRef.current === listingId) return;

    let cancelled = false;
    async function bootstrap() {
      setBootstrapping(true);
      setBootstrapError("");
      try {
        const listing = await fetchListingForChat(listingId);
        if (!listing) {
          setBootstrapError("Listing not found or not active.");
          return;
        }
        if (listing.ownerUid === user!.uid) {
          setBootstrapError("You cannot message yourself on your own listing.");
          return;
        }
        const roomId = await ensureChatRoom({
          listingId: listing.id,
          sellerUid: listing.ownerUid,
          buyerUid: user!.uid,
          listingTitle: listing.title,
          listingImage: listing.imageUrl,
        });
        await tryIncrementInquiry(listing.id);
        if (cancelled) return;
        bootstrappedListingRef.current = listingId;
        openRoom(roomId);
      } catch (e) {
        if (!cancelled) {
          setBootstrapError(e instanceof Error ? e.message : "Could not open chat");
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [user, listingParam, roomParam, openRoom]);

  useEffect(() => {
    if (!activeRoomId || !user) return;
    const db = getClientDb();
    const roomRef = doc(db, "chat_rooms", activeRoomId);
    const isSeller = activeRoom?.sellerUid === user.uid;
    setDoc(
      roomRef,
      {
        [isSeller ? "hasUnreadSeller" : "hasUnreadBuyer"]: false,
        [isSeller ? "sellerLastReadAt" : "buyerLastReadAt"]: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {});

    const q = query(
      collection(db, "chat_rooms", activeRoomId, "messages"),
      orderBy("createdAtMs", "asc")
    );
    return onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: (data.text as string) || "",
            senderUid: (data.senderUid as string) || "",
            createdAtMs: (data.createdAtMs as number) || 0,
          };
        })
      );
    });
  }, [activeRoomId, user, activeRoom?.sellerUid]);

  useEffect(() => {
    if (!stickToBottomRef.current) {
      setShowJumpToLatest(true);
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowJumpToLatest(false);
  }, [messages]);

  useEffect(() => {
    if (!activeRoomId || !roomListRef.current) return;
    const el = roomListRef.current.querySelector(`[data-room-id="${activeRoomId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeRoomId, visibleRooms.length]);

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

    function trackShortcutOnce(key: string, action: string) {
      const id = `${key}_${action}`;
      if (keyboardEventsTrackedRef.current.has(id)) return;
      keyboardEventsTrackedRef.current.add(id);
      trackEvent("chat_keyboard_shortcut_used", { key, action });
    }

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (document.querySelector("[role='dialog']")) return;

      if (e.key === "/" && !isTypingTarget(target)) {
        const input = document.getElementById(CHAT_SEARCH_INPUT_ID) as HTMLInputElement | null;
        if (!input || input.disabled) return;
        e.preventDefault();
        trackShortcutOnce("/", "focus_search");
        input.focus();
        input.select();
        return;
      }

      if (isTypingTarget(target)) return;

      if (e.key === "Escape") {
        if (activeRoomIdRef.current && window.matchMedia("(max-width: 767px)").matches) {
          e.preventDefault();
          trackShortcutOnce("escape", "close_room");
          closeActiveRoom();
          return;
        }
        if (queryText.trim()) {
          e.preventDefault();
          trackShortcutOnce("escape", "clear_search");
          clearInboxSearch("escape_shortcut");
        }
        return;
      }

      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (!visibleRooms.length) return;

      e.preventDefault();
      trackShortcutOnce("arrows", "navigate_rooms");
      const idx = activeRoomIdRef.current
        ? visibleRooms.findIndex((r) => r.id === activeRoomIdRef.current)
        : -1;
      const nextIdx =
        e.key === "ArrowDown"
          ? idx < 0
            ? 0
            : Math.min(idx + 1, visibleRooms.length - 1)
          : idx < 0
            ? 0
            : Math.max(idx - 1, 0);
      const next = visibleRooms[nextIdx];
      if (next && next.id !== activeRoomIdRef.current) openRoom(next.id);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearInboxSearch, closeActiveRoom, openRoom, queryText, visibleRooms]);

  // Restore saved draft when switching/opening rooms.
  useEffect(() => {
    if (!draftKey || typeof window === "undefined") return;
    const saved = localStorage.getItem(draftKey) || "";
    setText(saved);
  }, [draftKey]);

  // Persist draft text per room.
  useEffect(() => {
    if (!draftKey || typeof window === "undefined") return;
    if (text.trim()) {
      localStorage.setItem(draftKey, text);
    } else {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey, text]);

  useEffect(() => {
    if (!sendError) return;
    if (!text.trim()) return;
    setSendError("");
  }, [sendError, text]);

  useEffect(() => {
    if (!markAllReadError) return;
    if (!unreadRooms.length || !unreadOnly) {
      setMarkAllReadError("");
    }
  }, [markAllReadError, unreadOnly, unreadRooms.length]);

  useEffect(() => {
    if (markAllReadErrorTimerRef.current) {
      clearTimeout(markAllReadErrorTimerRef.current);
      markAllReadErrorTimerRef.current = null;
    }
    if (!markAllReadError) return;
    markAllReadErrorTimerRef.current = setTimeout(() => {
      setMarkAllReadError("");
      markAllReadErrorTimerRef.current = null;
    }, 4500);
  }, [markAllReadError]);

  async function sendMessage() {
    const trimmed = text.trim();
    if (!user || !activeRoomId || !activeRoom || !trimmed || sending) return;
    if (trimmed.length > CHAT_MAX_CHARS) {
      setSendError(`Message is too long (max ${CHAT_MAX_CHARS} characters).`);
      return;
    }

    const db = getClientDb();
    const now = Date.now();
    const isSeller = user.uid === activeRoom.sellerUid;
    const isFirstMessage = messages.length === 0;
    const msgRef = doc(collection(db, "chat_rooms", activeRoomId, "messages"));
    const batch = writeBatch(db);
    batch.set(msgRef, {
      id: msgRef.id,
      roomId: activeRoomId,
      senderUid: user.uid,
      text: trimmed,
      createdAt: serverTimestamp(),
      createdAtMs: now,
    });
    batch.set(
      doc(db, "chat_rooms", activeRoomId),
      {
        listingId: activeRoom.listingId,
        sellerUid: activeRoom.sellerUid,
        buyerUid: activeRoom.buyerUid,
        listingTitle: activeRoom.listingTitle,
        listingImage: activeRoom.listingImage,
        lastMessage: trimmed,
        lastMessageAt: serverTimestamp(),
        lastMessageAtMs: now,
        lastSenderUid: user.uid,
        hasUnreadSeller: !isSeller,
        hasUnreadBuyer: isSeller,
      },
      { merge: true }
    );

    setSending(true);
    setSendError("");
    try {
      await batch.commit();
      trackEvent("chat_message_sent", {
        room_id: activeRoomId,
        listing_id: activeRoom.listingId,
        first_message: isFirstMessage,
      });
      setText("");
      if (draftKey && typeof window !== "undefined") {
        localStorage.removeItem(draftKey);
      }
      if (isFirstMessage) {
        trackLeadSubmitted(activeRoom.listingId, "chat");
      }
    } catch (e) {
      setSendError(mapChatError(e));
      trackEvent("chat_message_send_failed", {
        room_id: activeRoomId,
        listing_id: activeRoom.listingId,
      });
    } finally {
      setSending(false);
    }
  }

  function handleMessagesScroll() {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < SCROLL_STICK_THRESHOLD_PX;
    stickToBottomRef.current = nearBottom;
    setShowJumpToLatest(!nearBottom);
  }

  function handleRoomListScroll() {
    const el = roomListRef.current;
    if (!el) return;
    setShowInboxStickyShadow(el.scrollTop > 4);
  }

  function jumpToLatest() {
    stickToBottomRef.current = true;
    setShowJumpToLatest(false);
    trackEvent("chat_jump_to_latest_clicked");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function markAllRead() {
    if (!user || !unreadRooms.length || markingAllRead) return;
    const db = getClientDb();
    const batch = writeBatch(db);
    for (const room of unreadRooms) {
      const isSeller = room.sellerUid === user.uid;
      batch.set(
        doc(db, "chat_rooms", room.id),
        {
          [isSeller ? "hasUnreadSeller" : "hasUnreadBuyer"]: false,
          [isSeller ? "sellerLastReadAt" : "buyerLastReadAt"]: serverTimestamp(),
        },
        { merge: true }
      );
    }
    setMarkingAllRead(true);
    setMarkAllReadError("");
    try {
      await batch.commit();
      trackEvent("chat_mark_all_read", { room_count: unreadRooms.length });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not mark all chats as read right now.";
      setMarkAllReadError(message);
      trackEvent("chat_mark_all_read_failed", {
        room_count: unreadRooms.length,
        reason:
          err instanceof Error && err.message.trim()
            ? err.message.slice(0, 120)
            : "unknown",
      });
    } finally {
      setMarkingAllRead(false);
    }
  }

  if (loading || bootstrapping) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center px-4 py-8 sm:min-h-[50vh]">
        <p className="text-sm leading-6 text-[var(--muted)]">Loading messages...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 py-8 sm:py-12">
        <EmptyState
          icon="💬"
          title="Sign in to chat"
          description="Message listing owners after you sign in with phone or Google."
          actionHref={appPath("/auth/login?next=/chat")}
          actionLabel="Sign in"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem-4.25rem)] max-w-5xl flex-col overflow-hidden md:h-[calc(100dvh-3.5rem)] md:flex-row md:pb-0">
      <aside
        className={`flex flex-col border-b border-[var(--border)] bg-[var(--bg-elevated)] md:max-h-none md:w-[320px] md:shrink-0 md:border-b-0 md:border-r ${
          activeRoomId ? "hidden md:flex" : "max-h-[100%] flex-1 md:max-h-none"
        }`}
      >
        <div
          className={`sticky top-0 z-20 bg-[var(--bg-elevated)] transition-shadow ${
            showInboxStickyShadow ? "shadow-[0_4px_12px_rgba(15,23,42,0.08)]" : "shadow-none"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3 short:py-2">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="font-serif text-lg text-[var(--brand-navy)]">Messages</h1>
              {unreadRooms.length > 0 && (
                <span
                  className="rounded-full bg-[var(--brand-orange)] px-2.5 py-1 text-xs font-semibold text-white short:px-2 short:py-0.5 short:text-[11px]"
                  aria-label={`${unreadRooms.length} unread conversations`}
                >
                  {unreadRooms.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {user && (
                <button
                  type="button"
                  className={`min-h-9 rounded-full border px-3 py-1.5 text-xs font-semibold short:min-h-8 short:px-2.5 short:py-1 ${
                    unreadOnly
                      ? "border-[var(--brand-orange)] text-[var(--brand-orange)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                  }`}
                  aria-pressed={unreadOnly}
                  onClick={() => {
                    const nextUnread = !unreadOnly;
                    if (nextUnread === unreadOnly) return;
                    setUnreadOnly(nextUnread);
                    trackEvent("chat_filter_changed", {
                      filter_name: "unread_only",
                      filter_value: nextUnread ? "true" : "false",
                    });
                    syncChatUrl({ unread: nextUnread });
                  }}
                >
                  {unreadOnly ? "All chats" : "Unread only"}
                </button>
              )}
              {user && unreadRooms.length > 1 && (
                <button
                  type="button"
                  className="min-h-9 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-orange)] hover:bg-[var(--surface)] disabled:opacity-60 short:min-h-8 short:px-2.5 short:py-1"
                  disabled={markingAllRead}
                  onClick={() => void markAllRead()}
                >
                  {markingAllRead ? "Marking..." : "Mark all read"}
                </button>
              )}
              <Link
                href={appPath("/search")}
                className="min-h-9 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-orange)] hover:bg-[var(--surface)] short:min-h-8 short:px-2.5 short:py-1"
              >
                Browse
              </Link>
            </div>
          </div>
          {markAllReadError && (
            <p
              className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs leading-5 text-red-800 [overflow-wrap:anywhere] short:py-1.5"
              role="alert"
            >
              {markAllReadError}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--border)] px-4 py-2 short:py-1.5">
            {(
              [
                { id: "all", label: "All", count: roleCounts.all },
                { id: "buying", label: "Buying", count: roleCounts.buying },
                { id: "selling", label: "Selling", count: roleCounts.selling },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (roleFilter === item.id) return;
                  setRoleFilter(item.id);
                  trackEvent("chat_filter_changed", {
                    filter_name: "role",
                    filter_value: item.id,
                  });
                  syncChatUrl({ role: item.id });
                }}
                className={`min-h-9 rounded-full px-3 py-1.5 text-xs font-semibold short:min-h-8 short:px-2.5 short:py-1 ${
                  roleFilter === item.id
                    ? "bg-[var(--brand-orange)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--bg-elevated)]"
                }`}
                aria-pressed={roleFilter === item.id}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>
          <div className="border-b border-[var(--border)] px-4 py-2.5 short:py-2">
            <div className="relative">
              <input
                id={CHAT_SEARCH_INPUT_ID}
                value={queryText}
                onChange={(e) => {
                  const nextQ = e.target.value;
                  setQueryText(nextQ);
                  if (querySyncDebounceRef.current) clearTimeout(querySyncDebounceRef.current);
                  querySyncDebounceRef.current = setTimeout(() => {
                    syncChatUrl({ q: nextQ });
                  }, 250);
                }}
                placeholder="Search chats..."
                className="rp-input min-h-10 !py-2 pr-10 text-sm short:min-h-9 short:pr-9"
                aria-label="Search conversations"
                aria-keyshortcuts="/,Escape"
                title="Shortcuts: / focus search, Esc clear search"
              />
              {queryText.trim() && (
                <button
                  type="button"
                  aria-label="Clear chat search"
                  className="absolute right-1.5 top-1/2 inline-flex min-h-8 min-w-8 -translate-y-1/2 items-center justify-center rounded-full text-base text-[var(--muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)] short:min-h-7 short:min-w-7 short:text-sm"
                  onClick={() => clearInboxSearch("clear_action")}
                >
                  ×
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] leading-4 text-[var(--muted)] short:mt-0.5 short:text-[10px] short:leading-3.5 sm:hidden">
              Shortcuts: / search, Esc clear.
            </p>
            <p className="mt-1 hidden text-[11px] leading-4 text-[var(--muted)] short:mt-0.5 short:text-[10px] short:leading-3.5 sm:block">
              Shortcuts: / search, Arrow keys switch chats, Esc clear search.
            </p>
            <p className="mt-1 text-[11px] leading-4 text-[var(--muted)] short:mt-0.5 short:text-[10px] short:leading-3.5" aria-live="polite">
              Showing {visibleRooms.length} of {rooms.length} chats
            </p>
          </div>
        </div>
        <ul ref={roomListRef} onScroll={handleRoomListScroll} className="flex-1 overflow-y-auto">
          {visibleRooms.map((r) => {
            const active = activeRoomId === r.id;
            const unread =
              user.uid === r.buyerUid
                ? r.hasUnreadBuyer
                : user.uid === r.sellerUid
                  ? r.hasUnreadSeller
                  : false;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  data-room-id={r.id}
                  onClick={() => openRoom(r.id)}
                  className={`flex min-h-[4.5rem] w-full gap-3 border-l-2 px-4 py-3 text-left text-sm transition-colors duration-150 ease-out short:min-h-[4rem] short:py-2.5 focus-visible:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)] ${
                    active
                      ? "border-[var(--brand-orange)] bg-[var(--surface)]"
                      : unread
                        ? "border-[var(--brand-orange)]/40 bg-[var(--brand-orange)]/5 hover:bg-[var(--brand-orange)]/10"
                        : "border-transparent hover:bg-[var(--surface)]"
                  }`}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--border)] short:h-10 short:w-10">
                    {r.listingImage ? (
                      <Image src={r.listingImage} alt="" fill className="object-cover" sizes="44px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg opacity-30">📷</div>
                    )}
                    {unread && (
                      <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-[var(--brand-orange)] ring-2 ring-[var(--bg-elevated)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-start gap-2">
                      <p
                        className={`min-w-0 flex-1 truncate leading-5 ${unread ? "font-semibold text-[var(--brand-navy)]" : "font-medium text-[var(--brand-navy)]"}`}
                      >
                        {r.listingTitle}
                      </p>
                      {r.lastMessageAtMs > 0 && (
                        <span
                          className={`shrink-0 whitespace-nowrap pl-1 text-[10px] leading-5 ${
                            unread ? "font-semibold text-[var(--brand-navy)]" : "text-[var(--muted)]"
                          }`}
                        >
                          {formatRelativeTime(r.lastMessageAtMs)}
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-0.5 truncate pr-1 text-xs leading-5 ${
                        unread ? "font-medium text-[var(--text)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {r.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
          {!visibleRooms.length && (
            <li className="px-5 py-7 text-center text-sm leading-6 text-[var(--muted)] [overflow-wrap:anywhere]">
              {queryText.trim()
                ? "No chats match your search."
                : unreadOnly
                ? "No unread chats right now."
                : roleFilter === "buying"
                  ? "No buying chats yet."
                  : roleFilter === "selling"
                    ? "No selling chats yet."
                : "No chats yet. Open a listing and tap Message owner."}
            </li>
          )}
        </ul>
        {bootstrapError && (
          <p className="border-t border-red-200 bg-red-50 p-3 text-center text-sm leading-6 text-red-800 [overflow-wrap:anywhere]">
            {bootstrapError}
          </p>
        )}
      </aside>

      <section
        className={`flex min-h-0 flex-1 flex-col bg-[var(--bg)] ${
          activeRoomId ? "flex" : "hidden md:flex"
        }`}
      >
        {activeRoom ? (
          <>
            <div className="flex items-start gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 short:py-2 sm:items-center sm:gap-3 sm:px-4 sm:py-3">
              <button
                type="button"
                className="min-h-9 min-w-9 shrink-0 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--brand-orange)] md:hidden"
                onClick={closeActiveRoom}
                aria-label="Back to conversations"
              >
                ←
              </button>
              {activeRoom.listingImage && (
                <div className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-md)] sm:mt-0">
                  <Image src={activeRoom.listingImage} alt="" fill className="object-cover" sizes="40px" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate pr-1 text-sm font-medium leading-5 text-[var(--brand-navy)] sm:text-base">
                  {activeRoom.listingTitle}
                </p>
                <Link
                  href={appPath(`/listings/${activeRoom.listingId}`)}
                  className="inline-flex min-h-8 items-center rounded-full px-2.5 text-xs font-semibold text-[var(--brand-orange)] hover:bg-[var(--bg-elevated)]"
                >
                  View listing →
                </Link>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className="relative flex-1 space-y-3 overflow-y-auto bg-[var(--bg-elevated)] p-4 short:space-y-2.5 short:p-3.5"
            >
              {messages.map((m, index) => {
                const mine = m.senderUid === user.uid;
                const prev = messages[index - 1];
                const showDayDivider = !prev || dayKey(prev.createdAtMs) !== dayKey(m.createdAtMs);
                return (
                  <div key={m.id} className={mine ? "flex flex-col items-end" : "flex flex-col items-start"}>
                    {showDayDivider && m.createdAtMs > 0 && (
                      <div className="my-1.5 flex w-full items-center justify-center short:my-1">
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold leading-4 text-[var(--brand-navy)] short:px-2.5 short:py-0.5 short:text-[10px]">
                          {formatDayLabel(m.createdAtMs)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`max-w-[90%] break-words [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm short:py-2 sm:max-w-[85%] sm:px-4 ${
                        mine
                          ? "rounded-br-md bg-[var(--brand-orange)] text-white"
                          : "rounded-bl-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.createdAtMs > 0 && (
                      <span className="mt-1 px-1.5 text-[11px] leading-4 text-[var(--muted)]/90 short:mt-0.5">
                        {formatMessageTime(m.createdAtMs)}
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
              {showJumpToLatest && (
                <button
                  type="button"
                  onClick={jumpToLatest}
                  className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] ml-auto mr-1 block rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] font-semibold text-[var(--brand-navy)] shadow-sm short:bottom-[max(0.5rem,env(safe-area-inset-bottom))] short:px-2.5 short:py-0.5"
                >
                  Jump to latest
                </button>
              )}
            </div>

            <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] short:p-2.5 short:pb-[max(0.625rem,env(safe-area-inset-bottom))]">
              {sendError && (
                <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 short:mb-1.5 short:py-1.5">
                  {sendError}
                </p>
              )}
              <div className="flex flex-wrap items-end gap-2 short:gap-1.5 sm:flex-nowrap">
                <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                  <textarea
                    rows={1}
                    style={{ maxHeight: "7.5rem" }}
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                    }}
                    value={text}
                    onChange={(e) => {
                      if (e.target.value.length <= CHAT_MAX_CHARS) {
                        setText(e.target.value);
                      }
                    }}
                    className={`rp-input w-full resize-none !py-2.5 leading-relaxed transition-opacity ${
                      sending ? "cursor-not-allowed opacity-75" : ""
                    }`}
                    placeholder="Type a message…"
                    disabled={sending}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
                      }, 80);
                    }}
                    onKeyDown={(e) => {
                      if ((e.nativeEvent as KeyboardEvent).isComposing) return;
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (sending) return;
                        void sendMessage();
                      }
                    }}
                  />
                  <div className="mt-1 flex justify-end pr-0.5 short:mt-0.5">
                    <span
                      className={`text-[10px] ${
                        text.length > CHAT_MAX_CHARS * 0.9
                          ? "text-amber-700"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {text.length}/{CHAT_MAX_CHARS}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={sending || !trimmedText}
                  className={`rp-btn rp-btn-primary min-h-10 w-full shrink-0 px-5 text-sm disabled:opacity-50 short:min-h-9 short:px-4 short:text-xs sm:w-auto ${
                    sending ? "pointer-events-none" : ""
                  }`}
                  aria-busy={sending}
                  aria-live="polite"
                >
                  {sending ? "Sending message..." : "Send"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
            <EmptyState
              icon="💬"
              title="Select a conversation"
              description="Pick a thread on the left, or message an owner from a listing."
              actionHref={appPath("/search")}
              actionLabel="Browse listings"
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center px-4 py-8 text-sm leading-6 text-[var(--muted)] sm:min-h-[40vh]">
          Loading...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
