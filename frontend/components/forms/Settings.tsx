"use client"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CardContent } from "../ui/card"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "../ui/use-toast"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { CurrentUser } from "@/types"

const FormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email cannot be blank",
    })
    .max(30, {
      message: "Email must be no more than 30 characters",
    }),
})

interface SettingsFormProps {
  currentUser: CurrentUser
}

export default function SettingsForm({ currentUser }: SettingsFormProps) {
  const router = useRouter()

  const [codeSent, setCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [newEmail, setNewEmail] = useState<string>("")

  if (!currentUser) {
    router.push("/")
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: currentUser?.email as string,
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const newEmail = values.email
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/users/send-code/${currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    )

    if (!result) {
      toast({
        title: "Settings Update Failed",
      })
    } else {
      setNewEmail(newEmail)
      setCodeSent(true)
    }
  }

  async function verifyCode() {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/users/verify-email/${currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          code: verificationCode,
        }),
      }
    )

    if (!result.ok) {
      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect.",
      })
    } else {
      toast({
        title: "Email updated",
        description: "Your email address has been updated successfully.",
      })
      window.location.reload()
    }
  }

  return (
    <CardContent className="flex flex-col items-start gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder={currentUser?.email as string}
                    defaultValue={currentUser?.email as string}
                    {...field}
                    disabled={codeSent}
                  />
                </FormControl>
                <FormDescription>Change your email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!codeSent ? (
            <div className="flex w-full justify-center">
              <Button type="submit">Update</Button>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-4">
              <div>
                <FormLabel>Verification Code</FormLabel>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter the code sent to your new email"
                />
              </div>
              <div className="flex w-full justify-center">
                <Button type="button" onClick={verifyCode}>
                  Verify Email
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </CardContent>
  )
}
