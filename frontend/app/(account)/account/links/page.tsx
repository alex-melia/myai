import { auth } from "@/auth"
import LinksForm from "@/components/forms/Links"
import { CurrentUser } from "@/types"
import { redirect } from "next/navigation"
import React from "react"

export const runtime = "edge"

export default async function LinksPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  const currentUser = session?.user

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
      <div className="flex items-center justify-center h-full">
        <LinksForm currentUser={currentUser as CurrentUser} />
      </div>
    </div>
  )
}
