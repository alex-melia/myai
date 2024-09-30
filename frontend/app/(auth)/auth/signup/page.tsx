import SignUpForm from "@/components/forms/SignUp"

import React from "react"

export const runtime = "edge"

export default async function SignupPage() {
  return (
    <div className="flex flex-col max-w-[600px] w-full items-center">
      <SignUpForm />
    </div>
  )
}
