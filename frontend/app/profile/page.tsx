"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/auth-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (user) {
      fetchOrders()
      interval = setInterval(() => {
        fetchOrders(true)
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [user])

  const fetchOrders = async (isBackgroundPoll = false) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/my`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      if (!isBackgroundPoll) setOrdersLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-amber-900 font-serif">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4">
                My Profile
              </h1>
              <p className="text-amber-800 text-lg max-w-2xl">
                View your account details and order history.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-fit px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-serif rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="mt-6 h-1 w-24 bg-amber-600 rounded-full"></div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* User Information */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-2xl font-serif text-amber-900 mb-6 border-b border-amber-100 pb-4">
              Account Details
            </h2>
            <div className="space-y-4 text-amber-800 font-serif">
              <div>
                <label className="text-sm text-amber-600 uppercase tracking-wider font-sans">Name</label>
                <p className="text-lg font-semibold text-amber-900">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-amber-600 uppercase tracking-wider font-sans">Email</label>
                <p className="text-lg font-semibold text-amber-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-amber-600 uppercase tracking-wider font-sans">Role</label>
                <p className="text-lg font-semibold text-amber-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden h-fit">
            <div className="p-6 border-b border-amber-100">
              <h2 className="text-2xl font-serif text-amber-900">My Orders</h2>
            </div>
            {ordersLoading ? (
              <p className="text-center text-gray-500 py-12 font-serif">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-amber-800 font-serif text-lg mb-4">No orders yet!</p>
                <Link href="/shop" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-serif transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50 border-b border-amber-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-serif text-amber-800 uppercase text-xs tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left font-serif text-amber-800 uppercase text-xs tracking-wider">Items</th>
                      <th className="px-6 py-4 text-left font-serif text-amber-800 uppercase text-xs tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left font-serif text-amber-800 uppercase text-xs tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left font-serif text-amber-800 uppercase text-xs tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-amber-900 font-serif">
                          {order.items.map((it) => `${it.name} ×${it.quantity}`).join(", ")}
                        </td>
                        <td className="px-6 py-4 font-serif text-amber-900 font-bold">₹{order.total}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-amber-800 font-serif whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
