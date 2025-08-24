import { IdentityGenerator } from "@/components/identity-generator"
import { AdminPanel } from "@/components/admin-panel"
import { Flame, Shield, Clock, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="h-8 w-8 text-secondary flame-flicker" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Bonsamti
            </h1>
            <Flame className="h-8 w-8 text-secondary flame-flicker" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Summon disposable identities from the digital underworld. Temporary emails that vanish without a trace in 24
            hours.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Infernal Protection</h3>
            <p className="text-muted-foreground text-sm">
              Your real identity remains hidden in the shadows while you navigate the digital realm.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Clock className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Ephemeral Existence</h3>
            <p className="text-muted-foreground text-sm">
              All traces vanish after 24 hours, leaving no digital footprint behind.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Instant Summoning</h3>
            <p className="text-muted-foreground text-sm">
              Generate powerful identities with demonic names and unbreakable passwords instantly.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <IdentityGenerator />

          <AdminPanel />
        </div>

        <footer className="mt-16 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-destructive" />
              <h4 className="text-lg font-semibold text-destructive">Infernal Warning</h4>
              <Flame className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-destructive/80 text-sm">
              These identities are temporary vessels. Use them wisely, for they shall return to the void after 24 hours.
              Do not use for important accounts or services you wish to keep.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
