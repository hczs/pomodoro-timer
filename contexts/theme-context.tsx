"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ColorTheme = "purple" | "pink" | "blue"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  colorTheme: ColorTheme
  setColorTheme: (color: ColorTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [colorTheme, setColorTheme] = useState<ColorTheme>("purple")

  useEffect(() => {
    // 从本地存储加载主题设置
    const storedTheme = localStorage.getItem("theme") as Theme | null
    const storedColorTheme = localStorage.getItem("colorTheme") as ColorTheme | null

    if (storedTheme) {
      setTheme(storedTheme)
    }

    if (storedColorTheme) {
      setColorTheme(storedColorTheme)
    }

    // 应用主题
    applyTheme(storedTheme || "system", storedColorTheme || "purple")
  }, [])

  // 当主题或颜色主题变化时保存到本地存储并应用
  useEffect(() => {
    localStorage.setItem("theme", theme)
    localStorage.setItem("colorTheme", colorTheme)
    applyTheme(theme, colorTheme)
  }, [theme, colorTheme])

  // 应用主题到文档
  const applyTheme = (themeValue: Theme, colorValue: ColorTheme) => {
    const root = document.documentElement
    const isDark =
      themeValue === "dark" || (themeValue === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    // 应用暗色/亮色模式
    if (isDark) {
      root.classList.add("dark")
      document.body.classList.add("dark") // 确保body也有dark类
    } else {
      root.classList.remove("dark")
      document.body.classList.remove("dark")
    }
    // 移除所有颜色主题类并应用新的主题类
    // 同时在 HTML 和 body 元素上应用主题类，确保 CSS 变量正确继承
    ;["theme-purple", "theme-pink", "theme-blue"].forEach((cls) => {
      root.classList.remove(cls)
      document.body.classList.remove(cls)
    })

    // 应用颜色主题到 HTML 和 body 元素
    root.classList.add(`theme-${colorValue}`)
    document.body.classList.add(`theme-${colorValue}`)

    // 设置自定义属性作为备份方法
    root.style.setProperty("--theme-color", colorValue)

    // 更新meta标签以支持移动设备的主题色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      // 根据当前主题设置适当的颜色
      if (isDark) {
        metaThemeColor.setAttribute("content", "#1e1e2e") // 暗色模式背景色
      } else {
        metaThemeColor.setAttribute("content", "#ffffff") // 亮色模式背景色
      }
    }
  }

  // 监听系统主题变化
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = () => {
        applyTheme("system", colorTheme)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, colorTheme])

  const value = {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

