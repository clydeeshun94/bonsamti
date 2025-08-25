"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useIdentity } from "@/lib/hooks/use-identity"
import { EmailInbox } from "@/components/email-inbox"
import { EmailTestPanel } from "@/components/email-test-panel"
import { Copy, Shuffle, User, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function IdentityGenerator() {
  const [useCustomName, setUseCustomName] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showTestPanel, setShowTestPanel] = useState(false)
  const { account, isGenerating, error, generate, reset } = useIdentity()
  const { toast } = useToast()

  const handleGenerate = () => {
    generate({
      firstName,
      lastName,
      useCustomName,
    })
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to the void!",
        description: `${label} has been captured in your clipboard`,
      })
    } catch (err) {
      toast({
        title: "Summoning failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <User className="h-5 w-5 text-primary" />
            Summon Disposable Identity
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Conjure a temporary identity from the digital underworld
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="custom-name" checked={useCustomName} onCheckedChange={setUseCustomName} />
            <Label htmlFor="custom-name" className="text-card-foreground">
              Use mortal name instead of demonic
            </Label>
          </div>

          {useCustomName && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-card-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-card-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            {isGenerating ? "Summoning from the void..." : "Summon Identity"}
          </Button>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {account && (
        <>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground">Your Infernal Identity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Use these cursed credentials on any platform. They expire in 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${account.first_name} ${account.last_name}`}
                      readOnly
                      className="bg-input border-border text-foreground"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`${account.first_name} ${account.last_name}`, "Name")}
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input value={account.email} readOnly className="bg-input border-border text-foreground" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(account.email, "Email")}
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Password</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={account.password}
                        readOnly
                        type={showPassword ? "text" : "password"}
                        className="bg-input border-border text-foreground font-mono text-sm pr-10"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(account.password, "Password")}
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={reset}
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                >
                  Banish & Create New
                </Button>
                <Button
                  onClick={() => setShowTestPanel(!showTestPanel)}
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  {showTestPanel ? "Hide" : "Show"} Test Panel
                </Button>
                <Button
                  onClick={() => window.open('/api/emails/inbound', '_blank')}
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  Test Webhook
                </Button>
              </div>
            </CardContent>
          </Card>

          {showTestPanel && <EmailTestPanel account={account} />}

          <EmailInbox account={account} />
        </>
      )}
    </div>
  )
}
