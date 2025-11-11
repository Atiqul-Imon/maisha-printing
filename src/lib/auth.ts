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
          console.error('Authorize: Missing email or password');
          throw new Error('Email and password required');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log('Authorize: Attempting authentication for:', email);

        try {
          const collection = await getUsersCollection();
          
          if (!collection) {
            console.warn('MongoDB not configured, using fallback authentication');
            // MongoDB not configured, use default admin
            if (
              (email === 'admin@maishaprinting.com' || email === 'admin@maishaprintingbd.com') &&
              password === 'admin123' // Change this in production!
            ) {
              console.log('Fallback authentication successful');
              return {
                id: '1',
                email: email,
                name: 'Admin',
                role: 'admin',
              };
            }
            console.error('Fallback authentication failed');
            throw new Error('Authentication failed - MongoDB not configured and fallback credentials invalid');
          }

          console.log('MongoDB collection found, querying user...');
          const user = await collection.findOne({ email }) as { password: string; email: string; name?: string; role?: string; _id: { toString: () => string } } | null;

          if (!user) {
            console.error('User not found in database:', email);
            throw new Error('Invalid credentials - User not found');
          }

          if (!user.password) {
            console.error('User found but no password set:', email);
            throw new Error('Invalid credentials - No password set');
          }

          console.log('User found, verifying password...');
          // Verify password
          const isValid = await bcrypt.compare(
            password,
            user.password
          );

          if (!isValid) {
            console.error('Password verification failed for:', email);
            throw new Error('Invalid credentials - Password incorrect');
          }

          console.log('Authentication successful for:', email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || 'Admin',
            role: user.role || 'admin',
          };
        } catch (error) {
          console.error('Auth error details:', error);
          if (error instanceof Error) {
            throw error;
          }
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

