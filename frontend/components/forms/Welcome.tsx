"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserIcon } from "lucide-react"
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name cannot be blank",
    })
    .max(24, {
      message: "Name must be no more than 24 characters",
    }),
  username: z.string(),
  file: z
    .instanceof(File, {
      message: "Please upload a valid file.",
    })
    .optional(),
  headline: z
    .string()
    .min(1, {
      message: "Headline cannot be blank",
    })
    .max(64, {
      message: "Headline must be no more than 64 characters",
    }),
  interests: z
    .array(z.string())
    .min(3, { message: "Must have at least 3 interests" })
    .max(5, { message: "No more than 5 interests" }),
  introMessage: z
    .string()
    .min(1, {
      message: "Intro message cannot be blank",
    })
    .max(300, {
      message: "Intro message must be no more than 300 characters",
    }),
})

interface WelcomeFormProps {
  currentUser: User
}

export default function WelcomeForm({ currentUser }: WelcomeFormProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [usernameExists, setUsernameExists] = useState(false)
  const [interests, setInterests] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState<string>("")
  const router = useRouter()

  if (!currentUser) {
    router.push("/")
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
      name: "",
      username: "",
      headline: "",
      interests: [],
      introMessage: "",
    },
  })

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault()
      if (!interests.includes(currentTag) && interests.length < 5) {
        form.setValue("interests", [...interests, currentTag.trim()])
        setInterests([...interests, currentTag.trim()])
        setCurrentTag("") // Reset the input after adding the tag
      }
    }
  }

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      "interests",
      interests.filter((interest) => interest !== tag)
    )
    setInterests(interests.filter((interest) => interest !== tag))
  }

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    if (currentUser.id) {
      formData.append("id", currentUser.id)
    }
    formData.append("name", values.name)
    formData.append("username", values.username)
    formData.append("headline", values.headline)
    formData.append("introMessage", values.introMessage)
    formData.append("interests", JSON.stringify(values.interests))
    if (values.file) {
      formData.append("file", values.file)
    }

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/users/${currentUser.id}`,
      {
        method: "PUT",
        body: formData,
      }
    )

    if (!result.ok) {
      toast({
        title: "Initialisation Unsuccessful",
      })
    } else {
      toast({
        title: "Profile Initialised",
        description: "You will now be redirected to the dashboard.",
      })

      router.push("/dashboard")

      setTimeout(() => {
        router.refresh()
      }, 500)
    }
  }

  async function checkExisting(username: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/users/check-existing/${username}`,
      {
        method: "GET",
      }
    )

    if (!res) {
      toast({
        title: "Profile Update Failed",
      })
    } else {
      const exists = await res.json()
      setUsernameExists(exists as boolean)
      router.refresh()
    }
  }

  return (
    <Card className="max-w-[600px] w-full">
      <CardHeader className="text-center">
        <CardTitle>About You</CardTitle>
        <CardDescription>We just need a few details</CardDescription>
      </CardHeader>
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
                      <Avatar className="w-32 h-32">
                        <AvatarImage
                          src={avatarUrl as string}
                          alt="User Avatar"
                        />
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                      <FormDescription>An image always helps</FormDescription>
                      <Input
                        className="max-w-[300px]"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            field.onChange(file)
                            const fileURL = URL.createObjectURL(file)
                            setAvatarUrl(fileURL)
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={currentUser?.name as string}
                      defaultValue={currentUser?.name as string}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded-md px-2 w-fit">
                      <p className="text-sm">myai.bio/</p>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        className="border-none px-0"
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          checkExisting(e.target.value)
                        }}
                      />
                    </div>
                  </FormControl>
                  {usernameExists && (
                    <p className="text-red-500 text-sm">
                      Username already in use
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Founder of BlueprintSEO | Specialist in SEO & Web Development"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tell your visitors who you are
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {interests.map((tag, index) => (
                          <div
                            key={index}
                            className="bg-gray-200 px-2 py-1 rounded-md flex items-center space-x-2"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-red-500"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add interest and press Enter"
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Press Enter to add up to 5 interests
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="introMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intro Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hey, welcome to my page! My name is Tony and I am the founder of BlueprintSEO. What can I help you with?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give your visitors a warm welcome!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-center">
              <Button type="submit" disabled={usernameExists}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
