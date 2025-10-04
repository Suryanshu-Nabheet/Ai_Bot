"use client"

import { Button } from "@/components/ui/button"
import { Code2, Save, Play, GitBranch, Rocket, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface IDEHeaderProps {
  projectId: string
}

export function IDEHeader({ projectId }: IDEHeaderProps) {
  const router = useRouter()

  const handleSave = () => {
    toast.success("Project saved")
  }

  const handleRun = () => {
    toast.info("Running project...")
  }

  const handleDeploy = () => {
    router.push(`/deploy/${projectId}`)
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
          <Code2 className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI Dev Platform</span>
        </Link>
        <span className="text-sm text-muted-foreground">Project: {projectId}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} size="sm" variant="ghost" className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button onClick={handleRun} size="sm" variant="ghost" className="gap-2">
          <Play className="h-4 w-4" />
          Run
        </Button>
        <Button size="sm" variant="ghost" className="gap-2">
          <GitBranch className="h-4 w-4" />
          Git
        </Button>
        <Button onClick={handleDeploy} size="sm" className="gap-2">
          <Rocket className="h-4 w-4" />
          Deploy
        </Button>
        <Button size="sm" variant="ghost">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
