import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Zap, GitBranch, Rocket, Terminal, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ai Bot </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Build Full-Stack Apps with <span className="text-primary">AI-Powered Development</span>
          </h1>
          <p className="text-pretty text-xl text-muted-foreground">
            Chat with Grok-4 to generate production-ready code. Edit in Monaco IDE, preview live, and deploy to Vercel
            with one click.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                <Zap className="h-5 w-5" />
                Start Building Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Code2 className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>AI Code Generation</CardTitle>
              <CardDescription>
                Powered by xAI Grok-4 via OpenRouter. Describe your app and watch it come to life.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Terminal className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Monaco IDE</CardTitle>
              <CardDescription>
                Full-featured code editor with syntax highlighting, IntelliSense, and file management.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See your changes instantly with hot reload and sandboxed execution.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <GitBranch className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Git Integration</CardTitle>
              <CardDescription>
                Push to GitHub, create branches, open PRs, and manage your code with full version control.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>One-Click Deploy</CardTitle>
              <CardDescription>Deploy to Vercel or Netlify instantly. Get a live URL in seconds.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Production Ready</CardTitle>
              <CardDescription>TypeScript, linting, tests, and CI/CD included. Ship with confidence.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-balance text-4xl font-bold">Ready to build something amazing?</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Join thousands of developers using AI to ship faster.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              <Zap className="h-5 w-5" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2025 Ai Bot . Built with Next.js and Grok-4.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
