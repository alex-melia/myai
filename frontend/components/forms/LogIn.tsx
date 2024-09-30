"use client"

import { z } from "zod"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await signIn(
      "credentials",
      {
        redirect: false,
        email: values.email,
        password: values.password,
      },
      { callbackUrl: "/dashboard" }
    )

    if (result?.error) {
      console.log(result)

      toast({
        title: "Login Unsuccessful",
        description: "Incorrect user details or email not verified",
      })
      console.error(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-center">Login</CardTitle>
        <CardDescription className="text-md text-center">
          Please enter your email and password
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
            <div className="w-full flex justify-center">
              <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
                Log In
              </Button>
            </div>
            <p className="mt-4 text-center">
              Not got an account?{" "}
              <Link href="/auth/signup">
                <strong className="text-blue-500 hover:text-blue-600">
                  Sign Up
                </strong>
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
