import { firestoreHelpers, getAdminDb } from "@/lib/firebase/admin";
import { makeDefaultSchema } from "@/lib/criar/defaults";
import type { CriarProjectRecord, CriarProjectSchema } from "@/lib/criar/schema";

const COLLECTION = "builderProjects";

type FirestoreTimestampLike = {
  toDate?: () => Date;
};

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value && "toDate" in value) {
    const date = (value as FirestoreTimestampLike).toDate?.();
    if (date instanceof Date) return date.toISOString();
  }
  return undefined;
}

function randomId(): string {
  return `proj_${Math.random().toString(36).slice(2, 10)}`;
}

export async function listProjectsByOwner(ownerUid: string): Promise<CriarProjectRecord[] | null> {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db
    .collection(COLLECTION)
    .where("ownerUid", "==", ownerUid)
    .orderBy("updatedAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<CriarProjectRecord, "id"> & { createdAt?: unknown; updatedAt?: unknown };
    return {
      id: doc.id,
      name: data.name,
      ownerUid: data.ownerUid,
      status: data.status,
      schema: data.schema,
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt),
    };
  });
}

export async function createProject(ownerUid: string, name: string): Promise<CriarProjectRecord | null> {
  const db = getAdminDb();
  if (!db) return null;

  const id = randomId();
  const schema = makeDefaultSchema();
  await db.collection(COLLECTION).doc(id).set({
    name,
    ownerUid,
    status: "draft",
    schema,
    createdAt: firestoreHelpers.serverTimestamp(),
    updatedAt: firestoreHelpers.serverTimestamp(),
  });

  return {
    id,
    name,
    ownerUid,
    status: "draft",
    schema,
  };
}

export async function getProjectById(projectId: string): Promise<CriarProjectRecord | null> {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).doc(projectId).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as Omit<CriarProjectRecord, "id"> & { createdAt?: unknown; updatedAt?: unknown };
  return {
    id: snapshot.id,
    name: data.name,
    ownerUid: data.ownerUid,
    status: data.status,
    schema: data.schema,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

export async function saveProjectSchema(
  projectId: string,
  next: { name?: string; status?: "draft" | "published"; schema: CriarProjectSchema },
): Promise<boolean> {
  const db = getAdminDb();
  if (!db) return false;

  const payload: Record<string, unknown> = {
    schema: next.schema,
    updatedAt: firestoreHelpers.serverTimestamp(),
  };
  if (next.name) payload.name = next.name;
  if (next.status) payload.status = next.status;

  await db.collection(COLLECTION).doc(projectId).update(payload);
  return true;
}
