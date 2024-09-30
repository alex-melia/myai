import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import React, { Suspense } from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export const runtime = "edge"

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback="...">
        <Navbar />
      </Suspense>
      <main className="flex max-w-[600px] w-full items-center justify-center container min-h-[calc(100vh-88px)]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
