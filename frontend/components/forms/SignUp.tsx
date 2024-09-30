"use client"

import { z } from "zod"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { toast } from "../ui/use-toast"
import { Checkbox } from "../ui/checkbox"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default function SignUpForm() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/users/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      }
    )

    if (!result) {
      toast({
        title: "Sign Up Unsuccessful",
      })
    } else {
      toast({
        title: "Verify Your Email",
        description: "A verification link has been sent to your email!",
      })
      router.push("/auth/login")
    }
  }

  return (
    <Card className="max-w-[600px] w-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-center">Create an Account</CardTitle>
        <CardDescription className="text-md text-center">
          Enter an email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                onClick={() => setTermsAccepted(!termsAccepted)}
                id="terms"
              />
              <p className="text-sm">
                By creating an account, you agree to our{" "}
                <Link
                  className="text-blue-500"
                  href="/tcs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </Link>
              </p>
            </div>
            <div className="w-full flex justify-center">
              <Button
                disabled={!termsAccepted}
                className="bg-blue-500 hover:bg-blue-600"
                type="submit"
              >
                Create Account
              </Button>
            </div>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/auth/login">
                <strong className="text-blue-500 hover:text-blue-600">
                  Log In
                </strong>
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
