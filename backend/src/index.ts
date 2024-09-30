import fs from "fs"
import https from "https"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { fileRoutes } from "./routes/fileRoutes"
import { chatRoutes } from "./routes/chatRoutes"
import { interfaceRoutes } from "./routes/interfaceRoutes"
import { checkoutRoutes } from "./routes/checkoutRoutes"
import { webhookRoutes } from "./routes/webhookRoutes"
import { themeRoutes } from "./routes/themeRoutes"
import { inquiryRoutes } from "./routes/inquiryRoutes"
import { userRoutes } from "./routes/userRoutes"
import { analyticsRoutes } from "./routes/analyticsRoutes"
import { linkRoutes } from "./routes/linkRoutes"
import { socialRoutes } from "./routes/socialRoutes"

dotenv.config()

const app = express()

let sslOptions

if (process.env.NODE_ENV === "production") {
  sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/api.myai.bio/privkey.pem",
      "utf8"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/api.myai.bio/fullchain.pem",
      "utf8"
    ),
  }
}

app.use(
  cors({
    allowedHeaders: "*",
    origin: "https://myai.bio",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
)

app.use("/api/webhooks", webhookRoutes)

app.use(express.json())

app.use("/api/files", fileRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/interfaces", interfaceRoutes)
app.use("/api/themes", themeRoutes)
app.use("/api/checkouts", checkoutRoutes)
app.use("/api/inquiries", inquiryRoutes)
app.use("/api/users", userRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/links", linkRoutes)
app.use("/api/socials", socialRoutes)

app.all("*", async (req, res) => {
  return res.status(404).json("Route not found")
})

const port = process.env.PORT

if (process.env.NODE_ENV === "development") {
  try {
    app.listen(3002, () => {
      console.log(`Server running on port 3002`)
    })
  } catch (err) {
    console.log(err)
  }
} else {
  try {
    https.createServer(sslOptions as object, app).listen(port, () => {
      console.log(`Server running on https://api.myai.bio:${port}`)
    })
  } catch (err) {
    console.log(err)
  }
}
