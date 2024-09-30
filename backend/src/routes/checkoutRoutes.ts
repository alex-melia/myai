import express from "express"
import { updateInterface } from "../controllers/interfaceController"

const router = express.Router()

router.post("/create-checkout-session", updateInterface)

export { router as checkoutRoutes }
