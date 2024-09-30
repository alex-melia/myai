"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React, { useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "../ui/use-toast"
import { Card, CardContent } from "../ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Spinner } from "../ui/spinner"
import { InferSelectModel } from "drizzle-orm"
import { links } from "@/db/schema"

type Link = InferSelectModel<typeof links>

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

interface UpdateLinkFormProps {
  link: Link
}

export default function UpdateLinkForm({ link }: UpdateLinkFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
      title: link.title as string,
      url: link.url as string,
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("url", values.url)
      formData.append("title", values.title)
      if (values.file) {
        formData.append("file", values.file)
      }

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}api/links/${link.id}`,
        {
          method: "PUT",
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
    })
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

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-center">
              <Button className={cn(isPending && "disabled")} type="submit">
                {isPending ? <Spinner /> : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
