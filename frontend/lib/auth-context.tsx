"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type User = {
  _id: string
  name: string
  email: string
  mobile: string
  role?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, mobile: string, role: string) => Promise<void>
  googleAuth: (name: string, email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/getcurrentuser`, { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [API_URL])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Login failed")
    setUser(data.user)
  }

  const signup = async (name: string, email: string, password: string, mobile: string, role: string) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password, mobile, role }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Sign up failed")
    setUser(data.user)
  }

  const googleAuth = async (name: string, email: string) => {
    const res = await fetch(`${API_URL}/api/auth/googlelogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Google login failed")
    setUser(data.user)
  }

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: "GET", credentials: "include" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, googleAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
