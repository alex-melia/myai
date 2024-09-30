import { auth } from "@/auth"
import FileGrid from "@/components/files/FileGrid"
import AddFileForm from "@/components/forms/AddFile"
import EditPageForm from "@/components/forms/EditPage"
import EditStylingForm from "@/components/forms/EditStyling"
import LinksForm from "@/components/forms/Links"
import { columns } from "@/components/misc/Columns"
import LinksTable from "@/components/misc/LinksTable"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CurrentUser } from "@/types"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import {
  analytics,
  files,
  interface_settings,
  links,
  theme_settings,
} from "@/db/schema"

export const runtime = "edge"

export default async function DashboardPage() {
  console.log("Request from layout component")
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  const currentUser: CurrentUser = session?.user

  const userFiles = await db
    .select()
    .from(files)
    .where(eq(files.user_id, session?.user.id))

  const [interfaceSettings] = await db
    .select()
    .from(interface_settings)
    .where(eq(interface_settings.user_id, session?.user.id))
    .limit(1)

  const [themeSettings] = await db
    .select()
    .from(theme_settings)
    .where(eq(theme_settings.user_id, session?.user.id))
    .limit(1)

  const [analyticsData] = await db
    .select()
    .from(analytics)
    .where(eq(analytics.user_id, session?.user.id))
    .limit(1)

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.user_id, session?.user.id))

  const mappedLinks = userLinks.map((link) => ({
    id: link.id,
    user_id: link.user_id || "",
    title: link.title || "",
    url: link.url || "",
    image: link.image || null,
    image_public_id: link.image_public_id || null,
  }))

  if (!interfaceSettings || !themeSettings || !analytics) {
    return
  }

  return (
    <div className="flex flex-col min-h-screen p-4  lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">Home</h1>

      <div className="flex flex-col xl:grid grid-cols-3 grid-rows-2 grid-flow-row gap-8 mt-4 h-full">
        <Card className="col-span-2 xl:relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Data</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Data</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[800px]">
                  <DialogHeader className="items-center">
                    <DialogTitle className="text-4xl tracking-tighter">
                      Add Data
                    </DialogTitle>
                    <DialogDescription className="text-md tracking-tighter">
                      Add data to train your personal AI
                    </DialogDescription>
                  </DialogHeader>
                  <AddFileForm user_id={session.user.id} />
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              This is the data that will be used to train your AI
            </CardDescription>
          </CardHeader>
          {userFiles?.length ? (
            <>
              <div className="xl:absolute xl:top-24 xl:bottom-0 flex flex-col items-center justify-center w-full">
                <CardContent className="xl:absolute inset-0 mx-auto grid grid-cols-4 place-items-center gap-2">
                  <FileGrid
                    initialFiles={userFiles}
                    username={session?.user.username}
                  />
                </CardContent>
              </div>
              <CardFooter className="xl:absolute xl:-bottom-3">
                <Link href="/dashboard/data" className="text-blue-500">
                  See your data in full
                </Link>
              </CardFooter>
            </>
          ) : (
            <div className="xl:absolute xl:top-24 xl:bottom-0 flex flex-col items-center justify-center w-full">
              <CardContent className="xl:absolute inset-0 mx-auto gap-2 flex flex-col text-center items-center justify-center">
                <div className="flex flex-col text-center leading-2">
                  <h1 className="text-lg font-semibold md:text-2xl">
                    You have no data
                  </h1>
                  <h3 className="font-light">Add data to get started</h3>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Data</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[800px]">
                    <DialogHeader className="items-center">
                      <DialogTitle className="text-4xl tracking-tighter">
                        Add Data
                      </DialogTitle>
                      <DialogDescription className="text-md tracking-tighter">
                        Add data to train your personal AI
                      </DialogDescription>
                    </DialogHeader>
                    <AddFileForm user_id={session.user.id} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </div>
          )}
        </Card>
        <Card className="w-full mx-auto xl:relative">
          <CardHeader className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-col w-full">
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View analytical data for your page
              </CardDescription>
            </div>
            <div className="flex flex-col items-center max-w-[150px] w-full">
              <span className="tracking-tighter font-light text-sm text-center w-full">
                REMAINING TOKENS
              </span>
              <p className="font-semibold w-fit">{currentUser.tokens}</p>
            </div>
          </CardHeader>
          <div className="xl:absolute xl:top-24 xl:bottom-0 flex flex-col items-center justify-center w-full">
            <CardContent className="xl:absolute inset-0 mx-auto grid grid-cols-4 place-items-center gap-2">
              <div className="flex flex-col items-center">
                <p className="tracking-tighter text-xs sm:text-sm text-center font-light">
                  Page Visits
                </p>
                <p className="font-bold text-xs sm:text-sm">
                  {analyticsData?.hit_count}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="tracking-tighter text-center text-xs sm:text-smtext-center font-light">
                  Avg Tokens Per Request
                </p>
                <p className="font-bold text-xs sm:text-sm">
                  {analyticsData?.avg_tokens_per_request}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="tracking-tighter text-center text-xs sm:text-sm font-light">
                  Total Tokens Used
                </p>
                <p className="font-bold text-xs sm:text-sm">
                  {analyticsData?.total_tokens_used}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="tracking-tighter text-xs sm:text-sm text-center font-light">
                  Inquiries Initiated
                </p>
                <p className="font-bold text-xs sm:text-sm">
                  {analyticsData?.inquiries_initiated}
                </p>
              </div>
              <div className="flex flex-col col-span-2 items-center">
                <p className="tracking-tighter text-xs sm:text-sm text-center font-light">
                  Messages Received
                </p>
                <p className="font-bold text-xs sm:text-sm">
                  {analyticsData?.messages_received}
                </p>
              </div>
              <div className="flex flex-col col-span-2 items-center">
                <p className="tracking-tighter text-xs sm:text-sm text-center font-light">
                  Messages Received
                </p>
                <p className="font-bold text-xs sm:text-sm">
                  {analyticsData?.messages_received}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
        <Card className="w-full mx-auto xl:relative">
          <CardHeader className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-col space-y-0">
              <CardTitle className="text-xl">Page Settings</CardTitle>
              <CardDescription className="text-sm">
                Edit the settings of your page
              </CardDescription>
            </div>
            <div className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Page</Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-[1200px]"
                  style={{ height: "calc(100vh - 40px)" }}
                >
                  <DialogHeader className="items-center space-y-1">
                    <DialogTitle className="text-4xl tracking-tighter">
                      Edit Page
                    </DialogTitle>
                    <DialogDescription className="text-md tracking-tighter">
                      Update your page settings
                    </DialogDescription>
                  </DialogHeader>
                  <EditPageForm
                    currentUser={currentUser}
                    initialInterface={interfaceSettings}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <div className="xl:absolute xl:top-24 xl:bottom-0 flex flex-col items-center justify-center w-full">
            <CardContent className="xl:absolute xl:inset-0 mx-auto grid grid-cols-3 place-items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Max Input Length
                </span>
                <p className="text-xs sm:text-sm">
                  {interfaceSettings.max_input_length}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Max Response Length
                </span>
                <p className="text-xs sm:text-sm">
                  {interfaceSettings.max_response_length}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Behaviour
                </span>
                <p className="text-xs sm:text-sm">
                  {interfaceSettings.behaviour}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Personality
                </span>
                <p className="text-xs sm:text-sm">
                  {interfaceSettings.personality}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Autonomy
                </span>
                <p className="text-xs sm:text-sm">
                  {interfaceSettings.autonomy}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Theme
                </span>
                <p className="text-xs sm:text-sm">{interfaceSettings.theme}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Rate Limit
                </span>
                <p className="text-xs sm:text-sm">
                  {interfaceSettings.rate_limit}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="w-full mx-auto xl:relative">
          <CardHeader className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-col space-y-0">
              <CardTitle className="text-xl">Page Styling</CardTitle>
              <CardDescription className="text-sm">
                Edit the styling of your page
              </CardDescription>
            </div>
            <div className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Styling</Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-[1200px]"
                  style={{ height: "calc(100vh - 40px)" }}
                >
                  <DialogHeader className="items-center space-y-1">
                    <DialogTitle className="text-4xl tracking-tighter">
                      Edit Styling
                    </DialogTitle>
                    <DialogDescription className="text-md tracking-tighter">
                      Update your interface styling
                    </DialogDescription>
                  </DialogHeader>
                  <EditStylingForm
                    currentUser={currentUser}
                    themeSettings={themeSettings}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <div className="xl:absolute xl:top-24 xl:bottom-0 flex flex-col items-center justify-center w-full">
            <CardContent className="xl:absolute xl:inset-0 mx-auto grid grid-cols-3 place-items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Pattern
                </span>
                <p className="text-xs sm:text-sm">{themeSettings.pattern}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Theme
                </span>
                <p className="text-xs sm:text-sm">{themeSettings.theme}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Base Layout
                </span>
                <p className="text-xs sm:text-sm">
                  {themeSettings.base_layout}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Mobile Layout
                </span>
                <p className="text-xs sm:text-sm">
                  {themeSettings.mobile_layout}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Background Style
                </span>
                <p className="text-xs sm:text-sm">
                  {themeSettings.background_style}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Brand Colors Enabled
                </span>
                <p className="text-xs sm:text-sm">
                  {String(themeSettings.brand_colors_enabled).toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Display on Render
                </span>
                <p className="text-xs sm:text-sm">
                  {themeSettings.display_on_render}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Display Interests
                </span>
                <p className="text-xs sm:text-sm">
                  {String(themeSettings.display_interests).toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-center font-light">
                  Display Links
                </span>
                <p className="text-xs sm:text-sm">
                  {String(themeSettings.display_links).toUpperCase()}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="w-full mx-auto xl:relative">
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col space-y-0">
              <CardTitle className="text-xl">Add Links</CardTitle>
              <CardDescription className="text-sm">
                Add or delete your links
              </CardDescription>
            </div>
            <div className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Link</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[800px]">
                  <DialogHeader className="items-center space-y-1">
                    <DialogTitle className="text-4xl tracking-tighter">
                      Edit Links
                    </DialogTitle>
                    <DialogDescription className="text-md tracking-tighter">
                      Add or remove links
                    </DialogDescription>
                  </DialogHeader>
                  <LinksForm currentUser={currentUser as CurrentUser} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <div className="xl:absolute xl:top-24 xl:bottom-0 flex flex-col items-center justify-center w-full">
            <CardContent className="flex flex-col max-h-[300px] xl:max-h-full xl:h-full w-full">
              {links && <LinksTable columns={columns} data={mappedLinks} />}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}
