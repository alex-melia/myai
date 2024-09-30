import express from "express"
import { createInquiry, sendResponse } from "../controllers/inquiryController"

const router = express.Router()

router.post("/:user_id", createInquiry)
router.put("/:inquiry_id", sendResponse)

export { router as inquiryRoutes }
