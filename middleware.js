import { NextResponse } from "next/server";
import {
  acquirerRoutes,
  adminRoutes,
  merchantRoutes,
} from "./app/services/routes";
import {
  acquirerRole,
  adminRole,
  merchantRole,
} from "./app/services/storageData";

export function middleware(req) {
  
  // Get all required cookies
  const token = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("user_role")?.value;
  const email = req.cookies.get("email")?.value;

  // Get the path
  const pathname = req.nextUrl.pathname;
  if (!token) {
    if (pathname !== "/login" && pathname !== "/")
      return NextResponse.redirect(new URL("/login", req.url));
    else if (pathname === "/login") return NextResponse.next();
  }
  if (token && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/home", req.url));
  } else {
    if (adminRole()) {
      const isAdminRoute = adminRoutes.some((route) =>
        new RegExp(`^${route.replace(":id", ".*")}$`).test(pathname)
      );
      if (!isAdminRoute && pathname !== "/home/permission-denied") {
        return NextResponse.redirect(
          new URL("/home/permission-denied", req.url)
        );
      }
      const response = NextResponse.next();
      response.headers.set("role", role);
      response.headers.set("email", email);
      return response;
    }
    if (merchantRole()) {
      const isMerchantRoute = merchantRoutes.some((route) =>
        new RegExp(`^${route.replace(":id", ".*")}$`).test(pathname)
      );
      if (!isMerchantRoute && pathname !== "/home/permission-denied") {
        return NextResponse.redirect(
          new URL("/home/permission-denied", req.url)
        );
      }
      const response = NextResponse.next();
      response.headers.set("role", role);
      response.headers.set("email", email);
      return response;
    }
    if (acquirerRole()) {
      const isAcquirerRoute = acquirerRoutes.some((route) =>
        new RegExp(`^${route.replace(":id", ".*")}$`).test(pathname)
      );
      if (
        !isAcquirerRoute.includes(pathname) &&
        pathname !== "/home/permission-denied"
      ) {
        return NextResponse.redirect(
          new URL("/home/permission-denied", req.url)
        );
      }
      const response = NextResponse.next();
      response.headers.set("role", role);
      response.headers.set("email", email);
      return response;
    }
  }
}

export const config = {
  matcher: ["/", "/login", "/home/:path*"],
};
