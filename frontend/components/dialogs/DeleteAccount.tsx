"use client"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { redirect } from "next/navigation"
import { toast } from "../ui/use-toast"
import { signOut } from "next-auth/react"
import { CurrentUser } from "@/types"

interface DeleteAccountProps {
  currentUser: CurrentUser
}

export default function DeleteAccount({ currentUser }: DeleteAccountProps) {
  async function deleteAccount(user_id: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}api/users/${user_id}`,
        {
          method: "DELETE",
        }
      )

      if (!res.ok) {
        toast({
          title: "Account Deletion Failed!",
        })
      } else {
        signOut()
        redirect("/")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <DialogHeader className="flex flex-col items-center space-y-0">
        <DialogTitle className="text-3xl tracking-tighter">
          Delete Account
        </DialogTitle>
        <DialogDescription>
          Deleted accounts cannot be retrieved and all data will be lost
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center space-y-2">
        <p className="font-semibold">
          Are you sure you want to delete your account?
        </p>
        <ul className="list-disc">
          <li>Your page will no longer be accessible</li>
          <li>Any pending or previous inquiries will be deleted</li>
          <li>All data used to train your AI will be deleted</li>
        </ul>
      </div>
      <DialogFooter>
        <Button
          onClick={() => deleteAccount(currentUser.id)}
          className="gap-2"
          variant="destructive"
        >
          <Trash />
          Delete Account
        </Button>
      </DialogFooter>
    </div>
  )
}
