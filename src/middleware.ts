import { NextRequest, NextResponse } from "next/server";

const protectedRoutes: Record<string, string[]> = {
  "/dashboard/visitor-dashboard": ["ADMIN", "Receptionist"],
  "/dashboard/student-dashboard": ["ADMIN", "Receptionist"],
  "/register/visitor-registration": ["Receptionist" , "ADMIN"],
  "/register/student-registration": ["Receptionist" , "ADMIN"],
  "/register/event-registration": ["Receptionist" , "ADMIN"],
  "/scanner": ["GUARD" , "ADMIN"],
  "/profile": ["Receptionist" , "ADMIN"],
  "/credentials": ["ADMIN"],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const userRole = req.cookies.get("userRole")?.value || null;

  console.log(`Middleware: Checking ${url}, Role: ${userRole}`);

  const isProtected = Object.keys(protectedRoutes).some((route) => 
    url.startsWith(route)
  );

  const publicPaths = ["/login", "/signup" , "unauthorized"];
  if (publicPaths.includes(url)) {
    return NextResponse.next();
  }

  if (isProtected) {
    if (!userRole) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!protectedRoutes[url].includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/register/:path*", "/scanner", "/credentials"],
};
