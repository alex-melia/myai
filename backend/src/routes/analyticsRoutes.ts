import express from "express"
import { logVisitor } from "../controllers/analyticsController"

const router = express.Router()

router.get("/:user_id", logVisitor)

export { router as analyticsRoutes }
