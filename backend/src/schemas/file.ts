import { z } from "zod"

const FileSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  size: z.string(),
})

export { FileSchema }
