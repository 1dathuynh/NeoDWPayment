import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './lib/db'
import Credentials from 'next-auth/providers/credentials'
import { loginSchemas } from './schemas'
import { getUserByEmail } from '@/data/user'
import { getUserById } from '@/data/user'
import bcrypt from 'bcrypt'
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt', maxAge: 30 * 60 },
  ...authConfig,
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user && token.role) {
        session.user.role = token.role
        session.user.isVip = token.isVip
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token
      }
      const user = await getUserById(token.sub)
      if (!user) {
        return token
      }
      token.role = user.role
      token.isVip = user.isVip
      return token
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validated = loginSchemas.safeParse(credentials)
        if (validated.success) {
          const { email, password } = validated.data
          const user = await getUserByEmail(email)
          if (!user || !user.password) {
            return null
          }
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (passwordMatch) return user
        }
        return null
      },
    }),
    // Credentials({
    // async authorize(credentials) {
    //   try {
    //     console.log("Incoming credentials:", credentials);
    //     const validated = loginSchemas.safeParse(credentials);

    //     if (!validated.success) {
    //       console.error("❌ Validation failed:", validated.error);
    //       throw new Error("Invalid input");
    //     }

    //     const { email, password } = validated.data;
    //     const user = await getUserByEmail(email);
    //     console.log("Fetched user:", user);

    //     if (!user || !user.password) {
    //       throw new Error("User not found or missing password");
    //     }

    //     const passwordMatch = await bcrypt.compare(password, user.password);
    //     if (!passwordMatch) {
    //       throw new Error("Invalid password");
    //     }

    //     // ✅ NextAuth requires a serializable user object
    //     return {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //       role: user.role,
    //       isVip: user.isVip,
    //     };
    //   } catch (err) {
    //     console.error("Authorize error:", err);
    //     return null;
    //   }
    // },
    // }),
  ],
})
