
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Only include Google OAuth if valid credentials are provided
    ...(process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET && 
        process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' &&
        process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret'
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          credits: user.credits,
          subscriptionTier: user.subscriptionTier,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        return {
          ...token,
          credits: user.credits,
          subscriptionTier: user.subscriptionTier,
        };
      }
      
      // For Google OAuth, create user if doesn't exist
      if (account?.provider === 'google' && token.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email }
        });
        
        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: token.email,
              name: token.name || '',
              credits: 10, // Give 10 free credits for new Google users
              subscriptionTier: 'free'
            }
          });
          
          token.credits = newUser.credits;
          token.subscriptionTier = newUser.subscriptionTier;
        } else {
          token.credits = existingUser.credits;
          token.subscriptionTier = existingUser.subscriptionTier;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          credits: token.credits,
          subscriptionTier: token.subscriptionTier,
        },
      };
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };
