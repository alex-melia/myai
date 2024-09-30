import { db } from "@/db"
import { verification_tokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export const runtime = "edge"

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verification_tokens)
      .where(eq(verification_tokens.email, email))
    return verificationToken
  } catch (error) {
    console.log(error)
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verification_tokens)
      .where(eq(verification_tokens.token, token))

    return verificationToken
  } catch (error) {
    console.log(error)
  }
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date().getTime() + 1000 * 60 * 60 * 24

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db
      .delete(verification_tokens)
      .where(eq(verification_tokens.id, existingToken.id))
  }

  const verificationToken = await db
    .insert(verification_tokens)
    .values({
      email,
      token,
      expires: new Date(expires),
    })
    .returning()

  return verificationToken[0] || null
}
