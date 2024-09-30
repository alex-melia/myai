import express from "express"
import {
  createSocial,
  deleteSocial,
  updateSocial,
} from "../controllers/socialController"

const router = express.Router()

router.post("/:user_id", createSocial)
router.put("/:social_id", updateSocial)
router.delete("/:social_id", deleteSocial)

export { router as socialRoutes }
