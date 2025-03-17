"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Plus, Calendar, Check, Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePomodoroContext } from "@/contexts/pomodoro-context"
import { cn } from "@/lib/utils"

export default function TaskList() {
  const { tasks, addTask, removeTask, selectTask, completeTask, currentTask, timerState } = usePomodoroContext()

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const today = format(new Date(), "yyyy-MM-dd")

  // 过滤今天的任务
  const todayTasks = tasks.filter((task) => task.date === today)
  const pendingTasks = todayTasks.filter((task) => !task.completed)
  const completedTasks = todayTasks.filter((task) => task.completed)

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      addTask({
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        date: today,
        pomodoroCount: 0,
      })
      setNewTaskTitle("")
    }
  }

  const isTaskActive = (taskId: string) => {
    return currentTask?.id === taskId && timerState !== "idle"
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(new Date(), "yyyy年MM月dd日", { locale: zhCN })}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            placeholder="添加新任务..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <Tabs defaultValue="pending" className="mt-2">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="pending">待完成 ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">已完成 ({completedTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-2">
            {pendingTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">暂无待完成任务</p>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md",
                    isTaskActive(task.id) ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted",
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => completeTask(task.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <span className="flex-1">{task.title}</span>
                    {task.pomodoroCount > 0 && (
                      <span className="text-xs text-muted-foreground">{task.pomodoroCount} 个番茄钟</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => selectTask(task.id)}
                      disabled={isTaskActive(task.id)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeTask(task.id)}
                      disabled={isTaskActive(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-2">
            {completedTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">暂无已完成任务</p>
            ) : (
              completedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="flex-1 line-through text-muted-foreground">{task.title}</span>
                    {task.pomodoroCount > 0 && (
                      <span className="text-xs text-muted-foreground">{task.pomodoroCount} 个番茄钟</span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

