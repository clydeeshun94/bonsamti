"use client"

import { useState, useEffect } from "react"

interface CountdownResult {
  timeLeft: {
    hours: number
    minutes: number
    seconds: number
  }
  isExpired: boolean
  percentage: number
}

export function useCountdown(createdAt: string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime()
      const expirationTime = createdTime + 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const now = new Date().getTime()
      const difference = expirationTime - now

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
        setPercentage(0)
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
      setIsExpired(false)

      // Calculate percentage of time remaining (0-100)
      const totalTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const remainingTime = difference
      const percentageRemaining = (remainingTime / totalTime) * 100
      setPercentage(Math.max(0, Math.min(100, percentageRemaining)))
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [createdAt])

  return { timeLeft, isExpired, percentage }
}
