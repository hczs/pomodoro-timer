"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePomodoroContext } from "@/contexts/pomodoro-context"
import PomodoroTimer from "@/components/pomodoro-timer"
import TaskList from "@/components/task-list"
import Statistics from "@/components/statistics"
import Settings from "@/components/settings"
import ThemeSwitcher from "@/components/theme-switcher"

export default function PomodoroLayout() {
  const [activeTab, setActiveTab] = useState("tasks")
  const { currentTask } = usePomodoroContext()

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-primary">番茄钟</h1>
        <ThemeSwitcher />
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
          <PomodoroTimer />
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="tasks">任务</TabsTrigger>
              <TabsTrigger value="statistics">统计</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="flex-1 overflow-auto">
              <TaskList />
            </TabsContent>
            <TabsContent value="statistics" className="flex-1 overflow-auto">
              <Statistics />
            </TabsContent>
            <TabsContent value="settings" className="flex-1 overflow-auto">
              <Settings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

