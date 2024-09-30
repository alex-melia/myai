DO $$ BEGIN
 CREATE TYPE "public"."autonomy_level_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."background_enum" AS ENUM('DEFAULT', 'SOLID_COLOR', 'IMAGE', 'GRADIENT', 'PATTERN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."bold_enum" AS ENUM('DEFAULT', 'LIGHT', 'SEMIBOLD', 'BOLD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."border_enum" AS ENUM('DEFAULT', 'SQUARE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."display_render_enum" AS ENUM('CHAT', 'LINKS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."font_enum" AS ENUM('DEFAULT', 'ARIAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gradient_type_enum" AS ENUM('LINEAR', 'RADIAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."layout_enum" AS ENUM('DEFAULT', 'LANDSCAPE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."leniency_enum" AS ENUM('VERY_LOOSE', 'LOOSE', 'DEFAULT', 'STRICT', 'VERY_STRICT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."light_dark_theme_enum" AS ENUM('SYSTEM', 'LIGHT', 'DARK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."mobile_layout_enum" AS ENUM('DEFAULT', 'CAROUSEL', 'TAB', 'MODAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pattern_enum" AS ENUM('NONE', 'SQUIGGLES', 'DOODLES', 'PARTY', 'LOVEHEARTS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."personality_enum" AS ENUM('DEFAULT', 'BUBBLY', 'QUIRKY', 'UWU', 'TALKATIVE', 'PROFESSIONAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."socials_enum" AS ENUM('X', 'INSTAGRAM', 'LINKEDIN', 'REDDIT', 'EMAIL', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'SPOTIFY_USER', 'SPOTIFY_ARTIST', 'TELEGRAM', 'WHATSAPP', 'SNAPCHAT', 'WEBSITE', 'THREADS', 'CUSTOM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscription_status_enum" AS ENUM('NONE', 'ACTIVE', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'PAST_DUE', 'CANCELED', 'UNPAID');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."theme_enum" AS ENUM('DEFAULT', 'LIGHT', 'DARK', 'RETRO', 'MODERN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar,
	"provider" varchar,
	"providerAccountId" varchar,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar,
	"scope" varchar,
	"id_token" text,
	"session_state" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"hit_count" integer DEFAULT 0,
	"avg_tokens_per_request" integer DEFAULT 0,
	"total_tokens_used" integer DEFAULT 0,
	"min_tokens_per_request" integer DEFAULT 0,
	"max_tokens_per_request" integer DEFAULT 0,
	"last_request_at" timestamp,
	"messages_received" integer DEFAULT 0,
	"inquiries_initiated" integer DEFAULT 0,
	"browser_data" jsonb,
	"os_data_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "analytics_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" varchar,
	"type" varchar,
	"size" varchar,
	"image_public_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"inquiring_user_id" uuid,
	"inquiring_user_email" varchar,
	"question" text,
	"answer" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interface_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"max_input_length" integer DEFAULT 200,
	"max_response_length" integer DEFAULT 1000,
	"enable_inquiries" boolean DEFAULT true,
	"rate_limit" "leniency_enum" DEFAULT 'DEFAULT',
	"theme" "theme_enum" DEFAULT 'DEFAULT',
	"personality" "personality_enum" DEFAULT 'DEFAULT',
	"behaviour" "leniency_enum" DEFAULT 'DEFAULT',
	"autonomy" "autonomy_level_enum" DEFAULT 'MEDIUM',
	"context_settings" jsonb,
	CONSTRAINT "interface_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" varchar,
	"url" varchar,
	"image" varchar,
	"image_public_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "socials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"account_name" varchar,
	"name" "socials_enum",
	"url" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "theme_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"background_style" "background_enum" DEFAULT 'DEFAULT',
	"background_color" varchar DEFAULT '',
	"background_gradient" varchar DEFAULT '',
	"background_gradient_type" "gradient_type_enum" DEFAULT 'LINEAR',
	"background_gradient_from" varchar DEFAULT '',
	"background_gradient_to" varchar DEFAULT '',
	"background_image" varchar DEFAULT '',
	"background_image_public_id" varchar DEFAULT '',
	"theme" "theme_enum" DEFAULT 'DEFAULT',
	"pattern" "pattern_enum" DEFAULT 'NONE',
	"text_font" "font_enum" DEFAULT 'DEFAULT',
	"text_color" varchar DEFAULT '',
	"base_layout" "layout_enum" DEFAULT 'DEFAULT',
	"mobile_layout" "mobile_layout_enum" DEFAULT 'DEFAULT',
	"display_on_render" "display_render_enum" DEFAULT 'CHAT',
	"input_background" boolean DEFAULT false,
	"chat_background" boolean DEFAULT false,
	"chat_background_color" varchar DEFAULT '',
	"chat_background_opacity" integer DEFAULT 0,
	"chat_text_bold" "bold_enum" DEFAULT 'DEFAULT',
	"display_interests" boolean DEFAULT true,
	"display_links" boolean DEFAULT true,
	"avatar_squared" boolean DEFAULT false,
	"brand_colors_enabled" boolean DEFAULT true,
	"brand_color_primary" varchar DEFAULT '',
	"brand_color_secondary" varchar DEFAULT '',
	"disable_branding" boolean DEFAULT false,
	CONSTRAINT "theme_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"new_email" varchar,
	"email_verified" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"password" varchar,
	"headline" varchar,
	"intro_message" varchar,
	"name" varchar,
	"username" varchar,
	"image" varchar,
	"image_public_id" varchar,
	"initialised" boolean DEFAULT false,
	"tokens" integer DEFAULT 5000,
	"interests" text[],
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"stripe_price_id" varchar,
	"stripe_current_period_end" timestamp,
	"subscription_status" varchar DEFAULT 'NONE',
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_new_email_unique" UNIQUE("new_email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "users_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"code" integer,
	"expires" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"token" varchar,
	"expires" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interface_settings" ADD CONSTRAINT "interface_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "socials" ADD CONSTRAINT "socials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "theme_settings" ADD CONSTRAINT "theme_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_code" ON "verification_codes" USING btree ("email","code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_token" ON "verification_tokens" USING btree ("email","token");