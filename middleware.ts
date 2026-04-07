import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "ds_lib_access";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (!pathname.startsWith("/biblioteca")) {
    return NextResponse.next();
  }

  const accessKey = process.env.BIBLIOTECA_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.next();
  }

  const cookieKey = request.cookies.get(ACCESS_COOKIE)?.value;
  if (cookieKey === accessKey) {
    return NextResponse.next();
  }

  const incomingKey = searchParams.get("key");
  if (incomingKey === accessKey) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("key");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(ACCESS_COOKIE, accessKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/biblioteca/:path*"],
};
