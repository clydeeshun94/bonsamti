"use client"

import { useCountdown } from "@/lib/hooks/use-countdown"
import { Clock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface CountdownTimerProps {
  createdAt: string
  className?: string
}

export function CountdownTimer({ createdAt, className = "" }: CountdownTimerProps) {
  const { timeLeft, isExpired, percentage } = useCountdown(createdAt)

  if (isExpired) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30">
          Expired
        </Badge>
      </div>
    )
  }

  const isUrgent = percentage < 10 // Less than 10% time remaining
  const isWarning = percentage < 25 // Less than 25% time remaining

  const formatTime = (time: { hours: number; minutes: number; seconds: number }) => {
    const { hours, minutes, seconds } = time
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  const getProgressColor = () => {
    if (isUrgent) return "bg-destructive"
    if (isWarning) return "bg-yellow-500"
    return "bg-primary"
  }

  const getTextColor = () => {
    if (isUrgent) return "text-destructive"
    if (isWarning) return "text-yellow-600"
    return "text-muted-foreground"
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Clock className={`h-4 w-4 ${getTextColor()}`} />
        <span className={`text-sm font-medium ${getTextColor()}`}>{formatTime(timeLeft)} remaining</span>
        {isUrgent && (
          <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
            Urgent
          </Badge>
        )}
        {isWarning && !isUrgent && (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-xs">
            Warning
          </Badge>
        )}
      </div>
      <div className="w-full">
        <Progress value={percentage} className="h-2 bg-muted" />
      </div>
    </div>
  )
}
