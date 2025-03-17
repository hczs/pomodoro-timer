"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function OrientationCheck({ children }: { children: React.ReactNode }) {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    // 初始检查
    checkOrientation()

    // 监听屏幕方向变化
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  return (
    <>
      {isPortrait && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Alert className="max-w-md">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>请旋转设备</AlertTitle>
            <AlertDescription>为了获得最佳体验，请将设备旋转至横屏模式使用番茄钟应用。</AlertDescription>
          </Alert>
        </div>
      )}
      <div className={isPortrait ? "hidden" : "block"}>{children}</div>
    </>
  )
}

