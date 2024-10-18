

import { NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'


export async function middleware(req) {
  const session = await getSession(req, NextResponse.next());

  // tell me who you are
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/api/auth/login', req.url));
  }

  const roles = session.user[process.env.AUTH_DOMAIN_KEY] || [];

  // bounce the scrubs
  if (!roles.includes('Admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // its me or Dee
  return NextResponse.next();
}

// protect /admin and all subpaths
export const config = {
  matcher: ['/admin/:path*'],
};
