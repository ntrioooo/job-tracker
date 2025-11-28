"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
