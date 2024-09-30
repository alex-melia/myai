import { Request, Response } from "express"
import PdfParse from "pdf-parse"
import { OpenAIEmbeddings } from "@langchain/openai"
import { Pinecone } from "@pinecone-database/pinecone"
import { PineconeStore } from "@langchain/pinecone"
import { Document } from "@langchain/core/documents"
import { db } from "../db"
import { eq } from "drizzle-orm"
import { files } from "../db/schema"

export async function getFiles(req: Request, res: Response) {
  try {
    const { user_id } = req.params

    const userFiles = await db
      .select()
      .from(files)
      .where(eq(files.user_id, user_id))

    return res.status(200).send(userFiles)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}

export async function createFile(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { title, text } = req.body
    const file = req.file

    if (!file && !text) {
      return res.status(400).json({ error: "No file or text uploaded" })
    }

    if (!title) {
      return res.status(400).json({ error: "No title was specified" })
    }

    let extractedText = ""

    if (file && file.mimetype === "application/pdf") {
      const pdfData = await PdfParse(file.buffer)
      extractedText = pdfData.text
    } else if (file && file.mimetype === "text/plain") {
      extractedText = file.buffer.toString()
    }

    if (text) {
      extractedText = text
    }

    const embeddings = new OpenAIEmbeddings()

    const pinecone = new Pinecone()

    const pineconeIndexName = process.env.PINECONE_INDEX
    if (!pineconeIndexName) {
      throw new Error("PINECONE_INDEX environment variable is not set.")
    }

    const pineconeIndex = pinecone.Index(pineconeIndexName)

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    })

    let documentId = ""
    if (extractedText) {
      const sendRes = await vectorStore.addDocuments([
        new Document({
          pageContent: extractedText,
          metadata: {
            user_id: user_id,
            text: extractedText,
          },
        }),
      ])
      if (sendRes && sendRes.length > 0) {
        documentId = sendRes[0]
      }
    }

    const [newFile] = await db
      .insert(files)
      .values({
        id: documentId,
        user_id: user_id,
        title: title,
        type: text ? "txt" : "pdf",
        size: (file && file.size.toString()) || "0",
      })
      .returning()

    return res.status(200).send(newFile)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}

export async function deleteFile(req: Request, res: Response) {
  try {
    const { file_id } = req.params

    const pinecone = new Pinecone()

    const pineconeIndexName = process.env.PINECONE_INDEX
    if (!pineconeIndexName) {
      throw new Error("PINECONE_INDEX environment variable is not set.")
    }

    const pineconeIndex = pinecone.Index(pineconeIndexName)

    await pineconeIndex.deleteOne(`${file_id}`)

    const deleteFile = await db.delete(files).where(eq(files.id, file_id))

    return res.status(200).send(deleteFile)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
