"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { FileTree } from "@/components/ide/file-tree"
import { CodeEditor } from "@/components/ide/code-editor"
import { Terminal } from "@/components/ide/terminal"
import { Preview } from "@/components/ide/preview"
import { IDEHeader } from "@/components/ide/ide-header"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IDEPageProps {
  params: Promise<{ projectId: string }>
}

export default function IDEPage({ params }: IDEPageProps) {
  const { projectId } = use(params)
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [files, setFiles] = useState<Record<string, string>>({})

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
          <p className="mt-4 text-sm text-muted-foreground">Loading IDE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <IDEHeader projectId={projectId} />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* File Tree Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <FileTree
            projectId={projectId}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            files={files}
            onFilesChange={setFiles}
          />
        </ResizablePanel>

        <ResizableHandle />

        {/* Main Editor Area */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} minSize={40}>
              <CodeEditor projectId={projectId} selectedFile={selectedFile} files={files} onFilesChange={setFiles} />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={30} minSize={20}>
              <Tabs defaultValue="terminal" className="h-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-background">
                  <TabsTrigger value="terminal">Terminal</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="problems">Problems</TabsTrigger>
                </TabsList>
                <TabsContent value="terminal" className="h-[calc(100%-40px)] m-0 p-0">
                  <Terminal projectId={projectId} />
                </TabsContent>
                <TabsContent value="output" className="h-[calc(100%-40px)] m-0 p-4">
                  <div className="text-sm text-muted-foreground">Build output will appear here...</div>
                </TabsContent>
                <TabsContent value="problems" className="h-[calc(100%-40px)] m-0 p-4">
                  <div className="text-sm text-muted-foreground">No problems detected</div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <Preview projectId={projectId} files={files} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
