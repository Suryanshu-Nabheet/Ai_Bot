"use client"

import { useEffect, useRef } from "react"
import { Terminal as XTerm } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { WebLinksAddon } from "xterm-addon-web-links"
import "xterm/css/xterm.css"

interface TerminalProps {
  projectId: string
}

export function Terminal({ projectId }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize xterm.js
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#0a0a0a",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        black: "#000000",
        red: "#cd3131",
        green: "#0dbc79",
        yellow: "#e5e510",
        blue: "#2472c8",
        magenta: "#bc3fbc",
        cyan: "#11a8cd",
        white: "#e5e5e5",
        brightBlack: "#666666",
        brightRed: "#f14c4c",
        brightGreen: "#23d18b",
        brightYellow: "#f5f543",
        brightBlue: "#3b8eea",
        brightMagenta: "#d670d6",
        brightCyan: "#29b8db",
        brightWhite: "#e5e5e5",
      },
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)

    term.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // Welcome message
    term.writeln("AI Dev Platform Terminal")
    term.writeln("Project: " + projectId)
    term.writeln("")
    term.write("$ ")

    // Handle input
    let currentLine = ""
    term.onData((data) => {
      const code = data.charCodeAt(0)

      if (code === 13) {
        // Enter key
        term.write("\r\n")
        if (currentLine.trim()) {
          executeCommand(currentLine.trim())
        }
        currentLine = ""
        term.write("$ ")
      } else if (code === 127) {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1)
          term.write("\b \b")
        }
      } else if (code >= 32) {
        // Printable characters
        currentLine += data
        term.write(data)
      }
    })

    const executeCommand = (command: string) => {
      // TODO: Send command to backend sandbox
      term.writeln(`[v0] Executing: ${command}`)
      term.writeln("Command execution not yet implemented")
    }

    // Handle resize
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      term.dispose()
    }
  }, [projectId])

  return <div ref={terminalRef} className="h-full w-full bg-[#0a0a0a] p-2" />
}
