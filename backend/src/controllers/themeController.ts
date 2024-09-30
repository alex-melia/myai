import { Request, Response } from "express"
import cloudinary from "cloudinary"
import { db } from "../db"
import { theme_settings, users } from "../db/schema"
import { eq, ilike } from "drizzle-orm"

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function updateTheme(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { value, field } = req.body

    let updatedTheme

    switch (field) {
      case "base_layout":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            base_layout: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "mobile_layout":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            mobile_layout: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "brand_colors":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            brand_color_primary: value.brand_color_primary,
            brand_color_secondary: value.brand_color_primary,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "brand_colors_enabled":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            brand_colors_enabled: value.brand_colors_enabled,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "pattern":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            pattern: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "background_gradient_type":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            background_gradient_type: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "background_style":
        const updateData: any = {
          background_style: value.background_style,
        }

        if (value.background_color !== null) {
          updateData.background_color = value.background_color
        }

        if (value.background_gradient_from !== null) {
          updateData.background_gradient_from = value.background_gradient_from
        }

        if (value.background_gradient_to !== null) {
          updateData.background_gradient_to = value.background_gradient_to
        }

        if (value.background_gradient_type !== null) {
          updateData.background_gradient_type = value.background_gradient_type
        }

        updatedTheme = await db
          .update(theme_settings)
          .set({
            background_style: value.background_style,
            background_color: value.background_color,
            background_gradient_from: value.background_gradient_from,
            background_gradient_to: value.background_gradient_to,
            background_gradient_type: value.background_gradient_type,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "text_font":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            text_font: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "text_color":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            text_color: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break

      case "display_on_render":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            display_on_render: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "display_interests":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            display_interests: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "display_links":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            display_links: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "disable_branding":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            disable_branding: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "chat_background":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            chat_background: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "chat_background_style":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            chat_background_color: value.chat_background_color,
            chat_background_opacity: value.chat_background_opacity,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      case "avatar_squared":
        updatedTheme = await db
          .update(theme_settings)
          .set({
            avatar_squared: value,
          })
          .where(eq(theme_settings.user_id, user_id))
        break
      default:
        "No field supplied"
    }

    if (!updatedTheme)
      return res.status(500).send("Error updating theme settings")

    return res.status(200).send(updatedTheme)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export async function addImage(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { field } = req.body
    const image = req.file

    let imageUrl = ""
    let imagePublicId = ""

    const [existingTheme] = await db
      .select()
      .from(theme_settings)
      .where(eq(theme_settings.user_id, user_id))

    if (image) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ folder: "user_avatars" }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })
          .end(image.buffer)
      })

      if (!uploadResult) {
        throw new Error("Failed to upload image")
      }

      if (existingTheme?.background_image_public_id) {
        const deleteResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.destroy(
            existingTheme.background_image_public_id as string,
            (error, result) => {
              if (error) return reject(error)
              resolve(result)
            }
          )
        })

        if (!deleteResult) {
          throw new Error("Failed to delete background image")
        }
      }

      imageUrl = uploadResult.secure_url
      imagePublicId = uploadResult.public_id
    }

    if (!imageUrl || !imagePublicId) {
      throw new Error("Failed to update image")
    }

    const updatedSettings = await db
      .update(theme_settings)
      .set({
        background_image: imageUrl,
        background_image_public_id: imagePublicId,
      })
      .where(eq(theme_settings.user_id, user_id))

    if (!updatedSettings) {
      throw new Error("Failed to update image")
    }

    return res.status(200).send(updatedSettings)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export async function checkExisting(req: Request, res: Response) {
  try {
    const { username } = req.params

    const banned = ["dashboard", "login", "register", "account", "blog"]

    if (banned.includes(username.toLowerCase())) {
      return res.status(200).send(true)
    }

    const [existingUsername] = await db
      .select()
      .from(users)
      .where(ilike(users.username, username))
      .limit(1)

    if (existingUsername) {
      return res.status(200).send(true)
    } else {
      return res.status(200).send(false)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}
