import { auth } from "@/auth"
import Subscription from "@/components/dialogs/Subscription"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const runtime = "edge"

export default async function TokensPage() {
  const session = await auth()

  const plans = [
    {
      name: "100,000 Tokens",
      link:
        process.env.NODE_ENV === "development"
          ? "https://buy.stripe.com/test_14kbKM1cn83BbReeUX"
          : "https://buy.stripe.com/00g4hM5hmgh3bZK9AD",
      price_id:
        process.env.NODE_ENV === "development"
          ? "price_1Q3HQOKwD4fB7L9ofoPaHqwd"
          : "price_1Q3I8sKwD4fB7L9oKocPFymX",
    },
    {
      name: "250,000 Tokens",
      link:
        process.env.NODE_ENV === "development"
          ? "https://buy.stripe.com/test_00gg12bR16Zx9J65ko"
          : "https://buy.stripe.com/8wMg0u1163uh7JufZ2",
      price_id:
        process.env.NODE_ENV === "development"
          ? "price_1Q3HU2KwD4fB7L9oVEfvgST1"
          : "price_1Q3I9JKwD4fB7L9oamxraFyh",
    },
    {
      name: "500,000 Tokens",
      link:
        process.env.NODE_ENV === "development"
          ? "https://buy.stripe.com/test_9AQ7uwdZ9gA77AY5kp"
          : "https://buy.stripe.com/fZe29EfW0d4R5Bm3ch",
      price_id:
        process.env.NODE_ENV === "development"
          ? "price_1Q3HUVKwD4fB7L9oK1HY8KZU"
          : "price_1Q3I9cKwD4fB7L9oQwVce02M",
    },
  ]

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6">
      <h1 className="text-2xl font-semibold">Tokens</h1>

      <Card className="flex flex-col items-center max-w-[1400px] w-full mx-auto">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-4xl">Tokens</CardTitle>
          <CardDescription>Purchase tokens for your AI</CardDescription>
          <div className="text-xl flex flex-col items-center p-4">
            <CardDescription className="text-md tracking-tight">
              Current Balance
            </CardDescription>
            <p className="text-lg tracking-tight font-bold">
              {session?.user.tokens} tokens
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="flex flex-col md:grid grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={cn(
                  (session?.user.subscription_status as unknown as string) !==
                    "ACTIVE" && " opacity-50 pointer-events-none",
                  "flex flex-col items-center"
                )}
              >
                <CardHeader className=" justify-center text-center">
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    className="bg-black text-white font-bold p-2 rounded-lg"
                    href={plan.link + "?prefilled_email=" + session?.user.email}
                  >
                    Purchase
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Subscription />
        </CardContent>
      </Card>
    </div>
  )
}
