import React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Bot, Cog, Coins, Zap } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import Link from "next/link"

interface UpgradeProps {
  currentUser: any
}

export default function Upgrade({ currentUser }: UpgradeProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center dark:hover:bg-slate-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          <Zap className="mr-2 size-4" />
          <p className="font-semibold text-sm">Upgrade</p>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[640px] lg:max-w-[1000px] xl:max-w-[1200px] w-full h-full sm:h-fit">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="font-bold text-4xl">Upgrade</DialogTitle>
          <DialogDescription>Choose from two plans</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-12 w-full sm:p-8">
          <Card className="flex flex-col items-center w-full shadow-md">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="font-bold text-3xl">Standard</CardTitle>
              <CardDescription className="text-xl">Free</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Coins />
                <p>25,000 tokens on sign up</p>
              </div>
              <div className="flex gap-2">
                <Bot />
                <p>Limited AI customization</p>
              </div>
              <div className="flex gap-2">
                <Cog />
                <p>Limited styling customization</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={true}>Free</Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col items-center w-full shadow-md">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="font-bold text-3xl">Premium</CardTitle>
              <CardDescription className="text-xl">$8.00/m</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Coins />
                <p>250,000 free tokens on upgrade</p>
              </div>
              <div className="flex gap-2">
                <Bot />
                <p>Full AI customization</p>
              </div>
              <div className="flex gap-2">
                <Cog />
                <p>Full styling customization</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                className={` ${
                  currentUser?.subscription_status === "ACTIVE" &&
                  "opacity-50 pointer-events-none"
                }`}
                href={
                  process.env.NODE_ENV === "development"
                    ? "https://buy.stripe.com/test_6oEaGIbR11Fd4oM3cc"
                    : "https://buy.stripe.com/dR67tY9xC1m91l6eUV"
                }
              >
                <DialogClose asChild>
                  <Button>Upgrade</Button>
                </DialogClose>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
