"use client";

import { getApp } from "firebase/app";
import {
  isSupported,
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from "firebase/messaging";
import { doc, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import { basePath } from "./config";

/** Web push VAPID public key (Firebase Console → Cloud Messaging → Web Push). */
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

let _messaging: Messaging | null = null;
let _foregroundBound = false;

async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  // Ensure the Firebase app is initialised.
  getClientDb();
  if (!_messaging) _messaging = getMessaging(getApp());
  return _messaging;
}

export function isWebPushConfigured(): boolean {
  return Boolean(VAPID_KEY);
}

/**
 * Requests notification permission, registers the FCM service worker, fetches a
 * web-push token and stores it on the user document (users/{uid}.fcmTokens).
 * Best-effort: resolves false (never throws) when unsupported, denied, or
 * misconfigured.
 */
export async function enableWebPush(uid: string): Promise<boolean> {
  try {
    if (!uid || !VAPID_KEY) return false;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      return false;
    }
    const messaging = await getMessagingIfSupported();
    if (!messaging) return false;

    const permission =
      Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();
    if (permission !== "granted") return false;

    const registration = await navigator.serviceWorker.register(
      `${basePath}/firebase-messaging-sw.js`
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return false;

    await setDoc(
      doc(getClientDb(), "users", uid),
      { fcmTokens: arrayUnion(token), webPushUpdatedAt: serverTimestamp() },
      { merge: true }
    );

    bindForegroundHandler(messaging);
    return true;
  } catch {
    return false;
  }
}

function bindForegroundHandler(messaging: Messaging) {
  if (_foregroundBound) return;
  _foregroundBound = true;
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title;
    const body = payload.notification?.body;
    if (
      title &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(title, { body: body || "", icon: `${basePath}/icon-192.png` });
    }
  });
}
