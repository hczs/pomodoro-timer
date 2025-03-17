"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export default function ConfettiEffect() {
  useEffect(() => {
    // 创建canvas元素
    const canvasElement = document.createElement("canvas")
    canvasElement.className = "fixed inset-0 z-50 pointer-events-none"
    canvasElement.style.width = "100vw"
    canvasElement.style.height = "100vh"
    document.body.appendChild(canvasElement)

    // 启动礼花效果
    const myConfetti = confetti.create(canvasElement, {
      resize: true,
      useWorker: true,
    })

    // 创建全屏礼花效果
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    // 创建间隔函数，产生连续的礼花效果
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // 从左侧发射
      myConfetti({
        ...defaults,
        particleCount,
        origin: { x: 0, y: 0.5 },
      })

      // 从右侧发射
      myConfetti({
        ...defaults,
        particleCount,
        origin: { x: 1, y: 0.5 },
      })

      // 从顶部发射
      myConfetti({
        ...defaults,
        particleCount,
        origin: { x: 0.5, y: 0 },
      })

      // 从底部发射
      myConfetti({
        ...defaults,
        particleCount,
        origin: { x: 0.5, y: 1 },
      })

      // 从中心发射
      myConfetti({
        ...defaults,
        particleCount: particleCount * 2,
        origin: { x: 0.5, y: 0.5 },
      })
    }, 250)

    // 清理函数
    return () => {
      clearInterval(interval)
      if (canvasElement && document.body.contains(canvasElement)) {
        document.body.removeChild(canvasElement)
      }
    }
  }, [])

  return null
}

