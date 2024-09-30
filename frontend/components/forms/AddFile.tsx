"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Spinner } from "../ui/spinner"

const FormSchema = z.object({
  file: z
    .instanceof(File, {
      message: "Please upload a valid file.",
    })
    .optional(),
  title: z.string(),
  text: z.string().optional(),
})

interface WelcomeFormProps {
  user_id: string | null | undefined
}

export default function AddFileForm({ user_id }: WelcomeFormProps) {
  const router = useRouter()
  const [option, setOption] = useState("file")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
      title: "",
      text: "",
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const formData = new FormData()
      if (values.file) {
        formData.append("file", values.file)
      }
      if (values.title) {
        formData.append("title", values.title)
      }
      if (values.text) {
        formData.append("text", values.text)
      }
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}api/files/${user_id}`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (result.ok) {
        router.refresh()
        toast({
          title: "Your data was added",
        })
        form.reset()
      } else {
        toast({
          title: "Something went wrong.",
          description: "Your file was not added. Please try again.",
          variant: "destructive",
        })
      }
      router.refresh()
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
            <Card className="border-none shadow-none">
              <CardContent className="pt-4 space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Title</FormLabel>
                      <Input type="string" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center w-full gap-2 py-4">
                  <Button
                    className={cn(
                      option === "file" && "bg-blue-500 hover:bg-blue-700"
                    )}
                    onClick={() => setOption("file")}
                    type="button"
                  >
                    File
                  </Button>

                  <Button
                    className={cn(
                      option === "text" && "bg-blue-500 hover:bg-blue-700"
                    )}
                    onClick={() => setOption("text")}
                    type="button"
                  >
                    Text
                  </Button>
                </div>
                {option === "file" && (
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>File</FormLabel>
                        <Input
                          className="max-w-[300px]"
                          type="file"
                          accept=".pdf,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              field.onChange(file)
                            }
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {option === "text" && (
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Text</FormLabel>
                        <Textarea style={{ resize: "none" }} {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button disabled={isPending} type="submit">
                  {isPending ? <Spinner /> : "Add"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
