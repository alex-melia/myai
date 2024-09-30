"use client"

import { FormEvent, useEffect, useRef, useState, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Mail, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "../ui/spinner"

import { User as AuthUser } from "next-auth"
import { toast } from "../ui/use-toast"
import { InferSelectModel } from "drizzle-orm"
import { interface_settings, theme_settings, users } from "@/db/schema"
import { Layout } from "@/types"

type User = InferSelectModel<typeof users>
type InterfaceSettings = InferSelectModel<typeof interface_settings>
type ThemeSettings = InferSelectModel<typeof theme_settings>

interface Message {
  role: string
  content: string
}

interface ChatContainerProps {
  user: User
  interfaceSettings: InterfaceSettings
  themeSettings: ThemeSettings
  currentUser: AuthUser | undefined
}

export default function ChatContainer({
  user,
  interfaceSettings,
  themeSettings,
  currentUser,
}: ChatContainerProps) {
  const [prompt, setPrompt] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: "assistant", content: user.intro_message as string },
  ])
  const [chatMode, setChatMode] = useState("chat")
  const [streamedMessage, setStreamedMessage] = useState<string>("")

  const [inquiryPrompt, setInquiryPrompt] = useState<string>("")
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(
    currentUser?.email as string
  )

  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory, streamedMessage])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  function startInquiry() {
    if (chatMode === "inquiry") return
    let assistantMessage: Message
    if (currentUserEmail) {
      assistantMessage = {
        role: "assistant",
        content: "What would you like to know?",
      }
    } else {
      assistantMessage = {
        role: "assistant",
        content: "Sure! What is your email address?",
      }
    }
    setChatMode("inquiry")
    setChatHistory((prevHistory) => [...prevHistory, assistantMessage])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const newMessage: Message = { role: "user", content: prompt }
    setChatHistory((prevHistory) => [...prevHistory, newMessage])
    setPrompt("")
    setStreamedMessage("")

    if (chatMode === "chat" && prompt.toLowerCase().includes("inquiry")) {
      let assistantMessage: Message

      if (currentUserEmail) {
        assistantMessage = {
          role: "assistant",
          content: "Sure! What would you like to inquire about?",
        }
      } else {
        assistantMessage = {
          role: "assistant",
          content: "Sure! What is your email address?",
        }
      }
      setChatMode("inquiry")
      setChatHistory((prevHistory) => [...prevHistory, assistantMessage])
      return
    }

    if (chatMode === "inquiry") {
      if (!currentUserEmail) {
        setCurrentUserEmail(prompt)
        const assistantMessage: Message = {
          role: "assistant",
          content: "Thanks! What would you like to inquire about?",
        }
        setChatHistory((prevHistory) => [...prevHistory, assistantMessage])
        return
      }

      try {
        startTransition(async () => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}api/inquiries/${user.id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userPrompt: prompt,
                inquiringUser: currentUser,
                inquiringUserEmail: currentUserEmail,
              }),
            }
          )

          if (!response.ok) {
            throw new Error("Failed to receive response")
          }

          const assistantMessage: Message = {
            role: "assistant",
            content: "Thanks for your inquiry",
          }

          setChatHistory((prevHistory) => [...prevHistory, assistantMessage])
          setChatMode("chat")
        })
        return
      } catch (err) {}
    }

    try {
      startTransition(async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}api/chats/${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userPrompt: prompt,
              chatHistory: chatHistory,
            }),
          }
        )

        if (!response.ok) {
          toast({
            title: "Rate Limit Exceeded",
          })
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder("utf-8")
        let buffer = ""

        if (!reader) {
          throw new Error("Failed to get reader from response body")
        }

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          setStreamedMessage((prev) => `${prev} ${chunk.trim()}`)
        }

        const finalMsg = buffer.split("\n").join("")
        const dataMatch = finalMsg.match(/data:\s*({.*?})/)

        let tokensUsed = null
        let messageContent = finalMsg

        if (dataMatch && dataMatch[1]) {
          const data = JSON.parse(dataMatch[1])
          tokensUsed = data.TokensUsed
          messageContent = finalMsg.split(dataMatch[0])[0].trim()
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: messageContent,
        }

        setChatHistory((prevHistory) => [...prevHistory, assistantMessage])
      })
    } catch (error) {
      console.error("Error:", error)
      const assistantMessage: Message = {
        role: "assistant",
        content: "I'm sorry, it appears there has been an error!",
      }
      setChatHistory((prevHistory) => [...prevHistory, assistantMessage])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent)
    }
  }

  return (
    <div
      className="flex flex-col gap-2 mt-4 flex-grow overflow-auto z-10"
      style={{
        backgroundColor: themeSettings.chat_background
          ? `rgba(${parseInt(
              (themeSettings.chat_background_color as string).slice(1, 3),
              16
            )}, 
                 ${parseInt(
                   (themeSettings.chat_background_color as string).slice(3, 5),
                   16
                 )}, 
                 ${parseInt(
                   (themeSettings.chat_background_color as string).slice(5, 7),
                   16
                 )}, 
                 ${(themeSettings.chat_background_opacity as number) / 100})`
          : "transparent",
        borderTopLeftRadius:
          themeSettings.chat_background &&
          themeSettings.base_layout === Layout.DEFAULT.toString()
            ? "20px"
            : "0px",
        borderTopRightRadius:
          themeSettings.chat_background &&
          themeSettings.base_layout === Layout.DEFAULT.toString()
            ? "20px"
            : "0px",
        color: themeSettings.text_color ? themeSettings.text_color : "black",
      }}
    >
      <div
        ref={chatContainerRef}
        className="flex p-2 flex-col flex-1 overflow-y-auto custom-scrollbar z-20"
      >
        {chatHistory.length ? (
          chatHistory.map((message, index) => (
            <div key={index} className="p-2 flex gap-4" style={{ opacity: 1 }}>
              <Avatar className="w-12 h-12 rounded-sm">
                <AvatarImage
                  src={
                    message.role === "user" ? "./default.jpg" : `${user.image}`
                  }
                />
                <AvatarFallback className="w-12 h-12 rounded-sm">
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <p
                className={
                  message.role === "user"
                    ? " bg-blue-200 h-fit p-2 rounded-md"
                    : ""
                }
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {message.content}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center w-full h-full p-2 mt-24 gap-1">
            <p className="font-bold text-2xl text-center">
              You haven&apos;t asked anything yet!
            </p>
            <p className="font-light  text-center">
              Enter your message in the input field below
            </p>
          </div>
        )}
        {isPending && (
          <div className="p-2 flex gap-4">
            <Avatar className="w-12 h-12 rounded-sm">
              <AvatarImage src={`${user.image}`} />
              <AvatarFallback className="w-12 h-12 rounded-sm">
                <UserIcon />
              </AvatarFallback>
            </Avatar>
            <p style={{ whiteSpace: "pre-line" }}>
              {streamedMessage ? streamedMessage : <Spinner size="small" />}
            </p>
          </div>
        )}
      </div>

      {interfaceSettings.enable_inquiries && (
        <div
          onClick={startInquiry}
          className="px-2 py-0.5 flex gap-2 rounded-full font-semibold tracking-tight border-2 border-black w-fit mx-auto hover:cursor-pointer"
          style={{
            backgroundColor:
              themeSettings.brand_colors_enabled &&
              themeSettings.brand_color_primary
                ? themeSettings.brand_color_primary
                : "transparent",
          }}
        >
          <Mail />
          Send an inquiry
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center justify-between w-full max-h-[120px] border border-b-0 rounded-t-md p-1 px-2 gap-2",
          themeSettings.base_layout === "LANDSCAPE" && "border-b rounded-b-md"
        )}
      >
        <div
          className="flex rounded-md w-full h-fit"
          style={{
            outline: "none",
            backgroundColor: themeSettings.input_background
              ? (themeSettings.brand_color_primary as string)
              : undefined,
          }}
        >
          <textarea
            id="prompt"
            className={cn("w-full h-fit bg-opacity-100 overflow-auto")}
            name="prompt"
            ref={textareaRef}
            style={{
              resize: "none",
              overflow: "hidden",
              background: "none",
              outline: "none",
              height: "100px",
              maxHeight: "100px",
            }}
            value={prompt}
            onChange={(e) => {
              if (
                e.target.value.length <=
                Number(interfaceSettings.max_input_length)
              ) {
                setPrompt(e.target.value)
              }
            }}
            placeholder="Enter your message..."
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-col items-center gap-1 p-1">
          <div className="flex items-center">
            <p>{prompt.length}</p> <p>&nbsp;/&nbsp;</p>
            <p>{interfaceSettings.max_input_length}</p>
          </div>

          <button
            className={cn("border h-fit w-fit mx-auto p-2 rounded-md  z-40", {
              "opacity-50 pointer-events-none disabled ":
                isPending ||
                !prompt.length ||
                prompt.length > Number(interfaceSettings.max_input_length),
            })}
            style={{
              backgroundColor:
                themeSettings.brand_colors_enabled &&
                themeSettings.brand_color_primary
                  ? themeSettings.brand_color_primary
                  : "#ffffff",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
