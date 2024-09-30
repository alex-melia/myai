import { auth } from "@/auth"
import WelcomeForm from "@/components/forms/Welcome"
import { redirect } from "next/navigation"

export const runtime = "edge"

export default async function WelcomePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  if (session.user.initialised) {
    redirect("/dashboard")
  }

  return (
    <div className="z-40 flex flex-col items-center justify-center min-h-screen container">
      <span className="font-bold text-4xl mb-8">Welcome to MyAI!</span>
      <WelcomeForm currentUser={session.user} />
    </div>
  )
}
//
