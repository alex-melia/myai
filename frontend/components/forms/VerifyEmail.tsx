"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "../ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Link from "next/link"
import { Button } from "../ui/button"

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const router = useRouter()

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("No token provided")
      setLoading(false)
      return
    }

    setLoading(true)
    if (success) {
      toast({
        title: "Email Verified 🎊",
        description: "Your email has been successfully verified!",
      })
      router.push("/auth/login")
      setLoading(false)
    }

    if (error) {
      setLoading(false)
      toast({
        title: "Email Verification Failed",
        description: "We were unable to verify your email!",
      })
      return
    }

    if (!token) {
      setLoading(false)
      setError("No token provided")
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/users/verify-emailt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    )
      .then((response) => response.json())
      .then((data: any) => {
        if (data.success) {
          setSuccess(data.success)
          toast({
            title: "Email Verified 🎊",
            description: "Your email has been successfully verified!",
          })
          router.push("/auth/login")
        } else {
          setError(data.error)
          toast({
            title: "Email Verification Failed",
            description: data.error || "We were unable to verify your email!",
          })
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError("Unexpected error has occurred")
        setLoading(false)
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [])

  return (
    <div className="flex flex-col items-center sm:container">
      {loading && <p className="text-center">Verifying...</p>}
      {!success && !loading && (
        <Card className="max-w-[700px] items-center w-full">
          <CardHeader className="flex items-center text-center">
            <CardTitle className="text-xl sm:text-4xl tracking-tighter">
              Verification Error
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <p className="text-sm sm:text-lg text-center font-light">
              Sorry, we were unable to verify your email! Please try creating
              your account again
            </p>
            <Link href="/auth/signup">
              <Button>Try Again</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
