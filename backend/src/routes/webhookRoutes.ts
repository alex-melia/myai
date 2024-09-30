import express from "express"
import { createWebhook } from "../controllers/webhookController"

const router = express.Router()

router.post("/", express.raw({ type: "application/json" }), createWebhook)

export { router as webhookRoutes }
