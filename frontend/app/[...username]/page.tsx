import { auth } from "@/auth"
import InterestTag from "@/components/ai-chat/InterestTag"
import Landscape from "@/components/ai-chat/Landscape"
import SocialTag from "@/components/ai-chat/SocialTag"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserByUsername } from "@/lib/user"
import { cn } from "@/lib/utils"
import { ArrowLeft, UserIcon } from "lucide-react"
import { User } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import Portrait from "@/components/ai-chat/Portrait"
import { db } from "@/db"
import {
  interface_settings,
  links,
  theme_settings,
  socials,
  analytics,
} from "@/db/schema"
import { eq, InferSelectModel, sql } from "drizzle-orm"
import { Background, Layout } from "@/types"

interface UsernamePageProps {
  params: {
    username: string
  }
}

export const runtime = "edge"

type Social = InferSelectModel<typeof socials>

export default async function UsernamePage({ params }: UsernamePageProps) {
  const username = params.username[0]

  if (!username || params.username.length !== 1) {
    redirect("/dashboard")
  }

  const session = await auth()
  const user = await getUserByUsername(username)

  if (!user) {
    redirect("/dashboard")
  }

  const [interfaceSettings] = await db
    .select()
    .from(interface_settings)
    .where(eq(interface_settings.user_id, user.id))
    .limit(1)

  const [themeSettings] = await db
    .select()
    .from(theme_settings)
    .where(eq(theme_settings.user_id, user.id))
    .limit(1)

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.user_id, user.id))

  const userSocials = await db
    .select()
    .from(socials)
    .where(eq(socials.user_id, user.id))

  if (!interfaceSettings || !themeSettings) {
    redirect("/dashboard")
  }

  async function logVisitor() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}api/analytics/${user?.id}`
      )

      if (!res.ok) {
        console.error("Failed to log visitor")
      }
    } catch (error) {
      console.error(error)
    }
  }

  await logVisitor()

  await db
    .update(analytics)
    .set({
      hit_count: sql`${analytics.hit_count} + 1`,
    })
    .where(eq(analytics.user_id, user.id))

  return (
    <>
      {session?.user && session?.user.username == username ? (
        <Link href="/dashboard" className="fixed top-4 left-4 z-40">
          <div className="flex items-center gap-2 bg-green-500 font-semibold text-white rounded-lg p-2">
            <ArrowLeft />
            <span className="hidden sm:block">Return to Dashboard</span>
          </div>
        </Link>
      ) : !themeSettings.disable_branding ? (
        <Link href="/" className="fixed top-4 left-4 z-40">
          <img src="/logo.png" className="w-[72px] sm:w-[128px]" />
        </Link>
      ) : null}

      {themeSettings.base_layout === Layout.LANDSCAPE.toString() ? (
        <Landscape
          user={user}
          themeSettings={themeSettings}
          interfaceSettings={interfaceSettings}
          currentUser={session?.user as User}
          links={userLinks}
          userSocials={userSocials}
        />
      ) : (
        <>
          <div
            className="fixed top-0 w-screen h-screen z-10"
            style={{
              backgroundColor:
                themeSettings.background_style ===
                Background.SOLID_COLOR.toString()
                  ? (themeSettings.background_color as string) // Use background color for solid colors
                  : "transparent", // Default to transparent if not solid color
              backgroundImage:
                themeSettings.background_style ===
                Background.GRADIENT.toString()
                  ? `${themeSettings.background_gradient_type?.toLowerCase()}-gradient(${
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
              color: themeSettings.text_color
                ? themeSettings.text_color
                : "black",
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
              currentUser={session?.user as User}
              links={userLinks}
            />
          </div>
        </>
      )}
    </>
  )
}
