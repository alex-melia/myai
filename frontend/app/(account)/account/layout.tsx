import { auth } from "@/auth"
import DashboardNav from "@/components/layout/DashboardNav"
import MobileNav from "@/components/layout/MobileNav"
import { SidebarNavLink, UserSheetLink } from "@/types"
import Link from "next/link"
import { redirect } from "next/navigation"

interface AccountLayoutProps {
  children: React.ReactNode
}

export const runtime = "edge"

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  if (!session.user.initialised) {
    redirect("/welcome")
  }

  const navLinks: SidebarNavLink[] = [
    {
      title: "Return to Dashboard",
      href: "/dashboard",
      icon: "arrowLeft",
      disabled: false,
    },
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
      href: "/dashboard/settings",
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
