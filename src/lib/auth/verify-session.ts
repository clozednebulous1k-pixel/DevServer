import type { NextRequest } from "next/server";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "./session-cookie";

function readSessionCookieValue(source: NextRequest | Request): string | undefined {
  if ("cookies" in source && typeof source.cookies?.get === "function") {
    return source.cookies.get(SESSION_COOKIE_NAME)?.value;
  }

  const cookieHeader = source.headers.get("cookie") ?? "";
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const prefix = `${SESSION_COOKIE_NAME}=`;
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return part.slice(prefix.length);
    }
  }

  return undefined;
}

export async function verifySessionFromRequest(
  request: NextRequest | Request,
): Promise<{
  decoded: DecodedIdToken | null;
}> {
  const auth = getAdminAuth();
  if (!auth) {
    return { decoded: null };
  }

  const sessionCookie = readSessionCookieValue(request);
  if (!sessionCookie) {
    return { decoded: null };
  }

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return { decoded };
  } catch {
    return { decoded: null };
  }
}
