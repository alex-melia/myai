import authConfig from "@/auth.config"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { SubscriptionStatusEnum } from "@/db/schema"
import NextAuth, { type DefaultSession } from "next-auth"
import { accounts, users } from "./db/schema"
import { and, eq } from "drizzle-orm"
import { db } from "./db"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      image: string
      name: string
      username: string
      initialised: boolean
      subscription_status: typeof SubscriptionStatusEnum
      tokens: number
      interests: string[]
    } & DefaultSession["user"]
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false
      }

      let [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email as string))

      if (existingUser) {
        if (!existingUser.email_verified) {
          throw new Error(
            "Email not verified. Please verify your email before logging in."
          )
        }

        if (account?.provider && account?.providerAccountId) {
          const [existingAccount] = await db
            .select()
            .from(accounts)
            .where(
              and(
                eq(accounts.provider, account.provider),
                eq(accounts.providerAccountId, account.providerAccountId)
              )
            )

          if (!existingAccount) {
            await db.insert(accounts).values({
              user_id: existingUser.id,
              provider: account?.provider as string,
              providerAccountId: account?.providerAccountId as string,
              type: account?.type as string,
              accessToken: account?.access_token,
              token_type: account?.token_type,
              id_token: account?.id_token,
              refreshToken: account?.refresh_token,
              scope: account?.scope,
              expires_at: account?.expires_at,
            })
          }
        }
        return true
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            username: profile?.given_name as string,
            email: profile?.email as string,
            image: profile?.picture,
            email_verified: new Date(),
            name: profile?.name as string,
            subscription_status: "NONE",
            interests: [],
            initialised: false,
          })
          .returning()

        await db.insert(accounts).values({
          user_id: newUser.id,
          provider: account?.provider as string,
          providerAccountId: account?.providerAccountId as string,
          type: account?.type as string,
          accessToken: account?.access_token,
          token_type: account?.token_type,
          id_token: account?.id_token,
          refreshToken: account?.refresh_token,
          scope: account?.scope,
          expires_at: account?.expires_at,
        })

        return true
      }
    },
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub
        }

        if (token.name) {
          session.user.name = token.name
        }

        if (token.email) {
          session.user.email = token.email
        }

        if (typeof token.username === "string") {
          session.user.username = token.username
        }

        if (token.image) {
          session.user.image = token.image as string
        }

        if (token.subscription_status) {
          session.user.subscription_status =
            token.subscription_status as typeof SubscriptionStatusEnum
        }

        if (token.tokens) {
          session.user.tokens = token.tokens as number
        }

        if (token.interests) {
          session.user.interests = token.interests as string[]
        }

        session.user.initialised = token.initialised as boolean
      }

      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const [dbUser] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          username: users.username,
          image: users.image,
          initialised: users.initialised,
          subscription_status: users.subscription_status,
          tokens: users.tokens,
          interests: users.interests,
        })
        .from(users)
        .where(eq(users.id, token.sub))

      if (!dbUser) return token

      token.name = dbUser.name
      token.email = dbUser.email
      token.username = dbUser.username
      token.image = dbUser.image
      token.initialised = dbUser.initialised
      token.subscription_status = dbUser.subscription_status
      token.tokens = dbUser.tokens
      token.interests = dbUser.interests

      return token
    },
  },
  ...authConfig,
})
