import type { Firestore } from "firebase-admin/firestore";
import type { AppRole, UserProfile } from "./profile";

const USERS_COLLECTION = "users";

export async function loadUserProfile(db: Firestore, uid: string): Promise<UserProfile | null> {
  const snap = await db.collection(USERS_COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data() as {
    role?: AppRole;
    libraryAccess?: boolean;
  };

  const role: AppRole = data.role === "admin" ? "admin" : "user";
  const libraryAccess = !!data.libraryAccess;

  return { role, libraryAccess };
}
