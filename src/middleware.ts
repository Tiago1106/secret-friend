import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export const publicRoutes = [
  {path: '/sign-in', whenAuthenticated: 'redirect'},
  {path: '/recover-password', whenAuthenticated: 'next'},
  // {path: '/pricing', whenAuthenticated: 'next'} // ROTA QUE ELE PODE ACESSAR MESMO ESTANDO LOGADO 
] as const;

export const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get('token');

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = '/';

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    const payload = JSON.parse(
      Buffer.from(authToken.value.split('.')[1], 'base64').toString()
    );

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp < currentTime) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}