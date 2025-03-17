import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "番茄钟",
  description: "一个简洁高效的番茄钟应用",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e2e" },
  ],
    generator: 'v0.dev'
}

// 确保在 HTML 元素上添加必要的类和属性
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="theme-purple">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} theme-purple`}>{children}</body>
    </html>
  )
}



import './globals.css'