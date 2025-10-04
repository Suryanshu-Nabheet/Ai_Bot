"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitBranch, GitCommit, GitPullRequest, History, Plus } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

interface GitPanelProps {
  projectId: string
  repoUrl?: string
}

export function GitPanel({ projectId, repoUrl }: GitPanelProps) {
  const [isInitializing, setIsInitializing] = useState(false)
  const [commitMessage, setCommitMessage] = useState("")
  const [branchName, setBranchName] = useState("")
  const [prTitle, setPrTitle] = useState("")
  const [prDescription, setPrDescription] = useState("")

  const handleInitRepo = async () => {
    setIsInitializing(true)
    try {
      const response = await api.post("/api/git/init", {
        project_id: projectId,
        repo_name: `project-${projectId}`,
        description: "AI-generated project",
        private: true,
      })

      toast.success("Repository initialized successfully")
      console.log("[v0] Repo created:", response.data)
    } catch (error) {
      console.error("[v0] Init repo error:", error)
      toast.error("Failed to initialize repository")
    } finally {
      setIsInitializing(false)
    }
  }

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      toast.error("Please enter a commit message")
      return
    }

    try {
      const response = await api.post("/api/git/commit", {
        project_id: projectId,
        message: commitMessage,
        files: {}, // TODO: Get current files from IDE
      })

      toast.success("Changes committed")
      setCommitMessage("")
      console.log("[v0] Commit created:", response.data)
    } catch (error) {
      console.error("[v0] Commit error:", error)
      toast.error("Failed to commit changes")
    }
  }

  const handlePush = async () => {
    try {
      const response = await api.post("/api/git/push", {
        project_id: projectId,
        branch: "main",
      })

      toast.success("Changes pushed to GitHub")
      console.log("[v0] Push successful:", response.data)
    } catch (error) {
      console.error("[v0] Push error:", error)
      toast.error("Failed to push changes")
    }
  }

  const handleCreateBranch = async () => {
    if (!branchName.trim()) {
      toast.error("Please enter a branch name")
      return
    }

    try {
      const response = await api.post("/api/git/branch", {
        project_id: projectId,
        branch_name: branchName,
        from_branch: "main",
      })

      toast.success(`Branch '${branchName}' created`)
      setBranchName("")
      console.log("[v0] Branch created:", response.data)
    } catch (error) {
      console.error("[v0] Branch error:", error)
      toast.error("Failed to create branch")
    }
  }

  const handleCreatePR = async () => {
    if (!prTitle.trim()) {
      toast.error("Please enter a PR title")
      return
    }

    try {
      const response = await api.post("/api/git/pr", {
        project_id: projectId,
        title: prTitle,
        body: prDescription,
        head: branchName || "feature",
        base: "main",
      })

      toast.success("Pull request created")
      setPrTitle("")
      setPrDescription("")
      console.log("[v0] PR created:", response.data)
    } catch (error) {
      console.error("[v0] PR error:", error)
      toast.error("Failed to create pull request")
    }
  }

  if (!repoUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Initialize Git Repository</CardTitle>
          <CardDescription>Create a GitHub repository for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleInitRepo} disabled={isInitializing} className="w-full gap-2">
            <GitBranch className="h-4 w-4" />
            {isInitializing ? "Initializing..." : "Initialize Repository"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="commit" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="commit">Commit</TabsTrigger>
        <TabsTrigger value="branch">Branch</TabsTrigger>
        <TabsTrigger value="pr">Pull Request</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="commit" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Commit Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message</Label>
              <Textarea
                id="commit-message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="feat: add new feature"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCommit} className="flex-1">
                Commit
              </Button>
              <Button onClick={handlePush} variant="outline" className="flex-1 bg-transparent">
                Push
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="branch" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Create Branch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input
                id="branch-name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="feature/new-feature"
              />
            </div>
            <Button onClick={handleCreateBranch} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Create Branch
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pr" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Create Pull Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pr-title">Title</Label>
              <Input
                id="pr-title"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                placeholder="Add new feature"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pr-description">Description</Label>
              <Textarea
                id="pr-description"
                value={prDescription}
                onChange={(e) => setPrDescription(e.target.value)}
                placeholder="Describe your changes..."
                rows={4}
              />
            </div>
            <Button onClick={handleCreatePR} className="w-full">
              Create Pull Request
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Commit History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">No commits yet</div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
