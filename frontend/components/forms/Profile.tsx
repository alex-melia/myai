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

import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { SocialIcons } from "../shared/Icons"
import { socials, SocialsEnum, users } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"
import { Socials } from "@/types"

const FormSchema = z.object({
  file: z
    .instanceof(File, {
      message: "Please upload a valid file.",
    })
    .optional(),
  name: z
    .string()
    .min(1, {
      message: "Name cannot be empty",
    })
    .max(32, {
      message: "Name must be no more than 32 characters",
    }),
  username: z
    .string()
    .min(1, {
      message: "Username cannot be empty",
    })
    .max(32, {
      message: "Username must be no more than 24 characters",
    }),
  headline: z
    .string()
    .min(1, {
      message: "Headline cannot be blank",
    })
    .max(90, {
      message: "Headline must be no more than 90 characters",
    }),
  new_social: z.any(),
  social_name: z.nativeEnum(Socials),
  account_name: z.string(),
  introMessage: z
    .string()
    .min(1, {
      message: "Intro message cannot be blank",
    })
    .max(300, {
      message: "Intro message must be no more than 300 characters",
    }),
})

type User = InferSelectModel<typeof users>
type Social = InferSelectModel<typeof socials>

interface WelcomeFormProps {
  currentUser: User
  socials: Social[]
}

type IconKey = keyof typeof SocialIcons

export default function ProfileForm({
  currentUser,
  socials,
}: WelcomeFormProps) {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.image || "")
  const [usernameExists, setUsernameExists] = useState(false)
  const [editSocialId, setEditSocialId] = useState<string | null>(null)

  if (!currentUser) {
    router.push("/")
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
      name: currentUser?.name as string,
      username: currentUser?.username as string,
      headline: currentUser?.headline as string,
      new_social: null,
      social_name: Socials.INSTAGRAM,
      account_name: "",
      introMessage: currentUser?.intro_message as string,
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    if (currentUser.id) {
      formData.append("id", currentUser.id)
    }
    formData.append("username", values.username)
    formData.append("name", values.name)
    formData.append("headline", values.headline)
    formData.append("introMessage", values.introMessage)
    if (values.file) {
      formData.append("file", values.file)
    }

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/users`,
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

  async function addSocial(social_name: string, account_name: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/socials/${currentUser?.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          social_name: social_name,
          account_name: account_name,
        }),
      }
    )

    if (!res) {
      toast({
        title: "Failed to Add Social",
      })
    } else {
      toast({
        title: "Social Added",
      })

      form.reset()
      router.refresh()
    }
  }

  async function updateSocial(
    social_id: string,
    social_name: string,
    account_name: string
  ) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/socials/${social_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          social_name: social_name,
          account_name: account_name,
        }),
      }
    )

    if (!res.ok) {
      toast({
        title: "Failed to Update Social",
      })
    } else {
      toast({
        title: "Social Updated",
      })
      router.refresh()
      setEditSocialId(null)
    }
  }

  async function deleteSocial(social_id: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/socials/${social_id}`,
      {
        method: "DELETE",
      }
    )

    if (!res.ok) {
      toast({
        title: "Failed to Delete Social",
      })
    } else {
      router.refresh()
      toast({
        title: "Social Deleted",
      })
    }
  }

  return (
    <Card className="max-w-[800px] w-full">
      <CardHeader className="text-center">
        <CardTitle>Your Details</CardTitle>
        <CardDescription>Update your details</CardDescription>
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
                        placeholder={currentUser?.username as string}
                        defaultValue={currentUser?.username as string}
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
            {socials.length < 6 && (
              <div className="flex w-full items-center gap-2">
                <FormField
                  control={form.control}
                  name="social_name"
                  render={({ field }) => (
                    <FormItem className="max-w-[150px] w-full">
                      <FormLabel>Social Name</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger type="button">
                              <SelectValue placeholder="Select a text font" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.INSTAGRAM.toString()}
                            >
                              Instagram
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.FACEBOOK.toString()}
                            >
                              Facebook
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.X.toString()}
                            >
                              X
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.TIKTOK.toString()}
                            >
                              Tiktok
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.REDDIT.toString()}
                            >
                              Reddit
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.SPOTIFY_ARTIST.toString()}
                            >
                              Spotify (Artist)
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.SPOTIFY_USER.toString()}
                            >
                              Spotify (User)
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.SNAPCHAT.toString()}
                            >
                              Snapchat
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.YOUTUBE.toString()}
                            >
                              YouTube
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.TELEGRAM.toString()}
                            >
                              Telegram
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.WHATSAPP.toString()}
                            >
                              WhatsApp
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.EMAIL.toString()}
                            >
                              Email
                            </SelectItem>
                            <SelectItem
                              onClick={(e) => e.preventDefault()}
                              value={Socials.WEBSITE.toString()}
                            >
                              Website
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  className="flex w-fit"
                  onClick={(e) => {
                    e.preventDefault()
                    addSocial(
                      form.getValues("social_name").toString(),
                      form.getValues("account_name")
                    )
                  }}
                >
                  Add
                </Button>
              </div>
            )}
            <div className=" mt-4 w-full">
              {socials.map((social) => (
                <div key={social.id} className="flex items-center gap-4 mb-2">
                  {editSocialId === social.id ? (
                    <>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("social_name", Socials.INSTAGRAM)
                        }
                        defaultValue={social.name as string}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select social platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Socials.INSTAGRAM.toString()}>
                            Instagram
                          </SelectItem>
                          <SelectItem value={Socials.X.toString()}>
                            X
                          </SelectItem>
                          <SelectItem value={Socials.FACEBOOK.toString()}>
                            Facebook
                          </SelectItem>
                          <SelectItem value={Socials.TIKTOK.toString()}>
                            Tiktok
                          </SelectItem>
                          <SelectItem value={Socials.REDDIT.toString()}>
                            Reddit
                          </SelectItem>
                          <SelectItem value={Socials.SPOTIFY_ARTIST.toString()}>
                            Spotify (Artist)
                          </SelectItem>
                          <SelectItem value={Socials.SPOTIFY_USER.toString()}>
                            Spotify (User)
                          </SelectItem>
                          <SelectItem value={Socials.SNAPCHAT.toString()}>
                            Snapchat
                          </SelectItem>
                          <SelectItem value={Socials.YOUTUBE.toString()}>
                            YouTube
                          </SelectItem>
                          <SelectItem value={Socials.TELEGRAM.toString()}>
                            Telegram
                          </SelectItem>
                          <SelectItem value={Socials.WHATSAPP.toString()}>
                            WhatsApp
                          </SelectItem>
                          <SelectItem value={Socials.EMAIL.toString()}>
                            Email
                          </SelectItem>
                          <SelectItem value={Socials.WEBSITE.toString()}>
                            Website
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        defaultValue={social.account_name as string}
                        onChange={(e) =>
                          form.setValue("account_name", e.target.value)
                        }
                        placeholder={social.account_name as string}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          updateSocial(
                            social.id,
                            form.getValues("social_name").toString(),
                            form.getValues("account_name")
                          )
                        }
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setEditSocialId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      {(() => {
                        const iconKey = social.name
                          ? (social.name.toLowerCase() as IconKey)
                          : null
                        const Icon = iconKey ? SocialIcons[iconKey] : null
                        return (
                          <div className="flex items-center">
                            {Icon ? <Icon size={24} className="mr-2" /> : null}
                          </div>
                        )
                      })()}
                      <span>{social.account_name}</span>
                      <Button type="button">Edit</Button>
                      <Button
                        type="button"
                        onClick={() => deleteSocial(social.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>

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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
