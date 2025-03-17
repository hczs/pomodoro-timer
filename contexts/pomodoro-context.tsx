"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface Task {
  id: string
  title: string
  completed: boolean
  date: string
  pomodoroCount: number
}

export interface PomodoroRecord {
  id: string
  taskId: string
  date: string
  timestamp: number
}

type TimerState = "idle" | "running" | "paused" | "completed"

interface PomodoroContextType {
  // 任务相关
  tasks: Task[]
  addTask: (task: Task) => void
  removeTask: (id: string) => void
  selectTask: (id: string) => void
  completeTask: (id: string) => void
  currentTask: Task | null

  // 计时器相关
  timerState: TimerState
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  finishNow: () => void
  timeLeft: number
  totalTime: number
  isBreak: boolean
  pomodoroCount: number
  completedPomodoros: PomodoroRecord[]

  // 设置相关
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  longBreakInterval: number
  setPomodoroTime: (minutes: number) => void
  setShortBreakTime: (minutes: number) => void
  setLongBreakTime: (minutes: number) => void
  setLongBreakInterval: (count: number) => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  // 任务状态
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [completedPomodoros, setCompletedPomodoros] = useState<PomodoroRecord[]>([])

  // 计时器状态
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isBreak, setIsBreak] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)

  // 设置
  const [pomodoroTime, setPomodoroTime] = useState(25)
  const [shortBreakTime, setShortBreakTime] = useState(5)
  const [longBreakTime, setLongBreakTime] = useState(15)
  const [longBreakInterval, setLongBreakInterval] = useState(4)

  // 从本地存储加载数据
  useEffect(() => {
    const loadedTasks = localStorage.getItem("pomodoro-tasks")
    const loadedPomodoros = localStorage.getItem("pomodoro-records")
    const loadedSettings = localStorage.getItem("pomodoro-settings")

    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks))
    }

    if (loadedPomodoros) {
      setCompletedPomodoros(JSON.parse(loadedPomodoros))
    }

    if (loadedSettings) {
      const settings = JSON.parse(loadedSettings)
      setPomodoroTime(settings.pomodoroTime || 25)
      setShortBreakTime(settings.shortBreakTime || 5)
      setLongBreakTime(settings.longBreakTime || 15)
      setLongBreakInterval(settings.longBreakInterval || 4)
    }
  }, [])

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("pomodoro-records", JSON.stringify(completedPomodoros))
  }, [completedPomodoros])

  useEffect(() => {
    localStorage.setItem(
      "pomodoro-settings",
      JSON.stringify({
        pomodoroTime,
        shortBreakTime,
        longBreakTime,
        longBreakInterval,
      }),
    )
  }, [pomodoroTime, shortBreakTime, longBreakTime, longBreakInterval])

  // 计时器逻辑
  useEffect(() => {
    if (timerState === "running") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      setTimerId(timer)

      return () => {
        clearInterval(timer)
      }
    }
  }, [timerState])

  // 处理计时器完成
  const handleTimerComplete = () => {
    setTimerState("completed")

    if (!isBreak && currentTask) {
      // 完成一个番茄钟
      const newPomodoroRecord: PomodoroRecord = {
        id: Date.now().toString(),
        taskId: currentTask.id,
        date: new Date().toISOString().split("T")[0],
        timestamp: Date.now(),
      }

      setCompletedPomodoros((prev) => [...prev, newPomodoroRecord])

      // 更新任务的番茄钟计数
      setTasks((prev) =>
        prev.map((task) => (task.id === currentTask.id ? { ...task, pomodoroCount: task.pomodoroCount + 1 } : task)),
      )

      // 更新番茄钟计数
      const newCount = pomodoroCount + 1
      setPomodoroCount(newCount)
    } else {
      // 休息结束，重置为工作模式
      setIsBreak(false)
    }
  }

  // 开始计时器
  const startTimer = () => {
    if (timerState === "completed") {
      // 如果上一个计时器已完成
      if (!isBreak) {
        // 工作时间结束，开始休息
        const shouldLongBreak = pomodoroCount > 0 && pomodoroCount % longBreakInterval === 0
        const breakDuration = shouldLongBreak ? longBreakTime : shortBreakTime

        setIsBreak(true)
        setTotalTime(breakDuration * 60)
        setTimeLeft(breakDuration * 60)
      } else {
        // 休息时间结束，开始新的番茄钟
        setTotalTime(pomodoroTime * 60)
        setTimeLeft(pomodoroTime * 60)
      }
    } else if (timerState === "idle" && currentTask) {
      // 新的番茄钟
      setTotalTime(pomodoroTime * 60)
      setTimeLeft(pomodoroTime * 60)
    }

    setTimerState("running")
  }

  // 暂停计时器
  const pauseTimer = () => {
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }
    setTimerState("paused")
  }

  // 重置计时器
  const resetTimer = () => {
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }

    if (isBreak) {
      const shouldLongBreak = pomodoroCount > 0 && pomodoroCount % longBreakInterval === 0
      const breakDuration = shouldLongBreak ? longBreakTime : shortBreakTime
      setTimeLeft(breakDuration * 60)
    } else {
      setTimeLeft(pomodoroTime * 60)
    }

    setTimerState("idle")
  }

  // 立即完成
  const finishNow = () => {
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }

    setTimeLeft(0)
    handleTimerComplete()
  }

  // 添加任务
  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task])
  }

  // 移除任务
  const removeTask = (id: string) => {
    if (currentTask?.id === id) {
      // 如果正在进行的任务被删除，重置计时器
      resetTimer()
      setCurrentTask(null)
    }

    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  // 选择任务
  const selectTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      setCurrentTask(task)

      // 如果计时器处于空闲状态，设置好时间
      if (timerState === "idle" || timerState === "completed") {
        setIsBreak(false)
        setTotalTime(pomodoroTime * 60)
        setTimeLeft(pomodoroTime * 60)
        setTimerState("idle")
      }
    }
  }

  // 完成任务
  const completeTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: true } : task)))

    // 如果是当前任务，重置计时器
    if (currentTask?.id === id) {
      resetTimer()
      setCurrentTask(null)
    }
  }

  const value = {
    tasks,
    addTask,
    removeTask,
    selectTask,
    completeTask,
    currentTask,
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    finishNow,
    timeLeft,
    totalTime,
    isBreak,
    pomodoroCount,
    completedPomodoros,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    longBreakInterval,
    setPomodoroTime,
    setShortBreakTime,
    setLongBreakTime,
    setLongBreakInterval,
  }

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext)
  if (context === undefined) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider")
  }
  return context
}

