"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { usePomodoroContext } from "@/contexts/pomodoro-context"

export default function Settings() {
  const {
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    longBreakInterval,
    setPomodoroTime,
    setShortBreakTime,
    setLongBreakTime,
    setLongBreakInterval,
  } = usePomodoroContext()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>时间设置</CardTitle>
          <CardDescription>自定义番茄钟和休息时间的长度</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="pomodoro-time">番茄钟时长</Label>
              <span className="text-muted-foreground">{pomodoroTime} 分钟</span>
            </div>
            <Slider
              id="pomodoro-time"
              min={5}
              max={60}
              step={5}
              value={[pomodoroTime]}
              onValueChange={(value) => setPomodoroTime(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="short-break">短休息时长</Label>
              <span className="text-muted-foreground">{shortBreakTime} 分钟</span>
            </div>
            <Slider
              id="short-break"
              min={1}
              max={15}
              step={1}
              value={[shortBreakTime]}
              onValueChange={(value) => setShortBreakTime(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="long-break">长休息时长</Label>
              <span className="text-muted-foreground">{longBreakTime} 分钟</span>
            </div>
            <Slider
              id="long-break"
              min={10}
              max={30}
              step={5}
              value={[longBreakTime]}
              onValueChange={(value) => setLongBreakTime(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="long-break-interval">长休息间隔</Label>
              <span className="text-muted-foreground">每 {longBreakInterval} 个番茄钟</span>
            </div>
            <Slider
              id="long-break-interval"
              min={2}
              max={6}
              step={1}
              value={[longBreakInterval]}
              onValueChange={(value) => setLongBreakInterval(value[0])}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

