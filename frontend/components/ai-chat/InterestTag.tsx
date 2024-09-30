"use client"

import { theme_settings } from "@/db/schema"
import { cn } from "@/lib/utils"
import { InferSelectModel } from "drizzle-orm"

type ThemeSettings = InferSelectModel<typeof theme_settings>
interface InterestTagProps {
  interest: string
  themeSettings: ThemeSettings
}

export default function InterestTag({
  interest,
  themeSettings,
}: InterestTagProps) {
  if (!themeSettings) {
    return
  }

  return (
    <span
      className={cn(
        "p-1 px-2 rounded-full font-semibold text-center text-sm tracking-tighter"
      )}
      style={{
        backgroundColor:
          themeSettings.brand_colors_enabled &&
          themeSettings.brand_color_primary
            ? themeSettings.brand_color_primary
            : "#ffffff",
      }}
    >
      {interest.toUpperCase()}
    </span>
  )
}
