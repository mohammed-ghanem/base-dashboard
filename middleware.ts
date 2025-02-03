import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "./constants/locales";
import { i18n } from "./i18n-config";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  // const token = request.cookies.get('access_token');


  // Check if the pathname starts with any of the locales in the config
  const localeInPath = i18n.locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  );

  // Handle case when no locale is in the URL
  if (!localeInPath) {
    if (pathname === '/') {
      // Rewrite to /ar internally without showing it in the URL
      return NextResponse.rewrite(
        new URL(`/${defaultLocale}${pathname}${searchParams ? `?${searchParams}` : ""}`, request.url)
      );
    } else {
      // If the path is not root, rewrite to default locale path
      return NextResponse.rewrite(
        new URL(
          `/${defaultLocale}${pathname}${searchParams ? `?${searchParams}` : ""}`,
          request.url
        )
      );
    }
  }

  // 2. Authentication handling middleware logic

  // Check if the user is accessing a protected route without a token


  // if (!token) {
  //   if (pathname.endsWith('/auth/profile') || pathname.endsWith('/auth/update-profile') || pathname.endsWith('/auth/my-courses')) {
  //     return NextResponse.redirect(new URL(`/${localeInPath}/auth/signin`, request.url));
  //   }
  // }

  // // Check if the user is already signed in and trying to access the sign-in or sign-up page
  // if (token && (pathname.endsWith('/auth/signin') || pathname.endsWith('/auth/signup'))) {
  //   return NextResponse.redirect(new URL(`/${localeInPath}/auth/profile`, request.url));
  // }

  return NextResponse.next(); // Allow the request to continue


}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/[lang]/auth/:path*",
  ],
};


