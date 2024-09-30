import { auth } from "@/auth"
import ProfileForm from "@/components/forms/Profile"
import { db } from "@/db"
import { socials, users } from "@/db/schema"
import { eq, InferSelectModel } from "drizzle-orm"
import { redirect } from "next/navigation"

type User = InferSelectModel<typeof users>

export const runtime = "edge"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  const [currentUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user.id))

  const userSocials = await db
    .select()
    .from(socials)
    .where(eq(socials.user_id, session?.user.id))

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
        <h3 className="font-light">Update your profile details</h3>
      </div>
      <div className="flex items-center mt-4 justify-center">
        <ProfileForm currentUser={currentUser as User} socials={userSocials} />
      </div>
    </div>
  )
}
