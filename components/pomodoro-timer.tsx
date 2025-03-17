"use client"

import { useEffect, useState } from "react"
import { Play, Pause, RotateCcw, FastForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { usePomodoroContext } from "@/contexts/pomodoro-context"
import ConfettiEffect from "@/components/confetti-effect"

export default function PomodoroTimer() {
  const {
    currentTask,
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    finishNow,
    timeLeft,
    totalTime,
    pomodoroCount,
    isBreak,
  } = usePomodoroContext()

  const [showConfetti, setShowConfetti] = useState(false)

  // 计算进度百分比
  const progressPercentage = Math.round((1 - timeLeft / totalTime) * 100)

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // 当番茄钟完成时显示礼花效果
  useEffect(() => {
    if (timerState === "completed" && !isBreak) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [timerState, isBreak])

  return (
    <Card className="flex-1 flex flex-col">
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6 gap-6 relative">
        {showConfetti && <ConfettiEffect />}

        <div className="text-center mb-4">
          <h2 className="text-xl font-medium mb-2">{isBreak ? "休息时间" : "专注时间"}</h2>
          {currentTask ? (
            <p className="text-muted-foreground">当前任务: {currentTask.title}</p>
          ) : (
            <p className="text-muted-foreground">请选择一个任务开始</p>
          )}
          {!isBreak && <p className="text-sm text-muted-foreground mt-1">已完成 {pomodoroCount} 个番茄钟</p>}
        </div>

        <div className="w-64 h-64 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Progress
              value={progressPercentage}
              className="w-full h-full rounded-full [&>div]:bg-primary/30"
              indicatorClassName="bg-primary"
            />
          </div>
          <span className="text-4xl font-bold z-10">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex gap-3 mt-4">
          {timerState === "idle" && (
            <Button onClick={startTimer} disabled={!currentTask} size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              开始
            </Button>
          )}

          {timerState === "running" && (
            <>
              <Button onClick={pauseTimer} variant="outline" size="lg" className="gap-2">
                <Pause className="h-5 w-5" />
                暂停
              </Button>
              <Button onClick={finishNow} variant="outline" size="lg" className="gap-2">
                <FastForward className="h-5 w-5" />
                立即完成
              </Button>
            </>
          )}

          {timerState === "paused" && (
            <>
              <Button onClick={startTimer} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                继续
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                重置
              </Button>
            </>
          )}

          {timerState === "completed" && (
            <Button onClick={startTimer} size="lg" className="gap-2">
              {isBreak ? (
                <>
                  <Play className="h-5 w-5" />
                  开始新的番茄钟
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  开始休息
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

