import { auth } from "@/auth"
import DeleteAccount from "@/components/dialogs/DeleteAccount"
import SettingsForm from "@/components/forms/Settings"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CurrentUser } from "@/types"
import { redirect } from "next/navigation"
import React from "react"

export const runtime = "edge"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  const currentUser = session?.user
  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <h3 className="font-light">Manage your email and account</h3>
      </div>
      <div className="container mt-4 flex flex-col items-center gap-8 text-center first-letter:mx-auto max-w-[800px] w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="tracking-tighter">Account Settings</CardTitle>
          </CardHeader>
          <SettingsForm currentUser={currentUser as CurrentUser} />
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="tracking-tighter">Danger Zone</CardTitle>
            <CardDescription>
              Deleted accounts cannot be retrieved and you will not be eligible
              for any refunds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DeleteAccount currentUser={currentUser as CurrentUser} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
