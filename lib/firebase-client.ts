"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions, type Functions } from "firebase/functions";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/** Public web config — matches `rentit_clean/lib/firebase_options.dart` (web). */
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBQg5AbUmjdCwbpbJv01mkdBs06vC4TM0c",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "rent-it-dev-6bcfd.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "rent-it-dev-6bcfd",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "rent-it-dev-6bcfd.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "73612808652",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:73612808652:web:e3dae981ad451935c60d69",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VGVQGGL24W",
};

function getFirebaseApp(): FirebaseApp {
  if (!firebaseConfig.apiKey?.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY. Copy .env.example to .env.local and restart `npm run dev`."
    );
  }
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0]!;
}

let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;
const _regionFunctions: Record<string, Functions> = {};
let _storage: FirebaseStorage | null = null;

export function getClientAuth(): Auth {
  if (!_auth) _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getClientDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

export function getClientFunctions(region?: string): Functions {
  if (region) {
    if (!_regionFunctions[region]) {
      _regionFunctions[region] = getFunctions(getFirebaseApp(), region);
    }
    return _regionFunctions[region];
  }
  if (!_functions) _functions = getFunctions(getFirebaseApp());
  return _functions;
}

export function getClientStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getFirebaseApp());
  return _storage;
}
