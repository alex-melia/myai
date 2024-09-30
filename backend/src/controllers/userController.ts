import { Request, Response } from "express"
import cloudinary from "cloudinary"
import path from "path"
import pug from "pug"
import { Resend } from "resend"
import { Pinecone } from "@pinecone-database/pinecone"
import { uuid } from "uuidv4"
import { hash } from "bcryptjs"

import { db } from "../db"
import {
  analytics,
  files,
  interface_settings,
  links,
  theme_settings,
  users,
  verification_codes,
  verification_tokens,
} from "../db/schema"
import { and, eq } from "drizzle-orm"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY)

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function generateUsername(email: string) {
  let usernameBase = email.split("@")[0]

  const randomChars = Math.random().toString(36).substring(2, 5)
  const randomNumber = Math.floor(Math.random() * 90) + 10
  const username = `${usernameBase}${randomChars}${randomNumber}`

  return username
}

const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [existingToken] = await db
      .select()
      .from(verification_tokens)
      .where(eq(verification_tokens.email, email))
      .limit(1)
    return existingToken
  } catch (error) {
    console.log(error)
  }
}

const generateVerificationToken = async (email: string) => {
  const token = uuid()
  const expires = new Date().getTime() + 1000 * 60 * 60 * 24

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db
      .delete(verification_tokens)
      .where(eq(verification_tokens.id, existingToken.id))
  }

  const [verificationToken] = await db
    .insert(verification_tokens)
    .values({
      email,
      token,
      expires: new Date(expires),
    })
    .returning()

  return verificationToken
}

async function sendVerificationEmail(email: string, token: string) {
  try {
    const confirmationLink = `https://myai.bio/verify-email?token=${token}`

    await resend.emails.send({
      from: "MyAI <noreply@myai.bio>",
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`,
    })
  } catch (error) {
    console.log(error)
  }
}

export async function signUp(req: Request, res: Response) {
  const { email, password } = req.body

  try {
    const hashedPassword = await hash(password.trim(), 10)

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      throw new Error("Email is already in use")
    }

    const lowerCaseEmail = email.toLowerCase()

    let generatedUsername = await generateUsername(email)

    const [newUser] = await db
      .insert(users)
      .values({
        id: uuid(),
        name: "",
        username: generatedUsername,
        email: lowerCaseEmail,
        password: hashedPassword,
        image: "",
        subscription_status: "NONE",
      })
      .returning()

    let verificationToken = null

    if (newUser && newUser.email) {
      verificationToken = await generateVerificationToken(newUser.email)
    }

    if (!verificationToken || !verificationToken.token) {
      throw new Error("Failed to create verification token")
    }

    await sendVerificationEmail(email, verificationToken.token)

    return res.status(201).send(newUser)
  } catch (error) {
    console.log(error)

    return null
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id, name, username, headline, introMessage } = req.body
    const image = req.file

    let imageUrl = ""
    let imagePublicId = ""

    const [existingUser] = await db.select().from(users).where(eq(users.id, id))

    if (!existingUser) {
      throw new Error("User does not exist")
    }

    if (image) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ folder: "user_avatars" }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })
          .end(image.buffer)
      })

      if (!uploadResult) {
        throw new Error("Failed to upload image")
      }

      if (existingUser.image_public_id) {
        const deleteResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.destroy(
            existingUser.image_public_id as string,
            (error, result) => {
              if (error) return reject(error)
              resolve(result)
            }
          )
        })

        if (!deleteResult) {
          throw new Error("Failed to delete original image")
        }
      }

      imageUrl = uploadResult.secure_url
      imagePublicId = uploadResult.public_id
    }

    if (imageUrl) {
      await db
        .update(users)
        .set({
          name: name,
          username: username,
          headline: headline,
          intro_message: introMessage,
          image: imageUrl,
          image_public_id: imagePublicId,
        })
        .where(eq(users.id, id))
    } else {
      await db
        .update(users)
        .set({
          name: name,
          username: username,
          headline: headline,
          intro_message: introMessage,
        })
        .where(eq(users.id, id))
    }

    return res.status(200).send("User updated")
  } catch (error) {
    console.error(error)
    return res.status(500).send("Error!")
  }
}

export async function initialiseUser(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { name, username, headline, interests, introMessage } = req.body
    const image = req.file

    let imageUrl = ""

    if (image) {
      const result: any = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ folder: "user_avatars" }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })
          .end(image.buffer)
      })

      imageUrl = result.secure_url
    }

    if (imageUrl) {
      const initialisedUser = await db
        .update(users)
        .set({
          name: name,
          username: username,
          headline: headline,
          intro_message: introMessage,
          interests: JSON.parse(interests),
          image: imageUrl,
          initialised: true,
        })
        .where(eq(users.id, user_id))

      if (!initialisedUser) {
        throw new Error("Failed to initialise user")
      }
    } else {
      const initialisedUser = await db
        .update(users)
        .set({
          name: name,
          username: username,
          headline: headline,
          intro_message: introMessage,
          interests: JSON.parse(interests),
          initialised: true,
        })
        .where(eq(users.id, user_id))

      if (!initialisedUser) {
        throw new Error("Failed to initialise user")
      }
    }

    const initialisedInterfaceSettings = await db
      .insert(interface_settings)
      .values({
        user_id: user_id,
      })

    if (!initialisedInterfaceSettings) {
      throw new Error("Failed to initialise interface settings")
    }

    const initialisedThemeSettings = await db.insert(theme_settings).values({
      user_id: user_id,
    })

    if (!initialisedThemeSettings) {
      throw new Error("Failed to initialise theme settings")
    }

    const initialisedAnalytics = await db.insert(analytics).values({
      user_id: user_id,
    })

    if (!initialisedAnalytics) {
      throw new Error("Failed to initialise analytics")
    }

    return res.status(200).send("User initialised")
  } catch (error) {
    console.error(error)
    return res.status(500).send("Error!")
  }
}

async function getVerificationTokenByToken(token: string) {
  const [existingToken] = await db
    .select()
    .from(verification_tokens)
    .where(eq(verification_tokens.token, token))
    .limit(1)

  return existingToken
}

export async function verifyEmailToken(req: Request, res: Response) {
  const { token } = req.body
  console.log(token)

  try {
    if (!token) {
      return res.status(400).json({ error: "No token provided" })
    }

    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken || !existingToken.email) {
      return res.status(400).json({ error: "Invalid token" })
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, existingToken.email))
      .limit(1)

    if (!existingUser || !existingToken.expires) {
      return res.status(404).json({ error: "User not found" })
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
      await db.delete(users).where(eq(users.id, existingUser.id))

      await db
        .delete(verification_tokens)
        .where(eq(verification_tokens.id, existingToken.id))

      return res.status(400).json({ error: "Token has expired" })
    }

    await db
      .update(users)
      .set({
        email_verified: new Date(),
        email: existingToken.email,
      })
      .where(eq(users.id, existingUser.id))

    await db
      .delete(verification_tokens)
      .where(eq(verification_tokens.id, existingToken.id))

    return res.status(200).json({ success: "Email Verified" })
  } catch (error) {}
}

export async function verifyEmail(req: Request, res: Response) {
  const { user_id } = req.params
  const { email, code } = req.body

  try {
    const [verificationCode] = await db
      .select()
      .from(verification_codes)
      .where(
        and(
          eq(verification_codes.email, email),
          eq(verification_codes.code, parseInt(code))
        )
      )
      .limit(1)

    if (!verificationCode || !verificationCode.expires) {
      return res.status(400).send({ message: "Invalid or expired code" })
    }

    if (new Date() > verificationCode.expires) {
      await db
        .delete(verification_codes)
        .where(eq(verification_codes.id, verificationCode.id))

      return res.status(400).send({ message: "Code has expired" })
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        email: email,
        new_email: null,
      })
      .where(eq(users.id, user_id))
      .returning()

    const stripe_customer_id = updatedUser.stripe_customer_id

    if (stripe_customer_id) {
      await stripe.customers.update(stripe_customer_id, {
        email: updatedUser.email,
      })
    }

    await db
      .delete(verification_codes)
      .where(eq(verification_codes.id, verificationCode.id))

    return res.status(200).send("New Email Set!")
  } catch (error) {
    console.error(error)
    return res.status(500).send("Error!")
  }
}

export async function sendCode(req: Request, res: Response) {
  const { user_id } = req.params
  const { email } = req.body

  try {
    const code = Math.floor(1000 + Math.random() * 9000)
    const expires = new Date(Date.now() + 15 * 60 * 10000)

    await db
      .update(users)
      .set({
        new_email: email,
      })
      .where(eq(users.id, user_id))

    await db.insert(verification_codes).values({
      email: email,
      code: code,
      expires: expires,
    })

    const templatePath = path.join(__dirname, "../emails/verify-code.pug")
    const htmlContent = pug.renderFile(templatePath, {
      code: code,
    })

    const { data, error } = await resend.emails.send({
      from: "MyAI <noreply@myai.bio>",
      to: [email],
      subject: "Verify your new email",
      html: htmlContent,
    })

    if (error) {
      console.error(error)
      return res.status(500).send({ message: "Error sending email" })
    }

    return res.status(200).send("Code Sent!")
  } catch (error) {
    console.error(error)
    return res.status(500).send("Error!")
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { user_id } = req.params

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user_id))

    if (!existingUser) {
      throw new Error("User does not exist!")
    }

    if (existingUser.stripe_customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: existingUser.stripe_customer_id,
        status: "active",
      })

      if (subscriptions.data.length > 0) {
        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id)
        }
      }
    }

    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.user_id, user_id))

    if (links) {
      for (let i = 0; i < userLinks.length; i++) {
        if (userLinks[i].image_public_id) {
          const deleteResult = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(
              userLinks[i].image_public_id as string,
              (error, result) => {
                if (error) return reject(error)
                resolve(result)
              }
            )
          })

          if (!deleteResult) {
            throw new Error("Failed to delete link image")
          }
        }
      }
    }

    if (existingUser.image_public_id) {
      const deleteResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(
          existingUser.image_public_id as string,
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
      })

      if (!deleteResult) {
        throw new Error("Failed to delete user image")
      }
    }

    const pinecone = new Pinecone()
    const pineconeIndexName = process.env.PINECONE_INDEX

    if (!pineconeIndexName) {
      throw new Error("PINECONE_INDEX environment variable is not set.")
    }

    const index = pinecone.Index(pineconeIndexName)

    const vectorRecords = await db
      .select()
      .from(files)
      .where(eq(files.user_id, user_id))

    const vectorIdsToDelete = vectorRecords.map((record) => record.id)

    if (vectorIdsToDelete.length) {
      await index.deleteMany(vectorIdsToDelete)
    }

    const deleteUser = await db.delete(users).where(eq(users.id, user_id))

    if (!deleteUser) {
      throw new Error("Failed to delete user")
    }

    return res.status(200).send(deleteUser)
  } catch (error) {
    console.error(error)
    return res.status(500).send("Error!")
  }
}
