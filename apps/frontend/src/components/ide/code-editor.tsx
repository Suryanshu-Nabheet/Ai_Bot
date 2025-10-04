"use client"

import { useEffect, useRef, useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import type * as Monaco from "monaco-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"

interface CodeEditorProps {
  projectId: string
  selectedFile: string | null
  files: Record<string, string>
  onFilesChange: (files: Record<string, string>) => void
}

export function CodeEditor({ projectId, selectedFile, files, onFilesChange }: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    if (selectedFile && !openTabs.includes(selectedFile)) {
      setOpenTabs([...openTabs, selectedFile])
      setActiveTab(selectedFile)
    } else if (selectedFile) {
      setActiveTab(selectedFile)
    }
  }, [selectedFile])

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure Monaco editor
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0a0a0a",
      },
    })
    monaco.editor.setTheme("custom-dark")

    // Enable format on save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction("editor.action.formatDocument")?.run()
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      onFilesChange({ ...files, [activeTab]: value })
    }
  }

  const closeTab = (path: string) => {
    const newTabs = openTabs.filter((tab) => tab !== path)
    setOpenTabs(newTabs)
    if (activeTab === path) {
      setActiveTab(newTabs[newTabs.length - 1] || null)
    }
  }

  const getLanguage = (fileName: string): string => {
    if (fileName.endsWith(".tsx") || fileName.endsWith(".ts")) return "typescript"
    if (fileName.endsWith(".jsx") || fileName.endsWith(".js")) return "javascript"
    if (fileName.endsWith(".json")) return "json"
    if (fileName.endsWith(".css")) return "css"
    if (fileName.endsWith(".html")) return "html"
    if (fileName.endsWith(".md")) return "markdown"
    if (fileName.endsWith(".py")) return "python"
    return "plaintext"
  }

  const getFileName = (path: string) => path.split("/").pop() || path

  if (openTabs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No file selected</p>
          <p className="mt-1 text-xs">Select a file from the tree to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="flex-1">
        <div className="flex items-center border-b bg-background">
          <TabsList className="h-10 w-full justify-start rounded-none border-0 bg-transparent p-0">
            {openTabs.map((tab) => (
              <div key={tab} className="group relative flex items-center">
                <TabsTrigger value={tab} className="h-10 gap-2 rounded-none border-r data-[state=active]:bg-accent">
                  <span className="text-xs">{getFileName(tab)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(tab)
                    }}
                    className="opacity-0 hover:bg-accent-foreground/10 group-hover:opacity-100 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
        </div>

        {openTabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="m-0 h-[calc(100%-40px)]">
            <Editor
              height="100%"
              language={getLanguage(tab)}
              value={files[tab] || ""}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                rulers: [80, 120],
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
