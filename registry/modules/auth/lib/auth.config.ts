/**
 * NextAuth.js v5 Configuration
 *
 * Defines providers, session strategy, custom pages, and callbacks.
 * This config is intentionally separated from auth.ts so it can be imported
 * in edge-compatible contexts (e.g. middleware) without pulling in the Prisma adapter.
 *
 * Providers enabled by default:
 *   - Google (requires GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET)
 *   - Credentials (email + password with bcrypt comparison)
 *
 * Providers commented out (require additional OAuth app setup):
 *   - Kakao  → set KAKAO_CLIENT_ID + KAKAO_CLIENT_SECRET, then uncomment
 *   - Naver  → set NAVER_CLIENT_ID + NAVER_CLIENT_SECRET, then uncomment
 *
 * Session strategy: "jwt" (default, no DB round-trip per request).
 * Switch to "database" if you need server-side session invalidation.
 */

import type { NextAuthConfig } from 'next-auth'
import '@/types/next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
// import Kakao from 'next-auth/providers/kakao'
// import Naver from 'next-auth/providers/naver'

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    /**
     * Kakao Login
     * 1. Create an app at https://developers.kakao.com
     * 2. Enable Kakao Login under [Product Settings]
     * 3. Add redirect URI: {NEXTAUTH_URL}/api/auth/callback/kakao
     * 4. Set KAKAO_CLIENT_ID and KAKAO_CLIENT_SECRET in .env
     * 5. Uncomment the import and the provider below
     */
    // Kakao({
    //   clientId: process.env.KAKAO_CLIENT_ID,
    //   clientSecret: process.env.KAKAO_CLIENT_SECRET,
    // }),

    /**
     * Naver Login
     * 1. Create an app at https://developers.naver.com
     * 2. Enable Login API and add the service URL + callback URI:
     *    {NEXTAUTH_URL}/api/auth/callback/naver
     * 3. Set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET in .env
     * 4. Uncomment the import and the provider below
     */
    // Naver({
    //   clientId: process.env.NAVER_CLIENT_ID,
    //   clientSecret: process.env.NAVER_CLIENT_SECRET,
    // }),

    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Dynamic import keeps bcryptjs out of the edge bundle when using JWT strategy
        const { default: bcrypt } = await import('bcryptjs')

        // Import db lazily to avoid edge-runtime issues in middleware usage
        const { db } = await import('@/lib/db')

        const user = await db.user.findUnique({
          where: { email: String(credentials.email) },
        })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(
          String(credentials.password),
          user.password,
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role ?? 'user',
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    // signOut: '/logout',
    // error: '/auth/error',
  },

  callbacks: {
    /**
     * jwt callback — runs whenever a JWT is created or updated.
     * Persists user.id and role into the token so they survive page reloads.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role ?? 'user'
      }
      return token
    },

    /**
     * session callback — runs whenever a session is checked.
     * Exposes the values stored in the token to the client-side session object.
     */
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === 'string') {
          session.user.id = token.id
        }
        session.user.role = token.role
      }
      return session
    },
  },
}
