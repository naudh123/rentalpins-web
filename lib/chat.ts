import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  increment,
  updateDoc,
} from "firebase/firestore";
import { getClientDb } from "./firebase-client";

export interface ChatRoomMeta {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  sellerUid: string;
  buyerUid: string;
  lastMessage: string;
  lastMessageAtMs: number;
  hasUnreadBuyer: boolean;
  hasUnreadSeller: boolean;
}

export function buildChatRoomId(
  listingId: string,
  sellerUid: string,
  buyerUid: string
): string {
  const ids = [sellerUid, buyerUid].sort();
  return `${listingId}_${ids.join("_")}`;
}

export interface EnsureChatRoomInput {
  listingId: string;
  sellerUid: string;
  buyerUid: string;
  listingTitle: string;
  listingImage: string;
}

/** Create or merge chat room — same ID scheme as Flutter app. */
export async function ensureChatRoom(input: EnsureChatRoomInput): Promise<string> {
  const roomId = buildChatRoomId(
    input.listingId,
    input.sellerUid,
    input.buyerUid
  );
  const db = getClientDb();
  await setDoc(
    doc(db, "chat_rooms", roomId),
    {
      listingId: input.listingId,
      listingTitle: input.listingTitle,
      listingImage: input.listingImage,
      sellerUid: input.sellerUid,
      buyerUid: input.buyerUid,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  return roomId;
}

export async function fetchListingForChat(listingId: string) {
  const snap = await getDoc(doc(getClientDb(), "listings", listingId));
  if (!snap.exists()) return null;
  const d = snap.data();
  if (d.isActive !== true) return null;

  const image =
    (Array.isArray(d.imageThumbnails) && d.imageThumbnails[0]) ||
    (Array.isArray(d.imageIcons) && d.imageIcons[0]) ||
    (Array.isArray(d.imageUrls) && d.imageUrls[0]) ||
    "";

  return {
    id: snap.id,
    title: (d.title as string) || "Listing",
    ownerUid: (d.ownerUid as string) || "",
    ownerPhone: (d.ownerPhone as string) || "",
    imageUrl: typeof image === "string" ? image : "",
  };
}

/** Best-effort inquiry counter (may fail if rules block non-owner updates). */
export async function tryIncrementInquiry(listingId: string): Promise<void> {
  try {
    await updateDoc(doc(getClientDb(), "listings", listingId), {
      inquiryCount: increment(1),
    });
  } catch {
    /* ignore */
  }
}

export function parseChatRoom(id: string, data: Record<string, unknown>): ChatRoomMeta {
  return {
    id,
    listingId: (data.listingId as string) || "",
    listingTitle: (data.listingTitle as string) || "Chat",
    listingImage: (data.listingImage as string) || "",
    sellerUid: (data.sellerUid as string) || "",
    buyerUid: (data.buyerUid as string) || "",
    lastMessage: (data.lastMessage as string) || "",
    lastMessageAtMs: (data.lastMessageAtMs as number) || 0,
    hasUnreadBuyer: data.hasUnreadBuyer === true,
    hasUnreadSeller: data.hasUnreadSeller === true,
  };
}

export function mapChatError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  switch (code) {
    case "permission-denied":
      return "You do not have permission to send messages in this chat.";
    case "unavailable":
      return "Chat is temporarily unavailable. Check your connection.";
    case "failed-precondition":
      return "Chat is not ready yet. Refresh and try again.";
    default:
      return err instanceof Error ? err.message : "Failed to send message. Try again.";
  }
}
