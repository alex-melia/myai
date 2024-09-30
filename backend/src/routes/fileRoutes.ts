import express from "express"
import { createFile, deleteFile, getFiles } from "../controllers/fileController"
import multer from "multer"

const upload = multer()

const router = express.Router()

router.get("/:user_id", getFiles)
router.post("/:user_id", upload.single("file"), createFile)
router.delete("/:file_id", deleteFile)

export { router as fileRoutes }
