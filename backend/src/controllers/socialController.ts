import { Request, Response } from "express"
import { db } from "../db"
import { socials } from "../db/schema"
import { eq } from "drizzle-orm"

export async function createSocial(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { social_name, account_name } = req.body

    let fullUrl: string

    switch (social_name.toLowerCase()) {
      case "instagram":
      case "x":
      case "facebook":
      case "tiktok":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/${account_name}`
        break
      case "x":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/${account_name}`
        break
      case "facebook":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/${account_name}`
        break
      case "tiktok":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/${account_name}`
        break
      case "linkedin":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/in/${account_name}`
        break
      case "reddit":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/user/${account_name}`
        break
      case "spotify_artist":
        fullUrl = `http://open.spotify.com/artist/${account_name}`
        break
      case "spotify_user":
        fullUrl = `http://open.spotify.com/user/${account_name}`
        break
      case "telegram":
        fullUrl = `http://www.t.me/${account_name}`
        break
      case "youtube":
        fullUrl = `http://www.youtube.com/${account_name}`
        break
      case "whatsapp":
        fullUrl = `http://www.whatsapp.com/${account_name}`
        break
      case "snapchat":
        fullUrl = `http://www.snapchat.com/${account_name}`
        break
      case "website":
        fullUrl = `${account_name}`
        break
      case "threads":
        fullUrl = `http://www.threads.com/${account_name}`
        break
      case "email":
        fullUrl = `mail:to${account_name}`
        break
      default:
        fullUrl = "http://www.myai.bio"
        "No valid social name"
    }

    const newSocial = await db
      .insert(socials)
      .values({
        name: social_name,
        account_name: account_name,
        url: fullUrl as string,
        user_id: user_id,
      })
      .returning()

    return res.status(201).send(newSocial)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export async function updateSocial(req: Request, res: Response) {
  try {
    const { social_id } = req.params
    const { social_name, account_name } = req.body

    console.log(social_name)

    console.log(account_name)

    let fullUrl: string

    switch (social_name.toLowerCase()) {
      case "instagram":
      case "x":
      case "facebook":
      case "tiktok":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/${account_name}`
        break
      case "linkedin":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/in/${account_name}`
        break
      case "reddit":
        fullUrl = `http://www.${social_name.toLowerCase()}.com/user/${account_name}`
        break
      case "spotify_artist":
        fullUrl = `http://open.spotify.com/artist/${account_name}`
        break
      case "spotify_user":
        fullUrl = `http://open.spotify.com/user/${account_name}`
        break
      case "telegram":
        fullUrl = `http://www.t.me/${account_name}`
        break
      case "youtube":
        fullUrl = `http://www.youtube.com/${account_name}`
        break
      case "whatsapp":
        fullUrl = `http://www.whatsapp.com/${account_name}`
        break
      case "snapchat":
        fullUrl = `http://www.snapchat.com/${account_name}`
        break
      case "website":
        fullUrl = `${account_name}`
        break
      case "threads":
        fullUrl = `http://www.threads.com/${account_name}`
        break
      case "email":
        fullUrl = `mail:to${account_name}`
        break
      default:
        fullUrl = "http://www.myai.bio"
        "No valid social name"
    }

    const updatedSocial = await db
      .update(socials)
      .set({
        name: social_name,
        url: fullUrl,
        account_name: account_name,
      })
      .where(eq(socials.id, social_id))

    return res.status(201).send(updatedSocial)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export async function deleteSocial(req: Request, res: Response) {
  try {
    const { social_id } = req.params

    const deletedSocial = await db
      .delete(socials)
      .where(eq(socials.id, social_id))

    if (!deletedSocial) {
      throw new Error("Delete Social failed")
    }

    return res.status(201).send(deletedSocial)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}
