"use client"

import { User as AuthUser } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import InterestTag from "./InterestTag"
import SocialTag from "./SocialTag"
import { UserIcon } from "lucide-react"
import ChatContainer from "./ChatContainer"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"
import Portrait from "./Portrait"
import { InferSelectModel } from "drizzle-orm"
import {
  interface_settings,
  links,
  socials,
  theme_settings,
  users,
} from "@/db/schema"
import { Background, DisplayRender } from "@/types"

type User = InferSelectModel<typeof users>
type ThemeSettings = InferSelectModel<typeof theme_settings>
type InterfaceSettings = InferSelectModel<typeof interface_settings>
type Social = InferSelectModel<typeof socials>
type LinkType = InferSelectModel<typeof links>

interface LandscapeProps {
  user: User
  themeSettings: ThemeSettings
  interfaceSettings: InterfaceSettings
  currentUser: AuthUser
  links: LinkType[]
  userSocials: Social[]
}

export default function Landscape({
  user,
  themeSettings,
  interfaceSettings,
  currentUser,
  links,
  userSocials,
}: LandscapeProps) {
  const [showLinks, setShowLinks] = useState(
    themeSettings.display_on_render === DisplayRender.LINKS.toString()
  )
  const [showChat, setShowChat] = useState(
    themeSettings.display_on_render === DisplayRender.CHAT.toString()
  )
  return (
    <>
      <div className="lg:block hidden">
        <div
          className="fixed top-0 w-screen h-screen z-10"
          style={{
            backgroundColor:
              themeSettings.background_style ===
              Background.SOLID_COLOR.toString()
                ? (themeSettings.background_color as string)
                : "transparent",
            backgroundImage:
              themeSettings.background_style === Background.GRADIENT.toString()
                ? `${themeSettings.background_gradient_type
                    ?.toString()
                    .toLowerCase()}-gradient(${
                    themeSettings.background_gradient_from
                  }, ${themeSettings.background_gradient_to})`
                : "none",
          }}
        ></div>
        <div
          style={{
            color: themeSettings.text_color
              ? themeSettings.text_color
              : "black",
          }}
          className="grid grid-flow-col gap-8 grid-cols-8 container max-h-screen h-full relative z-40"
        >
          <div className="flex flex-col items-center justify-center col-span-3 h-screen">
            <div className="flex flex-col items-center justify-center gap-2 my-4">
              <Avatar
                className={cn(
                  themeSettings.avatar_squared && "rounded-md",
                  "w-32 h-32"
                )}
              >
                {user.image && (
                  <AvatarImage
                    className={cn(themeSettings.avatar_squared && "rounded-md")}
                    src={user.image}
                  ></AvatarImage>
                )}
                <AvatarFallback
                  className={cn(themeSettings.avatar_squared && "rounded-md")}
                >
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <span className="font-bold text-4xl">{user.name}</span>
              <span className="font-semibold tracking-wider text-center text-md">
                {user.headline}
              </span>
              {themeSettings.display_interests && (
                <div className="flex justify-between gap-2 w-full">
                  {user?.interests?.map((interest: string, index: number) => (
                    <InterestTag
                      key={index}
                      interest={interest}
                      themeSettings={themeSettings}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center justify-center gap-2 py-4">
                {userSocials.map((social: Social, index) => (
                  <SocialTag
                    key={index}
                    social={social}
                    themeSettings={themeSettings}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col custom-scrollbar items-center justify-center col-span-5 w-full h-screen py-24">
            <div className="flex justify-between w-full custom-scrollbar cursor-pointer">
              {links.length > 0 && (
                <>
                  <div className="flex w-full justify-center">
                    <div
                      style={{
                        backgroundColor: themeSettings.brand_color_primary
                          ? themeSettings.brand_color_primary
                          : "inherit",
                      }}
                      onClick={() => {
                        setShowChat(!showChat)
                        setShowLinks(!showLinks)
                      }}
                      className={cn("text-center rounded-full w-fit px-4 p-2")}
                    >
                      <p className="font-bold text-xl">Chat</p>
                    </div>
                  </div>
                  <div className="flex w-full justify-center">
                    <div
                      style={{
                        backgroundColor: themeSettings.brand_color_primary
                          ? themeSettings.brand_color_primary
                          : "inherit",
                      }}
                      onClick={() => {
                        setShowChat(!showChat)
                        setShowLinks(!showLinks)
                      }}
                      className={cn("text-center rounded-full w-fit px-4 p-2")}
                    >
                      <p className="font-bold text-xl">Links</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div
              className={cn(
                showChat ? "justify-end" : "p-8",
                "flex flex-col gap-2 w-full max-h-[800px] h-full   rounded-t-none rounded-b-xl shadow-lg"
              )}
              style={{
                backgroundColor:
                  showLinks && themeSettings && themeSettings.chat_background
                    ? `rgba(${parseInt(
                        (themeSettings.chat_background_color as string).slice(
                          1,
                          3
                        ),
                        16
                      )}, 
                       ${parseInt(
                         (themeSettings.chat_background_color as string).slice(
                           3,
                           5
                         ),
                         16
                       )}, 
                       ${parseInt(
                         (themeSettings.chat_background_color as string).slice(
                           5,
                           7
                         ),
                         16
                       )}, 
                       ${
                         (themeSettings.chat_background_opacity as number) / 100
                       })`
                    : "transparent",
              }}
            >
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
                <div className="flex flex-col p-4 gap-4 overflow-y-auto custom-scrollbar text-black h-full">
                  {links.map((link: LinkType) => (
                    <Link
                      className="flex relative justify-center text-center w-full bg-white z-40 shadow-xl border-2 rounded-xl p-4"
                      key={link.id}
                      href={link.url as string}
                    >
                      <Avatar className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm">
                        <AvatarImage src={link.image as string} />
                      </Avatar>
                      <p className="font-bold uppercase justify-center">
                        {link.title}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/"
              className={cn(
                themeSettings.background_style !== "DEFAULT"
                  ? "bg-white"
                  : `bg-[#${themeSettings.brand_color_primary}]`,
                "flex justify-center p-4 my-4 w-fit mx-auto rounded-full"
              )}
            >
              <p className="font-semibold w-fit">Join {user.name} on MyAI</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <>
          <div
            className="fixed top-0 w-screen h-screen z-10"
            style={{
              backgroundColor:
                themeSettings.background_style ===
                Background.SOLID_COLOR.toString()
                  ? (themeSettings.background_color as string)
                  : "transparent",
              backgroundImage:
                themeSettings.background_style ===
                Background.GRADIENT.toString()
                  ? `${themeSettings.background_gradient_type
                      ?.toString()
                      .toLowerCase()}-gradient(${
                      themeSettings.background_gradient_from
                    }, ${themeSettings.background_gradient_to})`
                  : themeSettings.background_style ===
                    Background.IMAGE.toString()
                  ? `url(${themeSettings.background_image})` // Set the image URL
                  : "none",
              backgroundSize:
                themeSettings.background_style === Background.IMAGE.toString()
                  ? "cover"
                  : "initial",
            }}
          ></div>
          <div
            className={cn(
              "flex flex-col container max-h-screen max-w-4xl w-full h-screen z-40 relative"
            )}
            style={{
              color: themeSettings.text_color || "inherit",
            }}
          >
            <div className="flex flex-col items-center gap-2 my-4">
              <Avatar
                className={cn(
                  themeSettings.avatar_squared && "rounded-xl",
                  "w-24 h-24"
                )}
              >
                {user.image && <AvatarImage src={user.image}></AvatarImage>}
                <AvatarFallback
                  className={cn(
                    themeSettings.avatar_squared && "rounded-xl",
                    "w-24 h-24"
                  )}
                >
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <span className="font-bold text-2xl">{user.name}</span>
              <span className="font-semibold text-center tracking-wider text-sm">
                {user.headline}
              </span>
            </div>
            {themeSettings.display_interests && (
              <div className="flex flex-wrap justify-center gap-2 mx-auto max-w-[500px] w-full">
                {user?.interests?.map((interest: string, index: number) => (
                  <InterestTag
                    key={index}
                    interest={interest}
                    themeSettings={themeSettings}
                  />
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-2 py-4">
              {userSocials.map((social: Social, index) => (
                <SocialTag
                  key={index}
                  social={social}
                  themeSettings={themeSettings}
                />
              ))}
            </div>
            <Portrait
              user={user}
              themeSettings={themeSettings}
              interfaceSettings={interfaceSettings}
              currentUser={currentUser}
              links={links}
            />
          </div>
        </>
      </div>
    </>
  )
}
