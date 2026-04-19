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
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, mobile: string, role: string) => Promise<void>
  googleAuth: (name: string, email: string) => Promise<void>
  logout: () => Promise<void>
  authHeaders: () => Record<string, string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  // Helper: get auth headers for API requests
  const authHeaders = (): Record<string, string> => {
    const t = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null)
    if (t) return { Authorization: `Bearer ${t}` }
    return {}
  }

  // Helper: save token to state + localStorage
  const saveToken = (t: string) => {
    setToken(t)
    if (typeof window !== "undefined") {
      localStorage.setItem("token", t)
    }
  }

  // Helper: clear token from state + localStorage
  const clearToken = () => {
    setToken(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Restore token from localStorage on page load
        const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (!savedToken) {
          setLoading(false)
          return
        }
        setToken(savedToken)

        const res = await fetch(`${API_URL}/api/user/getcurrentuser`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${savedToken}` },
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          // Token is invalid/expired, clear it
          clearToken()
          setUser(null)
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
    if (data.token) saveToken(data.token)
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
    if (data.token) saveToken(data.token)
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
    if (data.token) saveToken(data.token)
  }

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: authHeaders(),
    })
    setUser(null)
    clearToken()
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, login, signup, googleAuth, logout, authHeaders }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
