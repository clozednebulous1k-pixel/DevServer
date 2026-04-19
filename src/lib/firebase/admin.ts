import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { FieldValue, getFirestore, type Firestore } from "firebase-admin/firestore";

function loadServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    try {
      return JSON.parse(rawJson) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };
    } catch {
      return null;
    }
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { project_id: projectId, client_email: clientEmail, private_key: privateKey };
}

let adminApp: App | null = null;

export function getFirebaseAdminApp(): App | null {
  if (adminApp) return adminApp;
  const creds = loadServiceAccount();
  const projectId =
    creds?.project_id ??
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!creds?.client_email || !creds?.private_key || !projectId) {
    return null;
  }

  adminApp =
    getApps().length > 0
      ? getApps()[0]!
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail: creds.client_email,
            privateKey: creds.private_key,
          }),
        });

  return adminApp;
}

export function getAdminAuth(): Auth | null {
  const appInstance = getFirebaseAdminApp();
  if (!appInstance) return null;
  return getAuth(appInstance);
}

export function getAdminDb(): Firestore | null {
  const appInstance = getFirebaseAdminApp();
  if (!appInstance) return null;
  return getFirestore(appInstance);
}

export const firestoreHelpers = { serverTimestamp: () => FieldValue.serverTimestamp() };
