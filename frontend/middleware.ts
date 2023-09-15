import { NextRequest, NextResponse } from 'next/server';

// Reminder: changes to this file require a fresh build in Docker
export const config = {
  // We could do a negative match, but I'd rather be explicit on what we SHOULD match
  matcher: ['/topics', '/topics/:id*'],
};

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('access_token');
  if (!authCookie) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}
