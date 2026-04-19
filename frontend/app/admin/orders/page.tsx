"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  userId: { name: string; email: string } | null
  items: OrderItem[]
  total: number
  status: string
  paymentMethod: string
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const ALL_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function OrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchOrders()
    }
  }, [router])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`${API_URL}/api/orders/all`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        )
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600 mt-2">View and manage customer orders</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-500 py-8 text-center">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">No orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Order ID</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Items</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-semibold font-mono text-xs">
                              #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              {order.userId?.name || "Guest"}
                              <br />
                              <span className="text-gray-500 text-xs">{order.userId?.email}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              <ul className="list-disc list-inside text-xs space-y-1">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.name} <span className="text-gray-400 font-semibold px-1">x{item.quantity}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-semibold">₹{order.total}</td>
                            <td className="px-4 py-3 text-gray-600 uppercase text-xs">{order.paymentMethod}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-amber-500"
                              >
                                {ALL_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
