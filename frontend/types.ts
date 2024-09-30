// import { SubscriptionStatus } from "@prisma/client/edge"
import { Icons } from "./components/shared/Icons"
import { SubscriptionStatusEnum } from "./db/schema"

export type SidebarNavLink = {
  title: string
  href: string
  disabled?: boolean
  icon?: keyof typeof Icons
}

export type UserSheetLink = {
  title: string
  href?: string
  disabled?: boolean
  icon?: keyof typeof Icons
}
export enum SubscriptionStatus {
  "NONE",
  "ACTIVE",
  "INCOMPLETE",
  "INCOMPLETE_EXPIRED",
  "TRIALING",
  "PAST_DUE",
  "CANCELED",
  "UNPAID",
}

export type CurrentUser = {
  id: string
  email: string
  tokens: number
  username: string
  subscription_status: typeof SubscriptionStatusEnum
}

export enum Leniency {
  VERY_LOOSE = "VERY_LOOSE",
  LOOSE = "LOOSE",
  DEFAULT = "DEFAULT",
  STRICT = "STRICT",
  VERY_STRICT = "VERY_STRICT",
}

export enum Personality {
  DEFAULT = "DEFAULT",
  BUBBLY = "BUBBLY",
  QUIRKY = "QUIRKY",
  UWU = "UWU",
  TALKATIVE = "TALKATIVE",
  PROFESSIONAL = "PROFESSIONAL",
  CHILL = "CHILL",
  SASSY = "SASSY",
  ACADEMIC = "ACADEMIC",
}

export enum Theme {
  DEFAULT = "DEFAULT",
  LIGHT = "LIGHT",
  DARK = "DARK",
  RETRO = "RETRO",
  MODERN = "MODERN",
}
export enum Pattern {
  NONE = "NONE",
  SQUIGGLES = "SQUIGGLES",
  DOODLES = "DOODLES",
  PARTY = "PARTY",
  LOVEHEARTS = "LOVEHEARTS",
}

export enum LightDarkTheme {
  SYSTEM = "SYSTEM",
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export enum AutonomyLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Font {
  DEFAULT = "DEFAULT",
  ARIAL = "ARIAL",
}

export enum Background {
  DEFAULT = "DEFAULT",
  SOLID_COLOR = "SOLID_COLOR",
  IMAGE = "IMAGE",
  GRADIENT = "GRADIENT",
  PATTERN = "PATTERN",
}

export enum Border {
  DEFAULT = "DEFAULT",
  SQUARE = "SQUARE",
}

export enum Layout {
  DEFAULT = "DEFAULT",
  LANDSCAPE = "LANDSCAPE",
}

export enum MobileLayout {
  DEFAULT = "DEFAULT",
  CAROUSEL = "CAROUSEL",
  TAB = "TAB",
  MODAL = "MODAL",
}

export enum DisplayRender {
  CHAT = "CHAT",
  LINKS = "LINKS",
}

export enum GradientType {
  LINEAR = "LINEAR",
  RADIAL = "RADIAL",
}

export enum Bold {
  DEFAULT = "DEFAULT",
  LIGHT = "LIGHT",
  SEMIBOLD = "SEMIBOLD",
  BOLD = "BOLD",
}

export enum Socials {
  X = "X",
  INSTAGRAM = "INSTAGRAM",
  LINKEDIN = "LINKEDIN",
  REDDIT = "REDDIT",
  EMAIL = "EMAIL",
  YOUTUBE = "YOUTUBE",
  TIKTOK = "TIKTOK",
  FACEBOOK = "FACEBOOK",
  SPOTIFY_USER = "SPOTIFY_USER",
  SPOTIFY_ARTIST = "SPOTIFY_ARTIST",
  TELEGRAM = "TELEGRAM",
  WHATSAPP = "WHATSAPP",
  SNAPCHAT = "SNAPCHAT",
  WEBSITE = "WEBSITE",
  THREADS = "THREADS",
  CUSTOM = "CUSTOM",
}
