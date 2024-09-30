import {
  pgTable,
  varchar,
  integer,
  text,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const LeniencyEnum = pgEnum("leniency_enum", [
  "VERY_LOOSE",
  "LOOSE",
  "DEFAULT",
  "STRICT",
  "VERY_STRICT",
])
export const PersonalityEnum = pgEnum("personality_enum", [
  "DEFAULT",
  "BUBBLY",
  "QUIRKY",
  "UWU",
  "TALKATIVE",
  "PROFESSIONAL",
  "CHILL",
  "SASSY",
  "ACADEMIC",
])
export const ThemeEnum = pgEnum("theme_enum", [
  "DEFAULT",
  "LIGHT",
  "DARK",
  "RETRO",
  "MODERN",
])
export const PatternEnum = pgEnum("pattern_enum", [
  "NONE",
  "SQUIGGLES",
  "DOODLES",
  "PARTY",
  "LOVEHEARTS",
])
export const LightDarkThemeEnum = pgEnum("light_dark_theme_enum", [
  "SYSTEM",
  "LIGHT",
  "DARK",
])
export const AutonomyLevelEnum = pgEnum("autonomy_level_enum", [
  "LOW",
  "MEDIUM",
  "HIGH",
])
export const SubscriptionStatusEnum = pgEnum("subscription_status_enum", [
  "NONE",
  "ACTIVE",
  "INCOMPLETE",
  "INCOMPLETE_EXPIRED",
  "TRIALING",
  "PAST_DUE",
  "CANCELED",
  "UNPAID",
])
export const FontEnum = pgEnum("font_enum", ["DEFAULT", "ARIAL"])
export const BackgroundEnum = pgEnum("background_enum", [
  "DEFAULT",
  "SOLID_COLOR",
  "IMAGE",
  "GRADIENT",
  "PATTERN",
])
export const BorderEnum = pgEnum("border_enum", ["DEFAULT", "SQUARE"])
export const LayoutEnum = pgEnum("layout_enum", ["DEFAULT", "LANDSCAPE"])
export const MobileLayoutEnum = pgEnum("mobile_layout_enum", [
  "DEFAULT",
  "CAROUSEL",
  "TAB",
  "MODAL",
])
export const DisplayRenderEnum = pgEnum("display_render_enum", [
  "CHAT",
  "LINKS",
])
export const GradientTypeEnum = pgEnum("gradient_type_enum", [
  "LINEAR",
  "RADIAL",
])
export const BoldEnum = pgEnum("bold_enum", [
  "DEFAULT",
  "LIGHT",
  "SEMIBOLD",
  "BOLD",
])
export const SocialsEnum = pgEnum("socials_enum", [
  "X",
  "INSTAGRAM",
  "LINKEDIN",
  "REDDIT",
  "EMAIL",
  "YOUTUBE",
  "TIKTOK",
  "FACEBOOK",
  "SPOTIFY_USER",
  "SPOTIFY_ARTIST",
  "TELEGRAM",
  "WHATSAPP",
  "SNAPCHAT",
  "WEBSITE",
  "THREADS",
  "CUSTOM",
])

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email").unique(),
  new_email: varchar("new_email").unique(),
  email_verified: timestamp("email_verified"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  password: varchar("password"),
  headline: varchar("headline"),
  intro_message: varchar("intro_message"),
  name: varchar("name"),
  username: varchar("username").unique(),
  image: varchar("image"),
  image_public_id: varchar("image_public_id"),
  initialised: boolean("initialised").default(false),
  tokens: integer("tokens").default(25000),
  interests: text("interests").array(),
  stripe_customer_id: varchar("stripe_customer_id").unique(),
  stripe_subscription_id: varchar("stripe_subscription_id").unique(),
  stripe_price_id: varchar("stripe_price_id"),
  stripe_current_period_end: timestamp("stripe_current_period_end"),
  subscription_status: varchar("subscription_status").default("NONE"),
})

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  type: varchar("type"),
  provider: varchar("provider"),
  providerAccountId: varchar("providerAccountId"),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type"),
  scope: varchar("scope"),
  id_token: text("id_token"),
  session_state: varchar("session_state"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
})

export const verification_tokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email"),
    token: varchar("token"),
    expires: timestamp("expires"),
  },
  (table) => ({
    uniqueEmailToken: uniqueIndex("email_token").on(table.email, table.token),
  })
)

export const verification_codes = pgTable(
  "verification_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email"),
    code: integer("code"),
    expires: timestamp("expires"),
  },
  (table) => ({
    uniqueEmailCode: uniqueIndex("email_code").on(table.email, table.code),
  })
)

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  title: varchar("title"),
  url: varchar("url"),
  image: varchar("image"),
  image_public_id: varchar("image_public_id"),
})

export const socials = pgTable("socials", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  account_name: varchar("account_name"),
  name: SocialsEnum("name"),
  url: varchar("url"),
})

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  title: varchar("title"),
  type: varchar("type"),
  size: varchar("size"),
  image_public_id: varchar("image_public_id"),
})

export const interface_settings = pgTable("interface_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  max_input_length: integer("max_input_length").default(200),
  max_response_length: integer("max_response_length").default(1000),
  enable_inquiries: boolean("enable_inquiries").default(true),
  rate_limit: LeniencyEnum("rate_limit").default("DEFAULT"),
  theme: ThemeEnum("theme").default("DEFAULT"),
  personality: PersonalityEnum("personality").default("DEFAULT"),
  behaviour: LeniencyEnum("behaviour").default("DEFAULT"),
  autonomy: AutonomyLevelEnum("autonomy").default("MEDIUM"),
  context_settings: jsonb("context_settings"),
})

export const theme_settings = pgTable("theme_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  background_style: BackgroundEnum("background_style").default("DEFAULT"),
  background_color: varchar("background_color").default(""),
  background_gradient: varchar("background_gradient").default(""),
  background_gradient_type: GradientTypeEnum(
    "background_gradient_type"
  ).default("LINEAR"),
  background_gradient_from: varchar("background_gradient_from").default(""),
  background_gradient_to: varchar("background_gradient_to").default(""),
  background_image: varchar("background_image").default(""),
  background_image_public_id: varchar("background_image_public_id").default(""),
  theme: ThemeEnum("theme").default("DEFAULT"),
  pattern: PatternEnum("pattern").default("NONE"),
  text_font: FontEnum("text_font").default("DEFAULT"),
  text_color: varchar("text_color").default(""),
  base_layout: LayoutEnum("base_layout").default("DEFAULT"),
  mobile_layout: MobileLayoutEnum("mobile_layout").default("DEFAULT"),
  display_on_render: DisplayRenderEnum("display_on_render").default("CHAT"),
  input_background: boolean("input_background").default(false),
  chat_background: boolean("chat_background").default(false),
  chat_background_color: varchar("chat_background_color").default(""),
  chat_background_opacity: integer("chat_background_opacity").default(0),
  chat_text_bold: BoldEnum("chat_text_bold").default("DEFAULT"),
  display_interests: boolean("display_interests").default(true),
  display_links: boolean("display_links").default(true),
  avatar_squared: boolean("avatar_squared").default(false),
  brand_colors_enabled: boolean("brand_colors_enabled").default(true),
  brand_color_primary: varchar("brand_color_primary").default(""),
  brand_color_secondary: varchar("brand_color_secondary").default(""),
  disable_branding: boolean("disable_branding").default(false),
})

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  inquiring_user_id: uuid("inquiring_user_id"),
  inquiring_user_email: varchar("inquiring_user_email"),
  question: text("question"),
  answer: text("answer"),
})

export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  hit_count: integer("hit_count").default(0),
  avg_tokens_per_request: integer("avg_tokens_per_request").default(0),
  total_tokens_used: integer("total_tokens_used").default(0),
  min_tokens_per_request: integer("min_tokens_per_request").default(0),
  max_tokens_per_request: integer("max_tokens_per_request").default(0),
  last_request_at: timestamp("last_request_at"),
  messages_received: integer("messages_received").default(0),
  inquiries_initiated: integer("inquiries_initiated").default(0),
  browser_data: jsonb("browser_data"),
  os_data_data: jsonb("os_data_data"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
})

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
export type InsertInquiry = typeof inquiries.$inferInsert
export type SelectInquiry = typeof inquiries.$inferSelect
