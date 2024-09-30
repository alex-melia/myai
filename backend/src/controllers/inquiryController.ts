import { Request, Response } from "express"
import { Resend } from "resend"
import pug from "pug"
import path from "path"
import { db } from "../db"
import { analytics, inquiries, users } from "../db/schema"
import { eq } from "drizzle-orm"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function createInquiry(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { userPrompt, inquiringUser, inquiringUserEmail } = req.body

    console.log(user_id)
    console.log(userPrompt)
    console.log(inquiringUser)
    console.log(inquiringUserEmail)

    if (!user_id || !userPrompt) {
      return res.status(400).json({ error: "No username or userPrompt" })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, user_id))
      .limit(1)

    if (!user || !user.username || !user.email) {
      return res.status(400).json({ error: "No user exists" })
    }

    if (inquiringUser) {
      await db
        .insert(inquiries)
        .values({
          user_id: user_id,
          inquiring_user_id: inquiringUser.id,
          inquiring_user_email: inquiringUserEmail,
          question: userPrompt,
        })
        .returning()
    } else {
      await db
        .insert(inquiries)
        .values({
          user_id: user_id,
          inquiring_user_email: inquiringUserEmail,
          question: userPrompt,
        })
        .returning()
    }

    const currentAnalytics = await db
      .select({
        inquiries_initiated: analytics.inquiries_initiated,
      })
      .from(analytics)
      .where(eq(analytics.user_id, user_id))
      .limit(1)

    const currentInquiries = currentAnalytics[0]?.inquiries_initiated ?? 0 // Default to 0 if not found

    await db
      .update(analytics)
      .set({
        inquiries_initiated: currentInquiries + 1,
      })
      .where(eq(analytics.user_id, user_id))

    const templatePath = path.resolve(__dirname, "../emails/inquiry.pug")
    const htmlContent = pug.renderFile(templatePath, {
      name: user.username,
      userPrompt: userPrompt,
      inquiringUserName: inquiringUser?.username,
      inquiringUserEmail: inquiringUserEmail,
    })

    const { data, error } = await resend.emails.send({
      from: "MyAI <noreply@myai.bio>",
      to: [user.email],
      subject: "You received an inquiry!",
      html: htmlContent,
    })

    if (error) {
      return console.error({ error })
    }

    return res.status(200).send("Inquiry sent")
  } catch (err) {
    console.error(err)
    return res.status(500).send("Error")
  }
}

export async function sendResponse(req: Request, res: Response) {
  try {
    const { inquiry_id } = req.params
    const { answer, inquiringUserEmail, currentUserName } = req.body

    if (!inquiry_id || !answer) {
      return res.status(400).json({ error: "No inquiry_id or answer" })
    }

    const updatedInquiry = await db
      .update(inquiries)
      .set({
        answer: answer,
      })
      .where(eq(inquiries.id, inquiry_id))

    const templatePath = path.resolve(__dirname, "../emails/answer.pug")
    const htmlContent = pug.renderFile(templatePath, {
      answer: answer,
      currentUserName: currentUserName,
      inquiringUserEmail: inquiringUserEmail,
    })

    const { data, error } = await resend.emails.send({
      from: "MyAI <noreply@myai.bio>",
      to: [inquiringUserEmail],
      subject: "Your inquiry has been answered!",
      html: htmlContent,
    })

    if (error) {
      return console.error({ error })
    }

    return res.status(201).send(updatedInquiry)
  } catch (err) {
    console.error(err)
    return res.status(500).send("Error!")
  }
}
