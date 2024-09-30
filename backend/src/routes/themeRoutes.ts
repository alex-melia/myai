import express from "express"
import { addImage, updateTheme } from "../controllers/themeController"
import multer from "multer"

const upload = multer()
const router = express.Router()

router.put("/:user_id", updateTheme)
router.put("/image/:user_id", upload.single("file"), addImage)

export { router as themeRoutes }
