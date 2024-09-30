"use client"

import { SocialIcons } from "../shared/Icons"
import Link from "next/link"
import { InferSelectModel } from "drizzle-orm"
import { socials, theme_settings } from "@/db/schema"

type Social = InferSelectModel<typeof socials>
type ThemeSettings = InferSelectModel<typeof theme_settings>

interface SocialTagProps {
  social: Social
  themeSettings: ThemeSettings
}

type IconKey = keyof typeof SocialIcons

export default function SocialTag({ social, themeSettings }: SocialTagProps) {
  if (!themeSettings) {
    return
  }

  const iconKey = (social.name as string).toLowerCase() as IconKey

  if (!(iconKey in SocialIcons)) {
    return null
  }

  const SocialIcon = SocialIcons[iconKey]

  return (
    <Link
      href={social.url as string}
      className={"flex opacity-80 p-2 rounded-full"}
    >
      <SocialIcon size={24} className="z-10" />
    </Link>
  )
}
