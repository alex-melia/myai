import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const runtime = "edge"

export const getUserById = async (id: string) => {
  try {
    const [user] = await db
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
      .where(eq(users.id, id))

    return user
  } catch {
    return null
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const lowerCaseEmail = email.toLowerCase()
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, lowerCaseEmail))
    return user
  } catch {
    return null
  }
}

export const getUserByUsername = async (username: string | string[]) => {
  try {
    if (Array.isArray(username)) {
      username = username[0]
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))

    return user
  } catch {
    return null
  }
}
