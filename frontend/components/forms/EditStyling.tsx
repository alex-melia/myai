"use client"

import { z } from "zod"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "../ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Switch } from "../ui/switch"
import { cn } from "@/lib/utils"
import { Slider } from "../ui/slider"
import { InferSelectModel } from "drizzle-orm"
import { theme_settings } from "@/db/schema"
import {
  Background,
  CurrentUser,
  DisplayRender,
  Font,
  GradientType,
  Layout,
  MobileLayout,
  Pattern,
} from "@/types"

export type ThemeSettings = InferSelectModel<typeof theme_settings>

const FormSchema = z.object({
  base_layout: z.nativeEnum(Layout),
  mobile_layout: z.nativeEnum(MobileLayout),
  display_on_render: z.nativeEnum(DisplayRender),
  display_interests: z.boolean(),
  display_links: z.boolean(),
  background_style: z.nativeEnum(Background),
  background_color: z.string(),
  background_gradient: z.string(),
  background_gradient_type: z.nativeEnum(GradientType),
  background_gradient_from: z.string(),
  background_gradient_to: z.string(),
  background_image: z.any(),
  text_font: z.nativeEnum(Font),
  text_color: z.string(),
  pattern: z.nativeEnum(Pattern),
  chat_background: z.boolean(),
  chat_background_color: z.string(),
  chat_background_opacity: z.number(),
  avatar_squared: z.boolean(),
  brand_colors_enabled: z.boolean(),
  brand_color_primary: z.string(),
  brand_color_secondary: z.string(),
  disable_branding: z.boolean(),
})

interface StylingFormProps {
  currentUser: CurrentUser
  themeSettings: ThemeSettings
}

export default function EditStylingForm({
  currentUser,
  themeSettings,
}: StylingFormProps) {
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
      base_layout: isEnumValue(Layout, themeSettings.base_layout)
        ? (themeSettings.base_layout as Layout)
        : Layout.DEFAULT,
      mobile_layout: isEnumValue(MobileLayout, themeSettings.mobile_layout)
        ? (themeSettings.mobile_layout as MobileLayout)
        : MobileLayout.DEFAULT,
      display_on_render: isEnumValue(
        DisplayRender,
        themeSettings.display_on_render
      )
        ? (themeSettings.display_on_render as DisplayRender)
        : DisplayRender.CHAT,
      display_interests: themeSettings.display_interests as boolean,
      display_links: themeSettings.display_links as boolean,
      background_style: isEnumValue(Background, themeSettings.background_style)
        ? (themeSettings.background_style as Background)
        : Background.DEFAULT,
      background_color: themeSettings.background_color as string,
      background_gradient: themeSettings.background_gradient as string,
      background_gradient_type: isEnumValue(
        GradientType,
        themeSettings.background_gradient_type
      )
        ? (themeSettings.background_gradient_type as GradientType)
        : GradientType.LINEAR,
      background_gradient_from:
        themeSettings.background_gradient_from as string,
      background_gradient_to: themeSettings.background_gradient_to as string,
      background_image: themeSettings.background_image,
      pattern: isEnumValue(Pattern, themeSettings.pattern)
        ? (themeSettings.pattern as Pattern)
        : Pattern.DOODLES,
      text_font: isEnumValue(Font, themeSettings.text_font)
        ? (themeSettings.text_font as Font)
        : Font.ARIAL,
      text_color: themeSettings.text_color as string,
      chat_background: themeSettings.chat_background as boolean,
      chat_background_opacity: themeSettings.chat_background_opacity as number,
      avatar_squared: themeSettings.avatar_squared as boolean,
      brand_colors_enabled: themeSettings.brand_colors_enabled as boolean,
      brand_color_primary: themeSettings.brand_color_primary as string,
      brand_color_secondary: themeSettings.brand_color_secondary as string,
      disable_branding: themeSettings.disable_branding as boolean,
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
        title: "Update Unsuccessful",
      })
    } else {
      toast({
        title: "Styling Updated",
      })
      router.push("/dashboard")
      router.refresh()
    }
  }

  async function updateSettings(
    value: string | object | boolean,
    field: string | object
  ) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/themes/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: value,
          field: field,
        }),
      }
    )

    if (!res.ok) {
      toast({
        title: "Update Unsuccessful",
      })
    } else {
      toast({
        title: "Styling Updated",
      })
      router.push("/dashboard")
      router.refresh()
    }
  }

  async function updateBackgroundImage(value: any, field: string | object) {
    const formData = new FormData()
    formData.append("file", value)
    formData.append("field", field as string)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/themes/image/${currentUser.id}`,
      {
        method: "PUT",
        body: formData,
      }
    )

    if (!res.ok) {
      toast({
        title: "Update Unsuccessful",
      })
    } else {
      toast({
        title: "Styling Updated",
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
              Layout Settings
            </span>
            <FormField
              control={form.control}
              name="base_layout"
              render={({ field }) => (
                <Card>
                  <CardHeader className="space-y-0">
                    <CardTitle className="text-lg">Base Layout</CardTitle>
                    <CardDescription>Select the default layout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormItem className="w-full">
                      <FormLabel>Base Layout</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a base layout" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Layout.DEFAULT.toString()}>
                            PORTRAIT
                          </SelectItem>

                          <SelectItem value={Layout.LANDSCAPE.toString()}>
                            LANDSCAPE
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Preview</Button>
                    <Button
                      type="button"
                      onClick={() =>
                        updateSettings(
                          (field.value as Layout).toString(),
                          "base_layout"
                        )
                      }
                    >
                      Update
                    </Button>
                  </CardFooter>
                </Card>
              )}
            />
            <FormField
              control={form.control}
              name="display_on_render"
              render={({ field }) => (
                <Card>
                  <CardHeader className="space-y-0">
                    <CardTitle className="text-lg">Display on Render</CardTitle>
                    <CardDescription>
                      Display either your chat or links first
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormItem className="w-full">
                      <FormLabel>Displayed on Render</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={DisplayRender.CHAT.toString()}>
                            CHAT
                          </SelectItem>
                          <SelectItem value={DisplayRender.LINKS.toString()}>
                            LINKS
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Preview</Button>
                    <Button
                      type="button"
                      onClick={() =>
                        updateSettings(
                          (field.value as DisplayRender).toString(),
                          "display_on_render"
                        )
                      }
                    >
                      Update
                    </Button>
                  </CardFooter>
                </Card>
              )}
            />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col space-y-0">
                  <CardTitle className="text-lg">Display Interests</CardTitle>
                  <CardDescription>
                    Choose whether to display interests
                  </CardDescription>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="display_interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={themeSettings.display_interests as boolean}
                            onCheckedChange={field.onChange}
                            onClick={async () => {
                              await field.onChange
                              const values = form.getValues()
                              updateSettings(
                                values.display_interests as boolean,
                                "display_interests"
                              )
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col space-y-0">
                  <CardTitle className="text-lg">Display Links</CardTitle>
                  <CardDescription>
                    Choose whether to display links
                  </CardDescription>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="display_links"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={themeSettings.display_links as boolean}
                            onCheckedChange={field.onChange}
                            onClick={async () => {
                              await field.onChange
                              const values = form.getValues()
                              updateSettings(
                                values.display_links as boolean,
                                "display_links"
                              )
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div
                  className={cn(
                    (currentUser.subscription_status as unknown as string) !==
                      "ACTIVE" && "opacity-50 pointer-events-none",
                    "flex flex-col space-y-0"
                  )}
                >
                  <CardTitle className="text-lg">Disable Branding</CardTitle>
                  <CardDescription>
                    Remove PersonifyAI branding from your page
                  </CardDescription>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="disable_branding"
                    render={({ field }) => (
                      <FormItem
                        className={` ${
                          (currentUser.subscription_status as unknown as string) !==
                            "ACTIVE" && "opacity-50 pointer-events-none"
                        }`}
                      >
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onClick={async () => {
                              await field.onChange
                              const values = form.getValues()
                              updateSettings(
                                values.disable_branding as boolean,
                                "disable_branding"
                              )
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
              Style Settings
            </p>
            <FormField
              control={form.control}
              name="background_style"
              render={({ field }) => (
                <Card>
                  <CardHeader className="space-y-0">
                    <CardTitle className="text-lg">Background Style</CardTitle>
                    <CardDescription>
                      Select the background style
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <FormItem className="w-full">
                      <FormLabel>Background Style</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a background style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Background.DEFAULT.toString()}>
                            DEFAULT
                          </SelectItem>
                          <SelectItem value={Background.SOLID_COLOR.toString()}>
                            SOLID COLOR
                          </SelectItem>
                          <SelectItem
                            className={` ${
                              (currentUser.subscription_status as unknown as string) !==
                                "ACTIVE" && "opacity-50 pointer-events-none"
                            }`}
                            value={Background.GRADIENT.toString()}
                          >
                            GRADIENT
                          </SelectItem>
                          <SelectItem
                            className={` ${
                              (currentUser.subscription_status as unknown as string) !==
                                "ACTIVE" && "opacity-50 pointer-events-none"
                            }`}
                            value={Background.PATTERN.toString()}
                          >
                            PATTERN
                          </SelectItem>
                          <SelectItem
                            className={` ${
                              (currentUser.subscription_status as unknown as string) !==
                                "ACTIVE" && "opacity-50 pointer-events-none"
                            }`}
                            value={Background.IMAGE.toString()}
                          >
                            IMAGE
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                    {form.getValues("background_style") ===
                      Background.SOLID_COLOR && (
                      <FormField
                        control={form.control}
                        name="background_color"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Background Color</FormLabel>
                            <div className="flex items-center border rounded-lg ">
                              <Input
                                className="w-12 h-10 border-none"
                                type="color"
                                placeholder="#1A1A1A"
                                {...field}
                                value={field.value || "#1A1A1A"}
                              />
                              <p>{field.value}</p>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {form.getValues("background_style") ===
                      Background.GRADIENT && (
                      <>
                        <FormField
                          control={form.control}
                          name="background_gradient_type"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Gradient Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a gradient type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem
                                    value={GradientType.LINEAR.toString()}
                                  >
                                    LINEAR
                                  </SelectItem>
                                  <SelectItem
                                    value={GradientType.RADIAL.toString()}
                                  >
                                    RADIAL
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="background_gradient_from"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Background Gradient (From)</FormLabel>
                              <div className="flex items-center border rounded-lg ">
                                <Input
                                  className="w-12 h-10 border-none"
                                  type="color"
                                  placeholder="#1A1A1A"
                                  {...field}
                                  value={field.value || "#1A1A1A"}
                                />
                                <p>{field.value}</p>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="background_gradient_to"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Background Gradient (To)</FormLabel>
                              <div className="flex items-center border rounded-lg ">
                                <Input
                                  className="w-12 h-10 border-none"
                                  type="color"
                                  placeholder="#1A1A1A"
                                  {...field}
                                  value={field.value || "#1A1A1A"}
                                />
                                <p>{field.value}</p>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    {form.getValues("background_style") ===
                      Background.IMAGE && (
                      <>
                        <FormField
                          control={form.control}
                          name="background_image"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Background Image</FormLabel>
                              <div className="flex items-center border rounded-lg ">
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
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Preview</Button>
                    <Button
                      type="button"
                      onClick={async () => {
                        // Update other settings
                        await updateSettings(
                          {
                            background_style: (
                              field.value as Background
                            ).toString(),
                            background_gradient_type:
                              form.getValues("background_gradient_type") ||
                              null,
                            background_color:
                              form.getValues("background_color") || null,
                            background_gradient_from:
                              form.getValues("background_gradient_from") ||
                              null,
                            background_gradient_to:
                              form.getValues("background_gradient_to") || null,
                          },
                          "background_style"
                        )

                        // Check if a background image file is selected
                        const backgroundImage: File =
                          form.getValues("background_image")
                        if (
                          backgroundImage &&
                          form.getValues("background_style") ===
                            Background.IMAGE
                        ) {
                          // Call updateBackgroundImage to upload the file
                          await updateBackgroundImage(
                            backgroundImage as File,
                            "background_image"
                          )
                        }
                      }}
                    >
                      Update
                    </Button>
                  </CardFooter>
                </Card>
              )}
              {...(themeSettings.background_style ===
                Background.GRADIENT.toString() && (
                <FormField
                  control={form.control}
                  name="background_gradient_type"
                  render={({ field }) => (
                    <Card>
                      <CardHeader className="space-y-0">
                        <CardTitle className="text-lg">Gradient Type</CardTitle>
                        <CardDescription>
                          Select the gradient type
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormItem className="w-full">
                          <FormLabel>Gradient Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a gradient type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                value={GradientType.LINEAR.toString()}
                              >
                                LINEAR
                              </SelectItem>
                              <SelectItem
                                value={GradientType.RADIAL.toString()}
                              >
                                RADIAL
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button>Preview</Button>
                        <Button
                          type="button"
                          onClick={() =>
                            updateSettings(
                              (field.value as GradientType).toString(),
                              "background_gradient_type"
                            )
                          }
                        >
                          Update
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                />
              ))}
            />
            <Card
              className={` ${
                (currentUser.subscription_status as unknown as string) !==
                  "ACTIVE" && "opacity-50 pointer-events-none"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col space-y-0">
                  <CardTitle className="text-lg">Chat Background</CardTitle>
                  <CardDescription>
                    Select chat background color
                  </CardDescription>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="chat_background"
                    render={({ field }) => (
                      <FormItem
                        className={` ${
                          (currentUser.subscription_status as unknown as string) !==
                            "ACTIVE" && "opacity-50 pointer-events-none"
                        }`}
                      >
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onClick={async () => {
                              await field.onChange
                              const values = form.getValues()
                              updateSettings(
                                values.chat_background as boolean,
                                "chat_background"
                              )
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent
                className={cn(
                  form.getValues("chat_background") === false && "hidden",
                  "space-y-2"
                )}
              >
                <FormField
                  control={form.control}
                  name="chat_background_color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Background color</FormLabel>
                      <div className="flex items-center border rounded-lg ">
                        <Input
                          className="w-12 h-10 border-none"
                          type="color"
                          placeholder="#FFFFFF"
                          {...field}
                          value={field.value || "#FFFFFF"}
                        />
                        <p>{field.value}</p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chat_background_opacity"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="w-full">
                      <FormLabel>Background opacity</FormLabel>
                      <div className="flex items-center border rounded-lg ">
                        <Slider
                          min={0}
                          max={100}
                          step={10}
                          defaultValue={[value]}
                          onValueChange={(val) => onChange(val[0])}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter
                className={cn(
                  form.getValues("chat_background") === false
                    ? "hidden"
                    : "flex justify-between"
                )}
              >
                <Button disabled={form.getValues("chat_background") === false}>
                  Preview
                </Button>
                <Button
                  disabled={form.getValues("chat_background") === false}
                  type="button"
                  onClick={() => {
                    const values = form.getValues()
                    updateSettings(
                      {
                        chat_background_color:
                          values.chat_background_color as string,
                        chat_background_opacity:
                          values.chat_background_opacity as number,
                      },
                      "chat_background_style"
                    )
                  }}
                >
                  Update
                </Button>
              </CardFooter>
            </Card>
            <FormField
              control={form.control}
              name="text_color"
              render={({ field }) => (
                <Card>
                  <CardHeader className="space-y-0">
                    <CardTitle className="text-lg">Text Color</CardTitle>
                    <CardDescription>Select the text color</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormItem className="w-full">
                      <FormLabel>Text Color</FormLabel>
                      <div className="flex items-center border rounded-lg ">
                        <Input
                          className="w-12 h-10 border-none"
                          type="color"
                          placeholder="#1A1A1A"
                          {...field}
                          value={field.value || "#1a1a1a"}
                        />
                        <p>{field.value || "#1a1a1a"}</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Preview</Button>
                    <Button
                      type="button"
                      onClick={() =>
                        updateSettings(field.value as string, "text_color")
                      }
                    >
                      Update
                    </Button>
                  </CardFooter>
                </Card>
              )}
            />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col space-y-0">
                  <CardTitle className="text-lg">Brand Color</CardTitle>
                  <CardDescription>Select brand color</CardDescription>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="brand_colors_enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onClick={async () => {
                              await field.onChange
                              const values = form.getValues()
                              updateSettings(
                                values.brand_colors_enabled as boolean,
                                "brand_colors_enabled"
                              )
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent
                className={cn(
                  form.getValues("brand_colors_enabled") === false && "hidden",
                  "space-y-2"
                )}
              >
                <FormField
                  control={form.control}
                  name="brand_color_primary"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Brand color</FormLabel>

                      <div className="flex items-center border rounded-lg ">
                        <Input
                          className="w-12 h-10 border-none"
                          type="color"
                          placeholder="#1A1A1A"
                          {...field}
                          value={field.value || "#1A1A1A"}
                        />
                        <p>{field.value}</p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter
                className={cn(
                  form.getValues("brand_colors_enabled") === false
                    ? "hidden"
                    : "flex justify-between"
                )}
              >
                <Button
                  disabled={form.getValues("brand_colors_enabled") === false}
                >
                  Preview
                </Button>
                <Button
                  disabled={form.getValues("brand_colors_enabled") === false}
                  type="button"
                  onClick={() => {
                    const values = form.getValues()
                    updateSettings(
                      {
                        brand_color_primary:
                          values.brand_color_primary as string,
                        brand_color_secondary:
                          values.brand_color_secondary as string,
                      },
                      "brand_colors"
                    )
                  }}
                >
                  Update
                </Button>
              </CardFooter>
            </Card>
            <Card
              className={` ${
                (currentUser.subscription_status as unknown as string) !==
                  "ACTIVE" && "opacity-50 pointer-events-none"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col space-y-0">
                  <CardTitle className="text-lg">Squared Avatar</CardTitle>
                  <CardDescription>
                    Choose whether to have squared avatar
                  </CardDescription>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="avatar_squared"
                    render={({ field }) => (
                      <FormItem
                        className={` ${
                          (currentUser.subscription_status as unknown as string) !==
                            "ACTIVE" && "opacity-50 pointer-events-none"
                        }`}
                      >
                        <FormControl>
                          <Switch
                            checked={themeSettings.avatar_squared as boolean}
                            onCheckedChange={field.onChange}
                            onClick={async () => {
                              await field.onChange
                              const values = form.getValues()
                              updateSettings(
                                values.avatar_squared as boolean,
                                "avatar_squared"
                              )
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
            </Card>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
