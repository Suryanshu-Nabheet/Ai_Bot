"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { GitPanel } from "@/components/git/git-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface GitPageProps {
  params: Promise<{ projectId: string }>
}

export default function GitPage({ params }: GitPageProps) {
  const { projectId } = use(params)
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
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
          <h1 className="text-xl font-bold">Git Management</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <GitPanel projectId={projectId} />
      </main>
    </div>
  )
}
