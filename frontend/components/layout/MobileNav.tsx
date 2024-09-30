"use client"

import React from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { LogOut, MenuIcon, UserIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User } from "next-auth"
import { CurrentUser, SidebarNavLink, UserSheetLink } from "@/types"
import { Icons } from "../shared/Icons"
import Link from "next/link"
import { signOut } from "next-auth/react"
import Upgrade from "../dialogs/Upgrade"

interface MobileNavProps {
  currentUser: User
  links?: SidebarNavLink[]
  userLinks?: UserSheetLink[]
}

export default function MobileNav({
  currentUser,
  links,
  userLinks,
}: MobileNavProps) {
  return (
    <div className="flex sticky top-0 p-2 bg-background lg:hidden items-center justify-between border-2 shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-fit">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="mb-4">MyAI</SheetTitle>
          {links?.map((link, index) => {
            const Icon = Icons[link.icon || "home"]
            return (
              link.href && (
                <SheetClose key={index} asChild>
                  <Link
                    className="flex mt-2 items-center dark:hover:bg-slate-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                    href={link.disabled ? "/" : link.href}
                  >
                    <Icon className="mr-2 size-4" />
                    <p className="font-semibold text-sm">{link.title}</p>
                  </Link>
                </SheetClose>
              )
            )
          })}
          <div className="mt-2">
            <Upgrade currentUser={currentUser as CurrentUser} />
          </div>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Avatar className="w-12 h-12">
            <AvatarImage src={currentUser.image as string} alt="Avatar image" />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent
          className="min-w-[380px] flex flex-col items-center justify-center"
          side="bottom"
        >
          <div className="hidden lg:flex flex-col -space-y-1">
            {userLinks?.map((link, index) => {
              const Icon = Icons[link.icon || "home"]
              return (
                link.href && (
                  <SheetClose key={index} asChild>
                    <Link
                      className="flex mt-2 items-center dark:hover:bg-slate-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                      href={link.disabled ? "/" : link.href}
                    >
                      <Icon className="mr-2 size-4" />
                      <p
                        onClick={() => link.title === "Log Out" && signOut()}
                        className="font-semibold text-md"
                      >
                        {link.title}
                      </p>
                    </Link>
                  </SheetClose>
                )
              )
            })}
          </div>
          <SheetClose className="block lg:hidden" asChild>
            <Link
              className="flex mt-2 items-center dark:hover:bg-slate-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              href="/"
            >
              <LogOut className="mr-2 size-4" />
              <p onClick={() => signOut()} className="font-semibold text-md">
                Log Out
              </p>
            </Link>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  )
}
