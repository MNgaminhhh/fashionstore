import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register"];
const privatePaths = ["/me"];
const vendorPaths = ["/dashboard/vendor"];
const adminPaths = ["/dashboard/admin"];

interface JwtPayload {
  role: string;
}

function getRoleFromToken(token: string): string | null {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.role ? decoded.role.toLowerCase() : null;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("access_cookie")?.value || "";
  const role = sessionToken ? getRoleFromToken(sessionToken) : null;

  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }
  if (vendorPaths.some((path) => pathname.startsWith(path))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "vendors") {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  if (privatePaths.some((path) => pathname.startsWith(path))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/me",
    "/login",
    "/register",
    "/dashboard/vendor/:path*",
    "/dashboard/admin/:path*",
  ],
};
