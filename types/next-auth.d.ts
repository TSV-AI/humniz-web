
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      credits?: number;
      subscriptionTier?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    credits?: number;
    subscriptionTier?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    credits?: number;
    subscriptionTier?: string;
  }
}
