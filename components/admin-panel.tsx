"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, BarChart3, RefreshCw } from "lucide-react"

interface SystemStats {
  accounts: {
    total: number
    active: number
    expired: number
  }
  emails: {
    total: number
  }
  timestamp: string
}

export function AdminPanel() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCleaningUp, setIsCleaningUp] = useState(false)
  const { toast } = useToast()

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const runManualCleanup = async () => {
    setIsCleaningUp(true)
    try {
      const response = await fetch("/api/cron/cleanup", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Cleanup completed",
          description: result.message,
        })
        // Refresh stats after cleanup
        await fetchStats()
      } else {
        toast({
          title: "Cleanup failed",
          description: result.message || "Unknown error",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Cleanup error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCleaningUp(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <BarChart3 className="h-5 w-5 text-accent" />
              System Administration
            </CardTitle>
            <CardDescription className="text-muted-foreground">Monitor and manage the Bonsamti system</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStats}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.accounts.total}</div>
                <div className="text-sm text-muted-foreground">Total Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{stats.accounts.active}</div>
                <div className="text-sm text-muted-foreground">Active Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{stats.accounts.expired}</div>
                <div className="text-sm text-muted-foreground">Expired Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.emails.total}</div>
                <div className="text-sm text-muted-foreground">Total Emails</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-border text-foreground">
                  Last updated: {new Date(stats.timestamp).toLocaleTimeString()}
                </Badge>
              </div>
              <Button
                onClick={runManualCleanup}
                disabled={isCleaningUp}
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isCleaningUp ? "Cleaning..." : "Manual Cleanup"}
              </Button>
            </div>
          </>
        )}

        <div className="bg-muted/20 border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold text-card-foreground mb-2">Automated Cleanup</h4>
          <p className="text-xs text-muted-foreground">
            The system automatically purges accounts and emails older than 24 hours daily at midnight UTC. This ensures
            the ephemeral nature of all disposable identities.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
