import express from "express"
import { sendMessage } from "../controllers/chatController"
import { getUserRateLimiter } from "../middlewares/rateLimit"

const router = express.Router()

router.post("/:user_id", getUserRateLimiter, sendMessage)

export { router as chatRoutes }
