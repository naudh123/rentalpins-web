"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getClientAuth, getClientDb } from "@/lib/firebase-client";
import { mapAuthError } from "@/lib/auth-errors";
import { requirePhoneVerification } from "@/lib/config";
import { currencyForIso, resolveIsoFromPhone } from "@/lib/phone-iso";
import { isUserBlocked } from "@/lib/user-blocked";

export { isUserBlocked } from "@/lib/user-blocked";

export interface AuthProfile {
  uid: string;
  phone: string;
  homeIso: string;
  billingCurrency: string;
  role: string;
  isBlocked: boolean;
  displayName?: string;
  email?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  profileError: string | null;
  phoneVerified: boolean;
  canPostListing: boolean;
  isBlocked: boolean;
  needsPhoneLink: boolean;
  sendOtp: (phone: string, containerId: string, linkMode?: boolean) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  signInWithGoogle: () => Promise<AuthProfile>;
  signOut: () => Promise<void>;
  cancelOtp: () => void;
  updateDisplayName: (displayName: string) => Promise<void>;
  confirmation: ConfirmationResult | null;
  linkMode: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type RecaptchaWindow = {
  recaptchaVerifier?: RecaptchaVerifier;
  recaptchaContainerId?: string;
};

function getRecaptchaWindow(): RecaptchaWindow {
  return window as unknown as RecaptchaWindow;
}

function clearRecaptcha() {
  const win = getRecaptchaWindow();
  if (win.recaptchaVerifier) {
    try {
      win.recaptchaVerifier.clear();
    } catch {
      /* ignore */
    }
    win.recaptchaVerifier = undefined;
    win.recaptchaContainerId = undefined;
  }
}

function getRecaptcha(auth: ReturnType<typeof getClientAuth>, containerId: string) {
  const win = getRecaptchaWindow();
  if (win.recaptchaVerifier && win.recaptchaContainerId === containerId) {
    return win.recaptchaVerifier;
  }
  clearRecaptcha();
  win.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
  win.recaptchaContainerId = containerId;
  return win.recaptchaVerifier;
}

async function syncUserDoc(
  user: User,
  phone: string,
  extras?: { displayName?: string; email?: string }
): Promise<AuthProfile> {
  const db = getClientDb();
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const resolvedPhone =
    phone || user.phoneNumber || (snap.data()?.phone as string) || "";
  const homeIso = resolvedPhone
    ? resolveIsoFromPhone(resolvedPhone)
    : (snap.data()?.homeIso as string) || "IN";
  const billingCurrency =
    (snap.data()?.billingCurrency as string) || currencyForIso(homeIso);

  const payload: Record<string, unknown> = {
    uid: user.uid,
    lastActive: serverTimestamp(),
  };
  if (resolvedPhone) payload.phone = resolvedPhone;
  if (extras?.displayName) payload.displayName = extras.displayName;
  if (extras?.email || user.email) payload.email = extras?.email || user.email;

  if (!snap.exists()) {
    await setDoc(ref, {
      ...payload,
      homeIso,
      billingCurrency,
      role: "user",
      isBlocked: false,
      freeTokens: 0,
      premiumTokens: 0,
      createdAt: serverTimestamp(),
      verifiedLevel: 1,
    });
  } else {
    await setDoc(ref, payload, { merge: true });
  }

  const data = (await getDoc(ref)).data()!;
  return {
    uid: user.uid,
    phone: (data.phone as string) || resolvedPhone,
    homeIso: (data.homeIso as string) || homeIso,
    billingCurrency: (data.billingCurrency as string) || billingCurrency,
    role: (data.role as string) || "user",
    isBlocked: isUserBlocked(data),
    displayName: (data.displayName as string) || user.displayName || undefined,
    email: (data.email as string) || user.email || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const [linkMode, setLinkMode] = useState(false);

  useEffect(() => {
    const auth = getClientAuth();
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const phone = u.phoneNumber || pendingPhone || "";
        try {
          const p = await syncUserDoc(u, phone, {
            displayName: u.displayName || undefined,
            email: u.email || undefined,
          });
          setProfile(p);
          setProfileError(null);
        } catch (e) {
          console.error("syncUserDoc", e);
          setProfile(null);
          setProfileError(mapAuthError(e));
        }
      } else {
        setProfile(null);
        setProfileError(null);
      }
      setLoading(false);
    });
  }, [pendingPhone]);

  // Verification must come from the real Firebase phone credential
  // (`user.phoneNumber`), not a Firestore `profile.phone` string which can be
  // set without OTP. When verification isn't required, any signed-in user is OK.
  const phoneVerified = Boolean(
    user?.phoneNumber || (!requirePhoneVerification && user)
  );

  const needsPhoneLink = Boolean(
    user && !user.phoneNumber && (!profile?.phone || profile.phone.length < 8)
  );

  const isBlocked = Boolean(profile?.isBlocked);

  const canPostListing = Boolean(
    user &&
      profile &&
      !isBlocked &&
      (!requirePhoneVerification || user.phoneNumber)
  );

  const sendOtp = useCallback(
    async (phone: string, containerId: string, forLink = false) => {
      const auth = getClientAuth();
      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TESTING === "true"
      ) {
        auth.settings.appVerificationDisabledForTesting = true;
      }
      setPendingPhone(phone);
      setLinkMode(forLink);
      try {
        const verifier = getRecaptcha(auth, containerId);
        await verifier.render();

        if (forLink && auth.currentUser) {
          const result = await linkWithPhoneNumber(auth.currentUser, phone, verifier);
          setConfirmation(result);
          return;
        }

        const result = await signInWithPhoneNumber(auth, phone, verifier);
        setConfirmation(result);
      } catch (err) {
        clearRecaptcha();
        throw new Error(mapAuthError(err));
      }
    },
    []
  );

  const verifyOtp = useCallback(
    async (code: string) => {
      if (!confirmation) throw new Error("No OTP session. Request a new code.");
      try {
        await confirmation.confirm(code);
        setConfirmation(null);
        setLinkMode(false);
        const auth = getClientAuth();
        if (auth.currentUser) {
          const p = await syncUserDoc(
            auth.currentUser,
            auth.currentUser.phoneNumber || pendingPhone
          );
          setProfile(p);
        }
      } catch (err) {
        throw new Error(mapAuthError(err));
      }
    },
    [confirmation, pendingPhone]
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthProfile> => {
    const auth = getClientAuth();
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      const p = await syncUserDoc(cred.user, cred.user.phoneNumber || "", {
        displayName: cred.user.displayName || undefined,
        email: cred.user.email || undefined,
      });
      setProfile(p);
      return p;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  }, []);

  const cancelOtp = useCallback(() => {
    setConfirmation(null);
    setLinkMode(false);
    clearRecaptcha();
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(getClientAuth());
    setProfile(null);
    setConfirmation(null);
    setLinkMode(false);
    clearRecaptcha();
  }, []);

  const updateDisplayName = useCallback(
    async (displayName: string) => {
      if (!user) throw new Error("Not signed in");
      const trimmed = displayName.trim();
      const db = getClientDb();
      await setDoc(
        doc(db, "users", user.uid),
        { displayName: trimmed, lastActive: serverTimestamp() },
        { merge: true }
      );
      setProfile((prev) =>
        prev ? { ...prev, displayName: trimmed || undefined } : prev
      );
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      profileError,
      phoneVerified,
      canPostListing,
      isBlocked,
      needsPhoneLink,
      sendOtp,
      verifyOtp,
      signInWithGoogle,
      signOut,
      cancelOtp,
      updateDisplayName,
      confirmation,
      linkMode,
    }),
    [
      user,
      profile,
      loading,
      profileError,
      phoneVerified,
      canPostListing,
      isBlocked,
      needsPhoneLink,
      sendOtp,
      verifyOtp,
      signInWithGoogle,
      signOut,
      cancelOtp,
      updateDisplayName,
      confirmation,
      linkMode,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
