import express from "express"
import { updateInterface } from "../controllers/interfaceController"

const router = express.Router()

router.put("/:user_id", updateInterface)

export { router as interfaceRoutes }
