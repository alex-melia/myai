"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

interface TemporaryThemeProps {
  theme: string
  children: React.ReactNode
}

export default function TemporaryTheme({
  theme,
  children,
}: TemporaryThemeProps) {
  const { theme: originalTheme, setTheme } = useTheme()

  useEffect(() => {
    setTheme(theme.toLowerCase())

    return () => {
      setTheme(originalTheme as string)
    }
  }, [theme, setTheme])

  return <>{children}</>
}
