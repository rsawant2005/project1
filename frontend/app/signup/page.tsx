"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { auth, provider } from "../../utils/firebase"
import { signInWithPopup } from "firebase/auth"
import { useAuth } from "@/lib/auth-context"

export default function SignUpPage() {
  const router = useRouter()
  const { signup, googleAuth } = useAuth()
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" , mobile:"", role: "customer" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      await signup(formData.name, formData.email, formData.password, formData.mobile, formData.role)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      if (user.displayName && user.email) {
        await googleAuth(user.displayName, user.email)
        router.push("/")
      } else {
        setError("Google signup failed. Try again.")
      }
    } catch (err) {
      console.error("Google signup error:", err)
      setError("Google signup failed. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-amber-900 mb-2">Create Account</h1>
          <p className="text-amber-700">Join Surbhi Sweet Mart today</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-serif text-amber-900 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder=""
                  className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" required />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-serif text-amber-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder=""
                  className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" required />
              </div>
            </div>
            <div>
              <label htmlFor="mobile" className="block text-sm font-serif text-amber-900 mb-2">Mobile No</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input id="mobile" name="mobile" type="number" value={formData.mobile} onChange={handleChange} placeholder=""
                  className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-serif text-amber-900 mb-2">Role</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={handleChange} className="form-radio text-amber-600 focus:ring-amber-600" />
                  <span className="ml-2 text-amber-900">Customer</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="role" value="delivery" checked={formData.role === 'delivery'} onChange={handleChange} className="form-radio text-amber-600 focus:ring-amber-600" />
                  <span className="ml-2 text-amber-900">Delivery Staff</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-serif text-amber-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-amber-600 hover:text-amber-700">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-serif text-amber-900 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-amber-600" />
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-amber-600 hover:text-amber-700">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-serif py-3 rounded-lg transition-colors duration-200">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <button onClick={handleGoogleSignup} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-serif py-3 rounded-lg transition-colors duration-200">
            Sign up with Google
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-amber-700">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
