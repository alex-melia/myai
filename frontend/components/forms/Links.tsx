"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "next-auth"

import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
  file: z
    .instanceof(File, {
      message: "Please upload a valid file.",
    })
    .optional(),
  title: z
    .string()
    .min(1, {
      message: "Title cannot be empty",
    })
    .max(32, {
      message: "Title must be no more than 32 characters",
    }),
  url: z
    .string()
    .min(1, {
      message: "URL cannot be empty",
    })
    .max(32, {
      message: "URL must be no more than 24 characters",
    }),
})

interface LinksFormProps {
  currentUser: User
}

export default function LinksForm({ currentUser }: LinksFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
      title: "",
      url: "",
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    formData.append("url", values.url)
    formData.append("title", values.title)
    if (values.file) {
      formData.append("file", values.file)
    }

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/links/${currentUser.id}`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!result) {
      toast({
        title: "Profile Update Failed",
      })
    } else {
      toast({
        title: "Profile Updated",
      })
      router.refresh()
    }
    router.refresh()
  }

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="flex flex-col gap-2 items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center gap-2">
                      <FormDescription>An image for your link</FormDescription>
                      <Input
                        className="max-w-[300px]"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            field.onChange(file)
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Add your URL</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-center">
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
