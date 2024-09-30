import { Request, Response } from "express"

import { db } from "../db"
import { users } from "../db/schema"
import { eq, sql } from "drizzle-orm"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY as string)

export async function createWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"]

  if (!sig) {
    res.status(400).send("Missing Stripe signature")
    return
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    console.log(err)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  const data = event.data
  const eventType = event.type

  try {
    switch (eventType) {
      case "checkout.session.completed":
        let user

        const session = await stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ["line_items"],
          }
        )

        const customerEmail = session?.customer_details.email
        const priceId = session?.line_items?.data[0]?.price.id

        if (customerEmail) {
          user = await db
            .select()
            .from(users)
            .where(eq(users.email, customerEmail))

          if (!user) {
            await db.insert(users).values({
              name: "asdasd",
              email: customerEmail,
              username: "adasd",
              password: "adasd",
              stripe_customer_id: session?.customer,
            })
          }
        } else {
          console.error("No user found")
          throw new Error("No user found")
        }

        if (session.mode === "subscription") {
          await db
            .update(users)
            .set({
              stripe_customer_id: session?.customer,
              stripe_price_id: priceId,
              subscription_status: "ACTIVE",
              tokens: sql`${users.tokens} + 250000`,
            })
            .where(eq(users.email, customerEmail))
        } else if (session.mode === "payment") {
          const isTokenPurchase = session.line_items?.data.some((item: any) => {
            return (
              item.description === "100000 Tokens" ||
              "250000 Tokens" ||
              "500000 Tokens"
            )
          })

          const tokenAmounts = {
            "100000 Tokens": 100000,
            "250000 Tokens": 250000,
            "500000 Tokens": 500000,
          }

          const purchasedTokenAmount = session.line_items?.data.find(
            (item: { description: string }) => {
              return Object.keys(tokenAmounts).includes(item.description)
            }
          )

          console.log(isTokenPurchase)

          if (isTokenPurchase && purchasedTokenAmount) {
            const tokenValue =
              tokenAmounts[
                purchasedTokenAmount.description as keyof typeof tokenAmounts
              ]

            await db
              .update(users)
              .set({
                tokens: sql`${users.tokens} + ${tokenValue}`,
              })
              .where(eq(users.email, customerEmail))
          }
        } else {
          console.log("Unhandled session mode:", session.mode)
        }

        break

      case "customer.subscription.deleted":
        const subscription = await stripe.subscriptions.retrieve(data.object.id)

        const [userToDelete] = await db
          .select()
          .from(users)
          .where(eq(users.stripe_customer_id, subscription.customer))

        if (!userToDelete) {
          console.error("No user found")
          throw new Error("No user found")
        }

        await db
          .update(users)
          .set({
            subscription_status: "CANCELED",
          })
          .where(eq(users.id, userToDelete.id))
        break

      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object
        break
      case "invoice.payment_failed":
        const invoice = event.data.object
        await handleSubscriptionFailure(invoice.customer)
        break
      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object
        if (
          subscriptionUpdated.status === "canceled" ||
          subscriptionUpdated.status === "incomplete_expired"
        ) {
          await revokePremiumAccess(subscriptionUpdated.customer)
        }
        break
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object
        await revokePremiumAccess(deletedSubscription.customer)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    async function handleSubscriptionFailure(customerId: string) {
      const failedSubscription = await db
        .update(users)
        .set({
          subscription_status: "UNPAID",
        })
        .where(eq(users.stripe_customer_id, customerId))

      if (!failedSubscription) {
        throw new Error("Failed to remove subscription")
      }
      console.log(`Payment failed for customer: ${customerId}`)
    }

    async function revokePremiumAccess(customerId: string) {
      const failedSubscription = await db
        .update(users)
        .set({
          subscription_status: "UNPAID",
        })
        .where(eq(users.stripe_customer_id, customerId))

      if (!failedSubscription) {
        throw new Error("Failed to remove subscription")
      }
      console.log(`Revoking premium access for customer: ${customerId}`)
    }
  } catch (err) {
    console.error(err)
  }
  res.send()
}
