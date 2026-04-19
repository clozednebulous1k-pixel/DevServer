import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { FieldValue, getFirestore, type Firestore } from "firebase-admin/firestore";

type ParsedCreds = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

/** Sem segredos: apenas ajuda a depurar Vercel (GET /api/admin/bootstrap). */
export type FirebaseAdminDiagnostics = {
  serviceAccountJsonEnvSet: boolean;
  serviceAccountJsonParsesOk: boolean;
  serviceAccountHasRequiredFields: boolean;
  splitCredentialsPresent: boolean;
  initAttempted: boolean;
  initOk: boolean;
  /** Mensagem sanitizada (sem chaves). */
  initError?: string;
  hint?: string;
};

let adminApp: App | null = null;
let lastInitError: string | undefined;

function normalizePrivateKey(key: string): string {
  return key.replace(/\\n/g, "\n").trim();
}

function parseJsonEnv(raw: string): { ok: true; data: ParsedCreds } | { ok: false } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false };

  try {
    const data = JSON.parse(trimmed) as ParsedCreds;
    return { ok: true, data };
  } catch {
    try {
      const decoded = Buffer.from(trimmed, "base64").toString("utf8");
      const data = JSON.parse(decoded) as ParsedCreds;
      return { ok: true, data };
    } catch {
      return { ok: false };
    }
  }
}

function loadServiceAccount(): ParsedCreds | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson?.trim()) {
    const parsed = parseJsonEnv(rawJson);
    if (!parsed.ok) return null;
    const pk = parsed.data.private_key ? normalizePrivateKey(parsed.data.private_key) : "";
    return {
      ...parsed.data,
      private_key: pk || undefined,
    };
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
    : "";

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { project_id: projectId, client_email: clientEmail, private_key: privateKey };
}

export function getFirebaseAdminDiagnostics(): FirebaseAdminDiagnostics {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountJsonEnvSet = !!(rawJson && rawJson.trim().length > 0);

  let serviceAccountJsonParsesOk = false;
  let serviceAccountHasRequiredFields = false;

  if (serviceAccountJsonEnvSet && rawJson) {
    const parsed = parseJsonEnv(rawJson);
    serviceAccountJsonParsesOk = parsed.ok;
    if (parsed.ok) {
      const pk = parsed.data.private_key ? normalizePrivateKey(parsed.data.private_key) : "";
      serviceAccountHasRequiredFields = !!(
        parsed.data.client_email &&
        pk &&
        (parsed.data.project_id || process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      );
    }
  }

  const splitCredentialsPresent = !!(
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim() &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim()
  );

  const initAttempted = serviceAccountJsonEnvSet || splitCredentialsPresent;
  const appReady = !!getFirebaseAdminApp();

  let hint: string | undefined;
  if (serviceAccountJsonEnvSet && !serviceAccountJsonParsesOk) {
    hint =
      "FIREBASE_SERVICE_ACCOUNT_JSON nao e JSON valido. Cole o arquivo .json inteiro em UMA linha (ou use JSON minificado). Opcional: codifique o JSON em Base64 e cole (o servidor tenta decodificar).";
  } else if (serviceAccountJsonEnvSet && serviceAccountJsonParsesOk && !serviceAccountHasRequiredFields) {
    hint =
      "No JSON da service account confira project_id, client_email e private_key. A private_key deve conter \\n entre linhas se estiver em uma unica linha.";
  } else if (!serviceAccountJsonEnvSet && !splitCredentialsPresent) {
    hint =
      "Defina FIREBASE_SERVICE_ACCOUNT_JSON OU as tres variaveis FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY.";
  } else if (initAttempted && !appReady && lastInitError) {
    hint = lastInitError;
  } else if (initAttempted && !appReady && !lastInitError) {
    hint =
      "Verifique se project_id (ou NEXT_PUBLIC_FIREBASE_PROJECT_ID), client_email e private_key estao corretos na service account.";
  }

  return {
    serviceAccountJsonEnvSet,
    serviceAccountJsonParsesOk,
    serviceAccountHasRequiredFields,
    splitCredentialsPresent,
    initAttempted,
    initOk: appReady,
    initError: lastInitError,
    hint,
  };
}

export function getFirebaseAdminApp(): App | null {
  if (adminApp) return adminApp;

  lastInitError = undefined;

  try {
    const creds = loadServiceAccount();
    const projectId =
      creds?.project_id ??
      process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ??
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();

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
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao inicializar Firebase Admin";
    lastInitError = msg.replace(/BEGIN [A-Z ]+PRIVATE KEY[\s\S]*?END [A-Z ]+PRIVATE KEY/gi, "[private_key]");
    return null;
  }
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
