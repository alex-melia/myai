import { auth } from "@/auth"
import DashboardNav from "@/components/layout/DashboardNav"
import MobileNav from "@/components/layout/MobileNav"
import { SidebarNavLink, UserSheetLink } from "@/types"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  console.log("Request from layout component")
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  if (!session.user.initialised) {
    redirect("/welcome")
  }

  const navLinks: SidebarNavLink[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: "home",
      disabled: false,
    },
    {
      title: "Data",
      href: "/dashboard/data",
      icon: "data",
      disabled: false,
    },
    {
      title: "Inquiries",
      href: "/dashboard/inquiries",
      icon: "question",
      disabled: false,
    },
    {
      title: "Tokens",
      href: "/dashboard/tokens",
      icon: "coins",
      disabled: false,
    },
    {
      title: "My Page",
      href: `/${session?.user.username}`,
      icon: "arrowUpRight",
      disabled: false,
    },
  ]

  const userLinks: UserSheetLink[] = [
    {
      title: "Profile",
      href: "/account",
      icon: "user",
      disabled: false,
    },
    {
      title: "Billing",
      href: "/account/billing",
      icon: "creditCard",
      disabled: false,
    },
    {
      title: "Settings",
      href: "/account/settings",
      icon: "settings",
      disabled: false,
    },
    {
      title: "Log out",
      href: "/",
      icon: "logout",
      disabled: true,
    },
  ]

  return (
    <div
      suppressHydrationWarning
      className="flex flex-col lg:flex-row h-screen"
    >
      <MobileNav
        currentUser={session?.user}
        links={navLinks}
        userLinks={userLinks}
      />
      <aside className="hidden border-t bg-muted/40 lg:block w-full max-w-[220px]">
        <div className="flex border-r shadow-md flex-col gap-2 h-screen">
          <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <img src="/logo.png" width="104px" />
            </Link>
          </div>

          <DashboardNav currentUser={session.user} links={navLinks} />
        </div>
      </aside>
      <main className="flex flex-col flex-1 overflow-auto">{children}</main>
    </div>
  )
}
