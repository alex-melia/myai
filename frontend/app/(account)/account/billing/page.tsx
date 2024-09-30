import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export const runtime = "edge"

export default async function BillingPage() {
  const session = await auth()
  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold md:text-2xl">Billing</h1>
        <h3 className="font-light">
          Manage your billing and subscription plans
        </h3>
      </div>
      <div className="container mt-4 flex flex-col items-center  gap-2 text-center first-letter:mx-auto max-w-[1200px] w-full">
        <p className="text-xl font-bold">Manage Billing</p>
        <Link
          href={`https://billing.stripe.com/p/login/bIY29JgbX1LC7n2144?prefilled_email=${session?.user.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>Billing portal</Button>
        </Link>
      </div>
    </div>
  )
}
