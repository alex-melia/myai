import { Request, Response } from "express"
import cloudinary from "cloudinary"
import { db } from "../db"
import { links } from "../db/schema"
import { eq } from "drizzle-orm"

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function createLink(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { url, title } = req.body
    const image = req.file

    let imageUrl = ""
    let imagePublicId = ""

    if (image) {
      const result: any = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ folder: "user_avatars" }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })
          .end(image.buffer)
      })

      if (!result) {
        throw new Error("Failed to upload image!")
      }

      imageUrl = result.secure_url
      imagePublicId = result.public_id
    }

    const [newLink] = await db
      .insert(links)
      .values({
        user_id: user_id,
        image: imageUrl,
        title: title,
        url: url,
        image_public_id: imagePublicId,
      })
      .returning()

    if (!newLink) {
      throw new Error("Link creation failed")
    }

    return res.status(201).send(newLink)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export async function updateLink(req: Request, res: Response) {
  try {
    const { link_id } = req.params
    const { url, title } = req.body
    const image = req.file
    let imageUrl = ""
    let imagePublicId = ""

    const [existingLink] = await db
      .select()
      .from(links)
      .where(eq(links.id, link_id))

    if (!existingLink) {
      throw new Error("Link does not exist")
    }

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

      if (existingLink.image_public_id) {
        const deleteResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.destroy(
            existingLink.image_public_id as string,
            (error, result) => {
              if (error) return reject(error)
              resolve(result)
            }
          )
        })

        if (!deleteResult) {
          throw new Error("Failed to delete original image")
        }
      }

      imageUrl = uploadResult.secure_url
      imagePublicId = uploadResult.public_id
      await db
        .update(links)
        .set({
          url: url,
          title: title,
          image: imageUrl,
          image_public_id: imagePublicId,
        })
        .where(eq(links.id, existingLink.id))
    } else {
      await db
        .update(links)
        .set({
          url: url,
          title: title,
        })
        .where(eq(links.id, existingLink.id))
    }

    return res.status(201).send("Updated Link")
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}

export async function deleteLink(req: Request, res: Response) {
  try {
    const { link_id } = req.params

    const [deletedLink] = await db
      .delete(links)
      .where(eq(links.id, link_id))
      .returning()

    if (!deletedLink) {
      throw new Error("Failed to delete link")
    }

    if (deletedLink.image_public_id) {
      const deleteResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(
          deletedLink.image_public_id as string,
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
      })

      if (!deleteResult) {
        throw new Error("Failed to delete original image")
      }
    }

    return res.status(200).send(deletedLink)
  } catch (err) {
    console.error(err)
    return res.status(500).send()
  }
}
