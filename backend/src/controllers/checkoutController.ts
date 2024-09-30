import { Request, Response } from "express"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function createCheckout(req: Request, res: Response) {
  const { tokenAmount } = req.body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tokenAmount} Tokens`,
          },
          unit_amount: tokenAmount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  })

  return res.redirect(303, session.url)
}
