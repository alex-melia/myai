"use client"

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
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { boolean, z } from "zod"
import { DialogClose } from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Switch } from "../ui/switch"
import { interface_settings } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"
import {
  AutonomyLevel,
  CurrentUser,
  Leniency,
  Personality,
  Theme,
} from "@/types"

export type InterfaceSettings = InferSelectModel<typeof interface_settings>

const FormSchema = z.object({
  max_input_length: z
    .number()
    .min(1, {
      message: "Please enter a valid number",
    })
    .max(3000, {
      message: "Please enter a valid number",
    }),
  max_response_length: z
    .number()
    .min(1, {
      message: "Please enter a valid number",
    })
    .max(3000, {
      message: "Please enter a valid number",
    }),
  rate_limit: z.nativeEnum(Leniency),
  enable_inquiries: boolean(),
  personality: z.nativeEnum(Personality),
  theme: z.nativeEnum(Theme),
  behaviour: z.nativeEnum(Leniency),
  autonomy: z.nativeEnum(AutonomyLevel),
})

interface InterfaceFormProps {
  currentUser: CurrentUser
  initialInterface: InterfaceSettings
}

export default function EditPageForm({
  currentUser,
  initialInterface,
}: InterfaceFormProps) {
  const router = useRouter()

  if (!currentUser) {
    router.push("/")
  }

  function isEnumValue<T extends Record<string, any>>(
    enumObj: T,
    value: any
  ): value is T[keyof T] {
    return Object.values(enumObj).includes(value)
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      max_input_length: Number(initialInterface.max_input_length),
      max_response_length: Number(initialInterface.max_response_length),
      rate_limit: initialInterface.rate_limit as Leniency,
      enable_inquiries: initialInterface.enable_inquiries as boolean,
      personality:
        (currentUser.subscription_status as unknown as string) === "ACTIVE" &&
        isEnumValue(Personality, initialInterface.personality)
          ? initialInterface.personality
          : Personality.DEFAULT,
      theme:
        (currentUser.subscription_status as unknown as string) === "ACTIVE" &&
        isEnumValue(Theme, initialInterface.theme)
          ? (initialInterface.theme as Theme)
          : Theme.DEFAULT,
      behaviour:
        (currentUser.subscription_status as unknown as string) === "ACTIVE" &&
        isEnumValue(Leniency, initialInterface.behaviour)
          ? (initialInterface.behaviour as Leniency)
          : Leniency.DEFAULT,
      autonomy:
        (currentUser.subscription_status as unknown as string) === "ACTIVE" &&
        isEnumValue(AutonomyLevel, initialInterface.autonomy)
          ? (initialInterface.autonomy as AutonomyLevel)
          : AutonomyLevel.MEDIUM,
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/interfaces/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    )

    if (!res.ok) {
      toast({
        title: "Sign Up Unsuccessful",
      })
    } else {
      toast({
        title: "Settings Updated",
      })
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="w-full max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <span className="text-2xl tracking-tighter font-semibold">
              Page Settings
            </span>

            <FormField
              control={form.control}
              name="max_input_length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Prompt Length</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      defaultValue={field.value}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the maximum length of prompt (character limit)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_response_length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Response Length</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      defaultValue={field.value}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the maximum length of response (character limit)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate_limit"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Rate Limit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rate limit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <>
                        <SelectItem value={Leniency.VERY_LOOSE}>
                          VERY LOOSE
                          <FormDescription>
                            64 prompts per minute
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.LOOSE}>
                          LOOSE
                          <FormDescription>
                            32 prompts per minute
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.DEFAULT}>
                          DEFAULT
                          <FormDescription>
                            16 prompts per minute
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.STRICT}>
                          STRICT
                          <FormDescription>
                            8 prompts per minute
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.VERY_STRICT}>
                          VERY STRICT
                          <FormDescription>
                            4 prompts per minute
                          </FormDescription>
                        </SelectItem>
                      </>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify the max no. of prompts per minute
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col space-y-0">
                  <CardTitle className="text-lg">Enable Inquiries</CardTitle>
                  <CardDescription>
                    Choose whether to enable inquiries
                  </CardDescription>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="enable_inquiries"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onClick={async () => {
                              const value = form.getValues("enable_inquiries")
                              form.setValue("enable_inquiries", !value)
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
            </Card>
            <p className="text-2xl tracking-tighter font-semibold pt-2">
              AI Settings
            </p>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem
                  className={` ${
                    (currentUser.subscription_status as unknown as string) !==
                      "ACTIVE" && "opacity-50 pointer-events-none"
                  }`}
                >
                  <FormLabel>Theme</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rate limit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <>
                        <SelectItem value={Theme.DEFAULT.toString()}>
                          DEFAULT
                          <FormDescription>
                            Can&apos;t go wrong with a classic
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Theme.LIGHT.toString()}>
                          LIGHT
                          <FormDescription>
                            A nice bright, light theme
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Theme.DARK.toString()}>
                          DARK
                          <FormDescription>
                            Cool on the eyes, cool by nature
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Theme.MODERN.toString()}>
                          MODERN
                          <FormDescription>Sleek modern</FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Theme.RETRO.toString()}>
                          RETRO
                          <FormDescription>
                            Take it back to the 80s with this one
                          </FormDescription>
                        </SelectItem>
                      </>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a theme for your interface
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem
                  className={` ${
                    (currentUser.subscription_status as unknown as string) !==
                      "ACTIVE" && "opacity-50 pointer-events-none"
                  }`}
                >
                  <FormLabel>Personality</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rate limit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <>
                        <SelectItem value={Personality.DEFAULT.toString()}>
                          DEFAULT
                          <FormDescription>
                            Can&apos;t go wrong with the classic
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.PROFESSIONAL.toString()}>
                          PROFESSIONAL
                          <FormDescription>Professional</FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.BUBBLY.toString()}>
                          BUBBLY
                          <FormDescription>Bubbly</FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.QUIRKY.toString()}>
                          QUIRKY
                          <FormDescription>Quirky</FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.TALKATIVE.toString()}>
                          TALKATIVE
                          <FormDescription>Talkative</FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.ACADEMIC.toString()}>
                          ACADEMIC
                          <FormDescription>
                            You are highly intellectual and speak in a scholarly
                            tone
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.CHILL.toString()}>
                          CHILL
                          <FormDescription>
                            You are laid-back and relaxed, speaking in a casual
                            tone without urgency
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.SASSY.toString()}>
                          SASSY
                          <FormDescription>
                            You are sassy and confident, with a playful edge to
                            your responses
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Personality.UWU.toString()}>
                          UWU
                          <FormDescription>
                            You respond in uwu speak
                          </FormDescription>
                        </SelectItem>
                      </>
                    </SelectContent>
                  </Select>
                  <FormDescription>Specify the personality</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="behaviour"
              render={({ field }) => (
                <FormItem
                  className={` ${
                    (currentUser.subscription_status as unknown as string) !==
                      "ACTIVE" && "opacity-50 pointer-events-none"
                  }`}
                >
                  <FormLabel>Temperature</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rate limit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <>
                        <SelectItem value={Leniency.VERY_LOOSE}>
                          VERY HIGH (0.9)
                          <FormDescription>
                            Most Creative, Least Precise
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.LOOSE}>
                          HIGH (0.7)
                          <FormDescription>
                            More Creative, Less Precise
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.DEFAULT}>
                          DEFAULT (0.5)
                          <FormDescription>Balanced</FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.STRICT}>
                          LOW (0.3)
                          <FormDescription>
                            Less Creative, More Precise
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={Leniency.VERY_STRICT}>
                          VERY LOW (0.1)
                          <FormDescription>
                            Least Creative, Most Precise
                          </FormDescription>
                        </SelectItem>
                      </>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify the balance between creativity and precision
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="autonomy"
              render={({ field }) => (
                <FormItem
                  className={` ${
                    (currentUser.subscription_status as unknown as string) !==
                      "ACTIVE" && "opacity-50 pointer-events-none"
                  }`}
                >
                  <FormLabel>Autonomy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rate limit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <>
                        <SelectItem value={AutonomyLevel.LOW.toString()}>
                          LOW
                          <FormDescription>More human, less AI</FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={AutonomyLevel.MEDIUM.toString()}>
                          MEDIUM
                          <FormDescription>
                            Equal human, equal AI
                          </FormDescription>
                        </SelectItem>
                      </>
                      <>
                        <SelectItem value={AutonomyLevel.HIGH.toString()}>
                          HIGH
                          <FormDescription>More AI, less human</FormDescription>
                        </SelectItem>
                      </>
                    </SelectContent>
                  </Select>
                  <FormDescription>Specify the autonomy</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full justify-center">
              <DialogClose>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
