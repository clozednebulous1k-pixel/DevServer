import type { Timestamp } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export type DirectoryUser = {
  id: string;
  email: string;
  role: "admin" | "user";
  libraryAccess: boolean;
  createdAt: string;
  lastSignInAt: string | null;
};

export async function loadUsersDirectory(): Promise<DirectoryUser[] | null> {
  const db = getAdminDb();
  const authAdmin = getAdminAuth();
  if (!db || !authAdmin) return null;

  const profilesSnap = await db.collection("users").limit(500).get();

  const users = await Promise.all(
    profilesSnap.docs.map(async (doc) => {
      const data = doc.data() as {
        role?: string;
        libraryAccess?: boolean;
        createdAt?: Timestamp;
      };

      let email = "(sem e-mail)";
      let lastSignInAt: string | null = null;
      try {
        const record = await authAdmin.getUser(doc.id);
        email = record.email ?? email;
        lastSignInAt = record.metadata.lastSignInTime ?? null;
      } catch {
        /* usuario pode ter sido removido do Auth */
      }

      const createdAtMs = data.createdAt?.toMillis?.() ?? 0;

      return {
        id: doc.id,
        email,
        role: data.role === "admin" ? ("admin" as const) : ("user" as const),
        libraryAccess: !!data.libraryAccess,
        createdAt: createdAtMs ? new Date(createdAtMs).toISOString() : new Date().toISOString(),
        lastSignInAt,
      };
    }),
  );

  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return users;
}
