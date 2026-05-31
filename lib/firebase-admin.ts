import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "rent-it-dev-6bcfd",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  if (serviceAccount.clientEmail && serviceAccount.privateKey) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp({ projectId: serviceAccount.projectId as string });
  }
}

export const adminDb = getFirestore();
