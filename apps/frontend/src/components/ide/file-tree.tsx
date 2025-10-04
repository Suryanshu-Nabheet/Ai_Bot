"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, FileCode, FileJson, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileTreeProps {
  projectId: string
  selectedFile: string | null
  onSelectFile: (path: string) => void
  files: Record<string, string>
  onFilesChange: (files: Record<string, string>) => void
}

interface FileNode {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileNode[]
}

export function FileTree({ projectId, selectedFile, onSelectFile, files, onFilesChange }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState("")

  // Build file tree from flat file list
  const buildFileTree = (): FileNode[] => {
    const root: FileNode[] = []
    const filePaths = Object.keys(files)

    filePaths.forEach((path) => {
      const parts = path.split("/").filter(Boolean)
      let currentLevel = root

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1
        const fullPath = "/" + parts.slice(0, index + 1).join("/")

        let existing = currentLevel.find((node) => node.name === part)

        if (!existing) {
          existing = {
            name: part,
            path: fullPath,
            type: isFile ? "file" : "folder",
            children: isFile ? undefined : [],
          }
          currentLevel.push(existing)
        }

        if (!isFile && existing.children) {
          currentLevel = existing.children
        }
      })
    })

    return root
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".json")) return <FileJson className="h-4 w-4 text-yellow-500" />
    if (fileName.endsWith(".md")) return <FileText className="h-4 w-4 text-blue-500" />
    if (fileName.match(/\.(ts|tsx|js|jsx)$/)) return <FileCode className="h-4 w-4 text-blue-400" />
    return <File className="h-4 w-4 text-muted-foreground" />
  }

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.path)
    const isSelected = selectedFile === node.path

    if (node.type === "folder") {
      return (
        <div key={node.path}>
          <button
            onClick={() => toggleFolder(node.path)}
            className="flex w-full items-center gap-1 px-2 py-1 text-sm hover:bg-accent"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )}
            <span>{node.name}</span>
          </button>
          {isExpanded && node.children && <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>}
        </div>
      )
    }

    return (
      <button
        key={node.path}
        onClick={() => onSelectFile(node.path)}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-1 text-sm hover:bg-accent",
          isSelected && "bg-accent text-accent-foreground",
        )}
        style={{ paddingLeft: `${depth * 12 + 24}px` }}
      >
        {getFileIcon(node.name)}
        <span>{node.name}</span>
      </button>
    )
  }

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const path = "/" + newFileName.trim()
      onFilesChange({ ...files, [path]: "" })
      onSelectFile(path)
      setNewFileName("")
      setIsCreating(false)
    }
  }

  const fileTree = buildFileTree()

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex items-center justify-between border-b p-2">
        <span className="text-sm font-semibold">Files</span>
        <Button onClick={() => setIsCreating(true)} size="sm" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-1">
          {isCreating && (
            <div className="mb-2 px-2">
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFile()
                  if (e.key === "Escape") setIsCreating(false)
                }}
                placeholder="filename.tsx"
                className="h-7 text-sm"
                autoFocus
              />
            </div>
          )}
          {fileTree.map((node) => renderNode(node))}
        </div>
      </ScrollArea>
    </div>
  )
}
