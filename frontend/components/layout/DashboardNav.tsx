import React from "react"
import { Icons } from "../shared/Icons"
import { SidebarNavLink } from "@/types"
import Link from "next/link"
import UserNav from "./UserNav"
import { auth } from "@/auth"
import Upgrade from "../dialogs/Upgrade"
import { redirect } from "next/navigation"

interface DashboardNavProps {
  currentUser: any
  links?: SidebarNavLink[]
}

export default async function DashboardNav({
  currentUser,
  links,
}: DashboardNavProps) {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {links?.map((link, index) => {
            const Icon = Icons[link.icon || "home"]
            return (
              link.href && (
                <Link
                  key={index}
                  href={link.disabled ? "/" : link.href}
                  className="flex items-center dark:hover:bg-slate-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                  <Icon className="mr-2 size-4" />
                  <p className="font-semibold text-sm">{link.title}</p>
                </Link>
              )
            )
          })}
          <Upgrade currentUser={user} />
        </nav>
      </div>
      <UserNav currentUser={currentUser} />
    </>
  )
}
