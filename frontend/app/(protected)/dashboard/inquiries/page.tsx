import { auth } from "@/auth"
import InquiriesGrid from "@/components/inquiries/InquiriesGrid"
import { db } from "@/db"
import { inquiries, users } from "@/db/schema"
import { eq, InferSelectModel } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import { redirect } from "next/navigation"

export const runtime = "edge"

type Inquiry = InferSelectModel<typeof inquiries>
type User = InferSelectModel<typeof users>

interface ReceivedInquiry {
  id: string
  question: string
  answer: string | null
  user_id: string
  email: string
  inquiring_user: User
}

interface SentInquiry {
  id: string
  question: string
  answer: string | null
  receiving_user: User
  inquiring_user: User
}

export default async function InquiriesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/dashboard")
  }

  const inquiringUser = alias(users, "inquiring_user")

  const receivedInquiries = await db
    .select({
      id: inquiries.id,
      question: inquiries.question,
      answer: inquiries.answer,
      user_id: users.id,
      email: users.email,
      inquiring_user_email: inquiries.inquiring_user_email,
      inquiring_user: {
        id: inquiringUser.id,
        email: inquiringUser.email,
        name: inquiringUser.name,
        username: inquiringUser.username,
        image: inquiringUser.image,
      },
    })
    .from(inquiries)
    .leftJoin(users, eq(inquiries.user_id, users.id))
    .leftJoin(inquiringUser, eq(inquiries.inquiring_user_id, inquiringUser.id))
    .where(eq(inquiries.user_id, session.user.id))
    .execute()

  const sentInquiries = await db
    .select({
      id: inquiries.id,
      question: inquiries.question,
      answer: inquiries.answer,
      receiving_user: {
        id: users.id,
        email: users.email,
        name: users.name,
        username: users.username,
        image: users.image,
      },
      inquiring_user: {
        id: inquiringUser.id,
        email: inquiringUser.email,
        name: inquiringUser.name,
        username: inquiringUser.username,
        image: inquiringUser.image,
      },
    })
    .from(inquiries)
    .leftJoin(users, eq(inquiries.user_id, users.id)) // Join with users for the recipient (user_id)
    .leftJoin(inquiringUser, eq(inquiries.inquiring_user_id, inquiringUser.id)) // Join with alias for inquiring user
    .where(eq(inquiries.inquiring_user_id, session.user.id)) // Filter by the inquiring user (the sender)
    .execute()

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">Inquiries</h1>
      <InquiriesGrid
        currentUser={session?.user}
        receivedInquiries={receivedInquiries}
        sentInquiries={sentInquiries}
      />
    </div>
  )
}
