"use client"

import { useEffect, useState } from "react"
import { PomodoroProvider } from "@/contexts/pomodoro-context"
import { ThemeProvider } from "@/contexts/theme-context"
import OrientationCheck from "@/components/orientation-check"
import PomodoroLayout from "@/components/pomodoro-layout"

export default function PomodoroApp() {
  const [mounted, setMounted] = useState(false)

  // 确保组件只在客户端渲染，避免水合错误
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider>
      <PomodoroProvider>
        <OrientationCheck>
          <PomodoroLayout />
        </OrientationCheck>
      </PomodoroProvider>
    </ThemeProvider>
  )
}

