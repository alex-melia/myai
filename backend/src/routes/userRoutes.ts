import express from "express"
import {
  updateUser,
  deleteUser,
  initialiseUser,
  sendCode,
  signUp,
  verifyEmail,
  verifyEmailToken,
} from "../controllers/userController"
import multer from "multer"
import { checkExisting } from "../controllers/themeController"

const upload = multer()
const router = express.Router()

router.get("/check-existing/:username", checkExisting)
router.post("/signup", signUp)
router.post("/", upload.single("file"), updateUser)
router.post("/verify-emailt", verifyEmailToken)
router.post("/verify-email/:user_id", verifyEmail)
router.post("/send-code/:user_id", sendCode)
router.put("/:user_id", upload.single("file"), initialiseUser)
router.delete("/:user_id", deleteUser)

export { router as userRoutes }
