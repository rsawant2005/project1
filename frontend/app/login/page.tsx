"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { auth, provider } from "../../utils/firebase"
import { signInWithPopup } from "firebase/auth"
import { useAuth } from "@/lib/auth-context"



export default function LoginPage() {
  const router = useRouter()
  const { login, googleAuth } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("success") === "true") {
      setSuccessMessage("Account created successfully! Please log in.")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      if (user.displayName && user.email) {
        await googleAuth(user.displayName, user.email)
        router.push("/")
      } else {
        setError("Google login failed. Try again.")
      }
    } catch (err) {
      console.error("Google login error:", err)
      setError("Google login failed. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-amber-900 mb-2">Welcome Back</h1>
          <p className="text-amber-700">Sign in to your Surbhi Sweet Mart account</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
          {successMessage && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{successMessage}</div>}
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-serif text-amber-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
                            <label htmlFor="password" className="block text-sm font-serif text-amber-900 mb-2">Password</label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-amber-600 hover:text-amber-700">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link href="/forgot" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-serif py-3 rounded-lg transition-colors duration-200">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button onClick={handleGoogleLogin} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-serif py-3 rounded-lg transition-colors duration-200">
            Sign in with Google
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-amber-700">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-amber-600 hover:text-amber-700">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
