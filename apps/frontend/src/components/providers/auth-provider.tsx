"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loginWithGithub: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("access_token")
    if (token) {
      fetchUser(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem("access_token")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github`
  }

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      localStorage.removeItem("access_token")
      setUser(null)
      router.push("/")
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, loginWithGithub, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
