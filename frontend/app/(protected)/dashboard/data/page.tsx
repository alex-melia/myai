import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AddFileForm from "@/components/forms/AddFile"
import FileGridFull from "@/components/files/FileGridFull"
import { files } from "@/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/db"

export const runtime = "edge"

export default async function DataPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  const userFiles = await db
    .select()
    .from(files)
    .where(eq(files.user_id, session?.user.id))

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-lg font-semibold md:text-2xl">Data</h1>
      <h3 className="font-light">View, update and delete your data</h3>
      {userFiles?.length ? (
        <div className="mt-4 flex flex-col md:grid grid-cols-4 gap-2">
          <FileGridFull
            initialFiles={userFiles}
            username={session?.user.username}
          />
        </div>
      ) : (
        <div className="xl:absolute xl:top-24 xl:bottom-0 flex flex-col items-center justify-center w-full">
          <div className="xl:absolute inset-0 mx-auto gap-2 flex flex-col text-center items-center justify-center">
            <div className="flex flex-col text-center leading-2">
              <h1 className="text-lg font-semibold md:text-2xl">
                You have no data
              </h1>
              <h3 className="font-light">Add data to get started</h3>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Data</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[800px]">
                <DialogHeader className="items-center">
                  <DialogTitle className="text-4xl tracking-tighter">
                    Add Data
                  </DialogTitle>
                  <DialogDescription className="text-md tracking-tighter">
                    Add data to train your personal AI
                  </DialogDescription>
                </DialogHeader>
                <AddFileForm user_id={session.user.id} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  )
}
