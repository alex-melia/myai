"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useState } from "react"
import { signInWithMicrosoft } from "@/app/utils/oauth"

export const runtime = "edge"

export default function AppsPage() {
  const [teamsConnected, setTeamsConnected] = useState(false)

  const connectTeams = async () => {
    try {
      const result = await signInWithMicrosoft()
      if (result) {
        setTeamsConnected(true)
        console.log("Microsoft Teams connected successfully!")
      }
    } catch (error) {
      console.error("Error connecting to Microsoft Teams:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-lg font-semibold md:text-2xl">Applications</h1>
      <div className="container">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>Link Applications</CardTitle>
            <CardDescription>Intergrate your meeting apps</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-2">
            <div onClick={connectTeams} className="flex flex-col items-center">
              <p>img</p>
              <p>Microsoft Teams</p>
              <p>Connect</p>
            </div>
            <p>Google Call</p>
            <p>Discord</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
