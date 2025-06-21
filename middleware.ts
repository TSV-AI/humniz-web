
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // This middleware will run for protected routes
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/humanize/:path*',
    '/api/user/:path*'
  ]
};
