import { Bot, Coins, PaintRoller } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function Pricing() {
  return (
    <section className="flex flex-col items-center container py-24 sm:p-8 md:p-16 lg:p-24 xl:p-48">
      <h2 className="font-bold text-center text-3xl md:text-5xl mt-2">
        Simple, transparent pricing
      </h2>
      <h3 className="uppercase text-center font-semibold text-blue-500 text-sm my-4">
        No credit card required, cancel anytime
      </h3>
      <div className="flex flex-col md:grid grid-cols-2 gap-12 max-w-[400px] md:max-w-full w-full mt-12">
        <div className="flex flex-col border rounded-xl p-4">
          <div className="flex flex-col leading-4">
            <h3 className="text-xl font-semibold text-foreground">Free</h3>
            <p className="text-muted-foreground leading-5">For hobbyists</p>

            <span className="my-12 font-semibold text-center text-5xl">
              $0
              <span className="text-sm font-light"> / month</span>
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Coins color="green" />
                <p>25,000 tokens on sign up</p>
              </div>
              <div className="flex items-center gap-4">
                <Bot color="green" />
                <p>Limited AI customization</p>
              </div>
              <div className="flex items-center gap-4">
                <PaintRoller color="green" />
                <p>Limited styling customization</p>
              </div>
            </div>

            <Link className="mt-8" href="/auth/signup">
              <Button className="bg-blue-500 hover:bg-blue-700 w-full rounded-xl text-md">
                Get started
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col border rounded-xl p-4 w-full">
          <div className="flex flex-col leading-4">
            <h3 className="text-xl font-semibold text-foreground">Premium</h3>
            <p className="text-muted-foreground leading-5">For professionals</p>

            <span className="my-12 font-semibold text-center text-5xl">
              $10
              <span className="text-sm font-light"> / month</span>
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Coins color="green" />

                <p>250,000 free tokens on upgrade</p>
              </div>
              <div className="flex items-center gap-4">
                <Bot color="green" />
                <p>Full AI customization</p>
              </div>
              <div className="flex items-center gap-4">
                <PaintRoller color="green" />
                <p>Full styling customization</p>
              </div>
            </div>

            <Link className="mt-8" href="/auth/signup">
              <Button className="bg-blue-500 hover:bg-blue-700 w-full rounded-xl text-md">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
