import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUsersCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const collection = await getUsersCollection();
          if (!collection) {
            // MongoDB not configured, use default admin
            if (
              email === 'admin@maishaprinting.com' &&
              password === 'admin123' // Change this in production!
            ) {
              return {
                id: '1',
                email: 'admin@maishaprinting.com',
                name: 'Admin',
                role: 'admin',
              };
            }
            throw new Error('Authentication failed');
          }

          const user = await collection.findOne({ email }) as { password: string; email: string; name?: string; role?: string; _id: { toString: () => string } } | null;

          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          // Verify password
          const isValid = await bcrypt.compare(
            password,
            user.password
          );

          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'admin',
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
};

