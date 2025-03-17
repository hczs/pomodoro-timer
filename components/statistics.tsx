"use client"

import { useMemo } from "react"
import { format, subDays, isToday, isYesterday } from "date-fns"
import { BarChart, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePomodoroContext } from "@/contexts/pomodoro-context"

export default function Statistics() {
  const { tasks, completedPomodoros } = usePomodoroContext()

  // 获取过去7天的日期
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 })
      .map((_, i) => {
        const date = subDays(new Date(), i)
        return format(date, "yyyy-MM-dd")
      })
      .reverse()
  }, [])

  // 计算每日完成的番茄钟数量
  const dailyPomodoros = useMemo(() => {
    return last7Days.map((date) => {
      const count = completedPomodoros.filter((p) => p.date === date).length
      return {
        date,
        count,
        displayDate: formatDisplayDate(date),
      }
    })
  }, [last7Days, completedPomodoros])

  // 计算今日完成的任务数量
  const todayCompletedTasks = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd")
    return tasks.filter((task) => task.date === today && task.completed)
  }, [tasks])

  // 计算总番茄钟数量
  const totalPomodoros = completedPomodoros.length

  // 格式化显示日期
  function formatDisplayDate(dateStr: string) {
    const date = new Date(dateStr)
    if (isToday(date)) {
      return "今天"
    } else if (isYesterday(date)) {
      return "昨天"
    } else {
      return format(date, "MM/dd")
    }
  }

  // 计算最大番茄钟数量（用于图表比例）
  const maxPomodoroCount = Math.max(...dailyPomodoros.map((d) => d.count), 1)

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              今日完成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayCompletedTasks.length}</div>
            <p className="text-xs text-muted-foreground">任务数量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              专注时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPomodoros}</div>
            <p className="text-xs text-muted-foreground">总番茄钟数量</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            过去7天的专注记录
          </CardTitle>
          <CardDescription>每日完成的番茄钟数量</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end gap-2">
            {dailyPomodoros.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-[160px]">
                  <div
                    className="w-full max-w-[30px] bg-primary rounded-t-md"
                    style={{
                      height: `${(day.count / maxPomodoroCount) * 100}%`,
                      minHeight: day.count ? "10px" : "0",
                    }}
                  />
                </div>
                <div className="text-xs text-center">
                  <div>{day.displayDate}</div>
                  <div className="text-muted-foreground">{day.count}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>今日完成的任务</CardTitle>
        </CardHeader>
        <CardContent>
          {todayCompletedTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">今天还没有完成任务</p>
          ) : (
            <ul className="space-y-2">
              {todayCompletedTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="line-through text-muted-foreground">{task.title}</span>
                  <span className="text-xs text-muted-foreground">{task.pomodoroCount} 个番茄钟</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

