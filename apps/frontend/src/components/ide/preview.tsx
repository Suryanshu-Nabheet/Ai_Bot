"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Smartphone, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface PreviewProps {
  projectId: string
  files: Record<string, string>
}

export function Preview({ projectId, files }: PreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")

  useEffect(() => {
    // TODO: Generate preview URL from backend
    setPreviewUrl(`http://localhost:3001/${projectId}`)
  }, [projectId])

  const handleRefresh = () => {
    setIsLoading(true)
    // Force iframe reload
    const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleOpenExternal = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank")
    }
  }

  return (
    <div className="flex h-full flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b p-2">
        <span className="text-sm font-semibold">Preview</span>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => setViewMode("desktop")}
            size="sm"
            variant={viewMode === "desktop" ? "secondary" : "ghost"}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setViewMode("mobile")}
            size="sm"
            variant={viewMode === "mobile" ? "secondary" : "ghost"}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button onClick={handleRefresh} size="sm" variant="ghost" disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button onClick={handleOpenExternal} size="sm" variant="ghost">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-muted p-4">
        <div
          className={cn("mx-auto h-full bg-background shadow-lg", viewMode === "mobile" ? "max-w-[375px]" : "w-full")}
        >
          {previewUrl ? (
            <iframe
              id="preview-iframe"
              src={previewUrl}
              className="h-full w-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">Preview not available</p>
                <p className="mt-1 text-xs">Run the project to see a live preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
