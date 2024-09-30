import express from "express"
import {
  createLink,
  deleteLink,
  updateLink,
} from "../controllers/linkController"
import multer from "multer"

const upload = multer()
const router = express.Router()

router.post("/:user_id", upload.single("file"), createLink)
router.put("/:link_id", upload.single("file"), updateLink)
router.delete("/:link_id", deleteLink)

export { router as linkRoutes }
