"use client"

import { ArrowBigLeft, ArrowDown, UserIcon } from "lucide-react"
import { User as AuthUser } from "next-auth"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface InquiriesGridProps {
  currentUser: AuthUser
  receivedInquiries: any
  sentInquiries: any
}

export default function InquiriesGrid({
  currentUser,
  receivedInquiries,
  sentInquiries,
}: InquiriesGridProps) {
  const [inquiryType, setInquiryType] = useState("received")
  const [answer, setAnswer] = useState("")

  const router = useRouter()

  async function sendResponse(
    answer: string,
    inquiry_id: string,
    currentUserName: string,
    inquiring_user_email: string
  ) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/inquiries/${inquiry_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: answer,
          currentUserName: currentUserName,
          inquiringUserEmail: inquiring_user_email,
        }),
      }
    )

    if (!res.ok) {
      toast({
        title: "Response Failed",
      })
    } else {
      toast({
        title: "Response Sent",
      })
      router.refresh()
    }
  }
  return (
    <div className="flex flex-col xl:grid grid-cols-[auto_1fr] gap-8 container">
      <nav className="flex flex-row justify-start gap-4 xl:justify-start xl:flex-col xl:space-y-4">
        <div
          onClick={() => setInquiryType("received")}
          className={cn(
            inquiryType === "received" && " bg-gray-100 ",
            "flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
          )}
        >
          <ArrowDown className="mr-2 size-4" />
          <p className="font-semibold text-sm">Received</p>
        </div>
        <div
          onClick={() => setInquiryType("sent")}
          className={cn(
            inquiryType === "sent" && " bg-gray-100",
            "flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
          )}
        >
          <ArrowBigLeft className="mr-2 size-4" />
          <p className="font-semibold text-sm">Sent</p>
        </div>
      </nav>

      {inquiryType === "received" && receivedInquiries !== null && (
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl mb-4">Awaiting Response</p>
          {receivedInquiries.filter((inquiry: any) => inquiry.answer === null)
            .length > 0 && (
            <>
              <div className="flex flex-col gap-4 xl:grid grid-cols-3 w-full">
                {receivedInquiries &&
                  receivedInquiries
                    .filter((inquiry: any) => inquiry.answer === null)
                    .map((inquiry: any) => (
                      <Card
                        key={inquiry.id}
                        className="flex flex-col p-2 w-full"
                      >
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={inquiry.inquiring_user?.image as string}
                            />
                            <AvatarFallback>
                              <UserIcon />
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-lg">
                            {inquiry.inquiring_user_email}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <div className="flex flex-col space-y-2">
                            <CardDescription>Question</CardDescription>
                            <span className="p-2 border rounded-sm font-light">
                              {inquiry.question}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <CardDescription>Response</CardDescription>
                            <Textarea
                              className="p-2 border rounded-sm font-light resize-none"
                              onChange={(e) => setAnswer(e.target.value)}
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button>Mark as Read</Button>
                          <Button
                            onClick={() =>
                              sendResponse(
                                answer,
                                inquiry.id,
                                currentUser?.name as string,
                                inquiry.inquiring_user?.email as string
                              )
                            }
                          >
                            Respond
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
              </div>
            </>
          )}

          {receivedInquiries.filter((inquiry: any) => inquiry.answer !== null)
            .length > 0 && (
            <div className="flex flex-col">
              <p className="font-semibold text-2xl mb-4">Completed</p>
              <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {receivedInquiries &&
                  receivedInquiries
                    .filter((inquiry: any) => inquiry.answer !== null)
                    .map((inquiry: any) => (
                      <Card key={inquiry.id} className="flex flex-col p-2">
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={inquiry.inquiring_user?.image as string}
                            />
                            <AvatarFallback>
                              <UserIcon />
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-lg">
                            {inquiry.inquiring_user?.email}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <div className="flex flex-col space-y-2">
                            <CardDescription>Question</CardDescription>
                            <span className="p-2 border rounded-sm font-light">
                              {inquiry.question}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <CardDescription>Response</CardDescription>
                            <span>{inquiry.answer}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button>Clear</Button>
                        </CardFooter>
                      </Card>
                    ))}
              </div>
            </div>
          )}
        </div>
      )}

      {inquiryType === "sent" && sentInquiries !== null && (
        <div className="flex flex-col gap-4">
          {sentInquiries.filter((inquiry: any) => inquiry.answer === null)
            .length > 0 && (
            <div className="flex flex-col">
              <p className="font-semibold text-2xl mb-4">Awaiting Response</p>
              <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sentInquiries &&
                  sentInquiries
                    .filter((inquiry: any) => inquiry.answer === null)
                    .map((inquiry: any) => (
                      <Card key={inquiry.id} className="flex flex-col p-2">
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage />
                            <AvatarFallback>
                              <UserIcon />
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle>
                            {inquiry.inquiring_user?.username}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <div className="flex flex-col space-y-2">
                            <CardDescription>Question</CardDescription>
                            <span className="p-2 border rounded-sm font-light">
                              {inquiry.question}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            </div>
          )}
          {sentInquiries.filter((inquiry: any) => inquiry.answer !== null)
            .length > 0 && (
            <div className="flex flex-col">
              <p className="font-semibold text-2xl mb-4">Responded</p>
              <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sentInquiries &&
                  sentInquiries
                    .filter((inquiry: any) => inquiry.answer !== null)
                    .map((inquiry: any) => (
                      <Card key={inquiry.id} className="flex flex-col p-2">
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={inquiry.inquiring_user?.image as string}
                            />
                            <AvatarFallback>
                              <UserIcon />
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-lg">
                            {inquiry.inquiring_user?.username}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <div className="flex flex-col space-y-2">
                            <CardDescription>Inquiry</CardDescription>
                            <span className="p-2 border rounded-sm font-light">
                              {inquiry.question}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <CardDescription>Answer</CardDescription>
                            <span className="p-2 border rounded-sm font-light">
                              {inquiry.answer}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
