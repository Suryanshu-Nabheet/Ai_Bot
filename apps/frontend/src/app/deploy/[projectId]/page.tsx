"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Rocket, ExternalLink, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import api from "@/lib/api"

interface DeployPageProps {
  params: Promise<{ projectId: string }>
}

export default function DeployPage({ params }: DeployPageProps) {
  const { projectId } = use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [provider, setProvider] = useState<"vercel" | "netlify">("vercel")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "deploying" | "success" | "error">("idle")
  const [deploymentUrl, setDeploymentUrl] = useState<string>("")
  const [logs, setLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentStatus("deploying")
    setLogs([])
    setProgress(0)

    try {
      // Simulate deployment progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const endpoint = provider === "vercel" ? "/api/deploy/vercel" : "/api/deploy/netlify"

      const response = await api.post(endpoint, {
        project_id: projectId,
        provider,
      })

      clearInterval(progressInterval)
      setProgress(100)

      setDeploymentStatus("success")
      setDeploymentUrl(response.data.deployment_url)
      setLogs([
        "Building project...",
        "Installing dependencies...",
        "Running build command...",
        "Optimizing assets...",
        "Deploying to " + provider + "...",
        "Deployment successful!",
      ])

      toast.success("Deployment successful!")
    } catch (error) {
      console.error("[v0] Deploy error:", error)
      setDeploymentStatus("error")
      setLogs(["Deployment failed. Please try again."])
      toast.error("Deployment failed")
    } finally {
      setIsDeploying(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href={`/ide/${projectId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to IDE
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Deploy Project</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* Provider Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Deployment Provider</CardTitle>
              <CardDescription>Select where you want to deploy your project</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={provider} onValueChange={(value) => setProvider(value as "vercel" | "netlify")}>
                <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
                  <RadioGroupItem value="vercel" id="vercel" />
                  <Label htmlFor="vercel" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Vercel</div>
                    <div className="text-sm text-muted-foreground">
                      Optimized for Next.js with automatic HTTPS and global CDN
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
                  <RadioGroupItem value="netlify" id="netlify" />
                  <Label htmlFor="netlify" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Netlify</div>
                    <div className="text-sm text-muted-foreground">
                      Great for static sites with instant rollbacks and split testing
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Deploy Button */}
          {deploymentStatus === "idle" && (
            <Button onClick={handleDeploy} disabled={isDeploying} className="w-full gap-2" size="lg">
              {isDeploying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="h-5 w-5" />
                  Deploy to {provider === "vercel" ? "Vercel" : "Netlify"}
                </>
              )}
            </Button>
          )}

          {/* Deployment Progress */}
          {deploymentStatus === "deploying" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Deploying...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} />
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-1 font-mono text-sm">
                    {logs.map((log, index) => (
                      <div key={index} className="text-muted-foreground">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {deploymentStatus === "success" && (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Deployment Successful!
                </CardTitle>
                <CardDescription>Your project is now live</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg border bg-background p-4">
                  <div className="flex-1 truncate font-mono text-sm">{deploymentUrl}</div>
                  <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      Visit
                    </Button>
                  </a>
                </div>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-1 font-mono text-sm">
                    {logs.map((log, index) => (
                      <div key={index} className="text-muted-foreground">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button onClick={() => setDeploymentStatus("idle")} variant="outline" className="w-full bg-transparent">
                  Deploy Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {deploymentStatus === "error" && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Deployment Failed</CardTitle>
                <CardDescription>There was an error deploying your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-1 font-mono text-sm text-destructive">
                    {logs.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                </ScrollArea>
                <Button onClick={() => setDeploymentStatus("idle")} variant="outline" className="w-full bg-transparent">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
