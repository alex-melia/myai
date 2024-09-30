import Pricing from "@/components/sections/Pricing"
import React from "react"

export const runtime = "edge"

export default function PricingPage() {
  return (
    <div className="flex flex-col w-full">
      <Pricing />
    </div>
  )
}
