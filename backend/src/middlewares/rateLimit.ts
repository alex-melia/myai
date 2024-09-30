import { NextFunction, Request, RequestHandler, Response } from "express"
import rateLimit from "express-rate-limit"
import { db } from "../db"
import { interface_settings } from "../db/schema"
import { eq } from "drizzle-orm"
const userRateLimiters: { [key: string]: RequestHandler } = {}

export const LeniencyEnum = [
  "VERY_LOOSE",
  "LOOSE",
  "DEFAULT",
  "STRICT",
  "VERY_STRICT",
] as const
export type LeniencyEnumType = (typeof LeniencyEnum)[number]

function getRateLimitConfig(leniency: LeniencyEnumType) {
  switch (leniency) {
    case "VERY_LOOSE":
      return { windowMs: 60 * 1000, max: 64 }
    case "LOOSE":
      return { windowMs: 60 * 1000, max: 32 }
    case "DEFAULT":
      return { windowMs: 60 * 1000, max: 16 }
    case "STRICT":
      return { windowMs: 60 * 1000, max: 8 }
    case "VERY_STRICT":
      return { windowMs: 60 * 1000, max: 4 }
    default:
      return { windowMs: 60 * 1000, max: 16 }
  }
}

export async function getUserRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user_id = req.params.user_id

  const [interfaceSettings] = await db
    .select()
    .from(interface_settings)
    .where(eq(interface_settings.user_id, user_id))
    .limit(1)

  const leniency: LeniencyEnumType =
    interfaceSettings && interfaceSettings.rate_limit
      ? interfaceSettings.rate_limit
      : "DEFAULT"

  if (!userRateLimiters[user_id]) {
    const rateLimitConfig = getRateLimitConfig(leniency)

    userRateLimiters[user_id] = rateLimit({
      windowMs: rateLimitConfig.windowMs,
      max: rateLimitConfig.max,
      message:
        "Sorry, you have sent too many requests at this time. Please try again later.",
    })
  }

  return userRateLimiters[user_id](req, res, next)
}
