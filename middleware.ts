import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "./constants/locales";
import { i18n } from "./i18n-config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with any of the locales in the config
  const localeInPath = i18n.locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  );

  // If no locale is detected, prepend the default locale to the pathname
  if (!localeInPath) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Extract the locale from the pathname (if it exists)
  const locale = localeInPath || defaultLocale;

  // Define public routes that do not require authentication
  const publicRoutes = [
    `/${locale}/login`,
    `/${locale}/forget-password`,
    `/${locale}/reset-password`,
    `/${locale}/verify-code`,
  ];

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Get the access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // If the user is authenticated and tries to access a public route, redirect to the home page
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // If the route is not public and there's no access token, redirect to login
  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // If the route is public or the access token exists, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};


// import { NextResponse, type NextRequest } from "next/server";
// import { defaultLocale } from "./constants/locales";
// import { i18n } from "./i18n-config";

// export function middleware(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;

//   // Check if the pathname is the root path (`/`)
//   if (pathname === "/") {
//     // Redirect to the default locale
//     return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
//   }

//   // Check if the pathname starts with any of the locales in the config
//   const localeInPath = i18n.locales.find((locale) =>
//     pathname.startsWith(`/${locale}`)
//   );

//   // Extract the locale from the pathname (if it exists)
//   const locale = localeInPath || defaultLocale;

//   // Define public routes that do not require authentication
//   const publicRoutes = [
//     `/${locale}/login`,
//     `/${locale}/forget-password`,
//     `/${locale}/reset-password`,
//     `/${locale}/verify-code`,
//   ];

//   // Check if the current route is a public route
//   const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

//   // Get the access token from cookies
//   const accessToken = request.cookies.get("access_token")?.value;

//   // If the route is not public and there's no access token, redirect to login
//   if (!isPublicRoute && !accessToken) {
//     // Redirect to the locale-specific login page
//     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//   }

//   // If the route is public or the access token exists, allow the request to proceed
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };









// its work without auth check if user token or not 



// // middleware.ts
// import { NextResponse, type NextRequest } from "next/server";
// import { defaultLocale } from "./constants/locales";
// import { i18n } from "./i18n-config";

// export function middleware(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;

//   // Check if the pathname starts with any of the locales in the config
//   const localeInPath = i18n.locales.find((locale) =>
//     pathname.startsWith(`/${locale}`)
//   );

//   // Handle case when no locale is in the URL
//   if (!localeInPath) {
//     // Rewrite to the default locale
//     return NextResponse.rewrite(
//       new URL(
//         `/${defaultLocale}${pathname}${searchParams ? `?${searchParams}` : ""}`,
//         request.url
//       )
//     );
//   }

  




//   // If the path includes a locale, allow it to proceed
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };


