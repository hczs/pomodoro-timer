"use client"

import { Moon, Sun, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/theme-context"

export default function ThemeSwitcher() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {/* 暗色/亮色模式图标 */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

          {/* 颜色主题指示器 */}
          <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-primary border border-background" />

          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-48">
        <div className="p-2">
          <p className="mb-2 text-xs font-medium text-muted-foreground">外观</p>
          <div className="grid grid-cols-1 gap-1">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
              className="justify-start w-full"
            >
              <Sun className="mr-2 h-4 w-4" />
              浅色
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="justify-start w-full"
            >
              <Moon className="mr-2 h-4 w-4" />
              深色
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("system")}
              className="justify-start w-full"
            >
              <Palette className="mr-2 h-4 w-4" />
              系统
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="mb-2 text-xs font-medium text-muted-foreground">主题颜色</p>
          <div className="grid grid-cols-1 gap-1">
            <Button
              variant={colorTheme === "purple" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setColorTheme("purple")
                // 强制应用主题，解决可能的延迟问题
                document.documentElement.classList.add("theme-purple")
                document.documentElement.style.setProperty("--theme-color", "purple")
              }}
              className="justify-start w-full"
            >
              <div className="mr-2 h-4 w-4 rounded-full bg-[hsl(270,50%,60%)]" />
              紫色
            </Button>
            <Button
              variant={colorTheme === "pink" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setColorTheme("pink")
                // 强制应用主题，解决可能的延迟问题
                document.documentElement.classList.add("theme-pink")
                document.documentElement.style.setProperty("--theme-color", "pink")
              }}
              className="justify-start w-full"
            >
              <div className="mr-2 h-4 w-4 rounded-full bg-[hsl(330,90%,65%)]" />
              粉色
            </Button>
            <Button
              variant={colorTheme === "blue" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setColorTheme("blue")
                // 强制应用主题，解决可能的延迟问题
                document.documentElement.classList.add("theme-blue")
                document.documentElement.style.setProperty("--theme-color", "blue")
              }}
              className="justify-start w-full"
            >
              <div className="mr-2 h-4 w-4 rounded-full bg-[hsl(210,100%,60%)]" />
              蓝色
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

