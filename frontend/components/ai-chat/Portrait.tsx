"use client"

import { User as AuthUser } from "next-auth"
import { Avatar, AvatarImage } from "../ui/avatar"
import { EllipsisVertical } from "lucide-react"
import ChatContainer from "./ChatContainer"
import { useState } from "react"
import Link from "next/link"
import { InferSelectModel } from "drizzle-orm"
import { interface_settings, links, theme_settings, users } from "@/db/schema"
import { DisplayRender } from "@/types"

type User = InferSelectModel<typeof users>
type ThemeSettings = InferSelectModel<typeof theme_settings>
type InterfaceSettings = InferSelectModel<typeof interface_settings>
type LinkType = InferSelectModel<typeof links>

interface PortraitProps {
  user: User
  themeSettings: ThemeSettings
  interfaceSettings: InterfaceSettings
  currentUser: AuthUser
  links: LinkType[]
}

export default function Portrait({
  user,
  themeSettings,
  interfaceSettings,
  currentUser,
  links,
}: PortraitProps) {
  const [showLinks, setShowLinks] = useState(
    links.length
      ? themeSettings.display_on_render === DisplayRender.LINKS.toString()
      : false
  )
  const [showChat, setShowChat] = useState(
    links.length
      ? themeSettings.display_on_render === DisplayRender.CHAT.toString()
      : true
  )

  return (
    <>
      {links.length > 0 && (
        <div className="flex justify-center gap-4 mx-auto max-w-[200px] w-full">
          <div
            onClick={() => {
              setShowChat(!showChat)
              setShowLinks(!showLinks)
            }}
            className="rounded-xl p-2 px-4 cursor-pointer"
            style={{
              backgroundColor:
                themeSettings.brand_colors_enabled &&
                themeSettings.brand_color_primary
                  ? themeSettings.brand_color_primary
                  : "#ffffff",
            }}
          >
            <p className="font-bold uppercase">Chat</p>
          </div>
          <div
            onClick={() => {
              setShowChat(!showChat)
              setShowLinks(!showLinks)
            }}
            className="rounded-xl p-2 px-4 cursor-pointer"
            style={{
              backgroundColor:
                themeSettings.brand_colors_enabled &&
                themeSettings.brand_color_primary
                  ? themeSettings.brand_color_primary
                  : "#ffffff",
            }}
          >
            <p className="font-bold uppercase">Links</p>
          </div>
        </div>
      )}
      {showChat ? (
        <>
          <ChatContainer
            user={user}
            interfaceSettings={interfaceSettings}
            themeSettings={themeSettings}
            currentUser={currentUser}
          />
        </>
      ) : (
        <div className="flex flex-col gap-4 my-4">
          {links.map((link: LinkType) => (
            <Link
              className="flex relative justify-center text-center w-full bg-white z-40 shadow-xl border-2 rounded-xl p-4"
              key={link.id}
              href={link.url as string}
            >
              <div className="flex justify-between items-center w-full">
                <Avatar className="w-8 h-8 rounded-sm">
                  <AvatarImage src={link.image as string} />
                </Avatar>
                <p className="font-bold uppercase justify-center">
                  {link.title}
                </p>
                <EllipsisVertical />
              </div>
            </Link>
          ))}
          <Link
            href="/"
            style={{ color: "black" }}
            className={
              "flex justify-center p-4 my-4 w-fit mx-auto rounded-full"
            }
          >
            <p className="font-semibold w-fit">Join {user.name} on MyAI</p>
          </Link>
        </div>
      )}
    </>
  )
}
