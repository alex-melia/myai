import { Request, Response } from "express"
import UAParser from "ua-parser-js"
import { db } from "../db"
import { eq } from "drizzle-orm"
import { analytics } from "../db/schema"

export async function logVisitor(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const userAgent = req.headers["user-agent"]

    if (!userAgent) {
      return res.status(500).send("No user agent")
    }

    const parser = new UAParser()
    const uaResult = parser.setUA(userAgent).getResult()

    let browser = uaResult.browser.name || "Other"
    let os = uaResult.os.name || "Other"

    const validBrowsers = ["Chrome", "Safari", "Firefox"]
    const validOS = ["Windows"]

    if (!validBrowsers.includes(browser)) {
      browser = "Other"
    }

    if (!validOS.includes(os)) {
      os = "Other"
    }

    const [userAnalytics] = await db
      .select()
      .from(analytics)
      .where(eq(analytics?.user_id, user_id))
      .limit(1)

    if (!userAnalytics) {
      return res.status(404).send("Analytics record not found")
    }

    let browserData: any = (userAnalytics.browser_data as any) || {}
    let osData: any = (userAnalytics.os_data_data as any) || {}

    if (browser in browserData) {
      browserData[browser] = (browserData[browser] as number) + 1
    } else {
      browserData[browser] = 1
    }

    if (os in osData) {
      osData[os] = (osData[os] as number) + 1
    } else {
      osData[os] = 1
    }

    await db
      .update(analytics)
      .set({
        browser_data: browserData,
        os_data_data: osData,
      })
      .where(eq(analytics.user_id, user_id))

    return res.status(200).send({
      uaResult: uaResult,
      browse: browser,
      os: os,
      userAgent: userAgent,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}
