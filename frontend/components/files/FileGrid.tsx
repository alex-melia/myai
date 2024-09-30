"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import { convertFileSize } from "@/lib/utils"
import { InferSelectModel } from "drizzle-orm"
import { files } from "@/db/schema"

export type File = InferSelectModel<typeof files>

interface FileGridProps {
  initialFiles: File[]
  username: string
}

export default function FileGrid({ initialFiles, username }: FileGridProps) {
  const [files, setFiles] = useState<File[]>(initialFiles)

  async function deleteFile(fileId: string, username: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}api/files/${fileId}?username=${username}`,
        {
          method: "DELETE",
        }
      )

      if (res.ok) {
        setFiles(files.filter((file) => file.id !== fileId))
        console.log("File deleted successfully")
      } else {
        console.log("Error deleting file")
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return (
    <>
      {files.length > 0 ? (
        files.slice(0, 4).map((file) => (
          <Card key={file.id} className="mb-4 w-full h-fit">
            <CardHeader className="p-2 md:p-2">
              <CardTitle className="text-md">{file.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-2 pt-0">
              <p>Type: {file.type}</p>
              <p>Size: {convertFileSize(file.size as string)}</p>
            </CardContent>
            <CardFooter className="flex justify-end p-2 md:p-2 pt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Delete</Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center">
                  <CardHeader className="items-center">
                    <CardTitle className="text-2xl">Delete Data</CardTitle>
                    <CardDescription>
                      Are you sure you want to delete this file?
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-4 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Go Back</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={() => deleteFile(file.id, username)}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </CardFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500">No files available.</p>
      )}
    </>
  )
}
