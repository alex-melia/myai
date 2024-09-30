import React, { Suspense } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

interface MarketingLayoutProps {
  children: React.ReactNode
}
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback="...">
        <Navbar />
      </Suspense>

      <main className="flex-1 min-h-screen">{children}</main>
      <Footer />
    </div>
  )
}
