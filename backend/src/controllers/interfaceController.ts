import { Request, Response } from "express"
import { db } from "../db"
import { interface_settings } from "../db/schema"
import { eq } from "drizzle-orm"

export async function updateInterface(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const {
      max_input_length,
      max_response_length,
      enable_inquiries,
      rate_limit,
      theme,
      personality,
      behaviour,
      autonomy,
    } = req.body

    const updatedInterface = await db
      .update(interface_settings)
      .set({
        max_input_length: max_input_length,
        max_response_length: max_response_length,
        rate_limit: rate_limit,
        theme: theme,
        personality: personality,
        enable_inquiries: enable_inquiries,
        behaviour: behaviour,
        autonomy: autonomy,
      })
      .where(eq(interface_settings.user_id, user_id))

    if (!updatedInterface)
      return res.status(500).send("Error updating interface settings")

    return res.status(200).send(updatedInterface)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}
