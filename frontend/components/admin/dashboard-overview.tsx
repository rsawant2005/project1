"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Tags, IndianRupee, Star } from "lucide-react"

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    { label: "Total Products", value: 0, icon: Package },
    { label: "Categories", value: 0, icon: Tags },
    { label: "Total Inventory Value", value: `₹0`, icon: IndianRupee },
    { label: "Average Rating", value: "0", icon: Star },
  ])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories")
        ])

        const products = productsRes.ok ? await productsRes.json() : []
        const categories = categoriesRes.ok ? await categoriesRes.json() : []

        const totalValue = products.reduce((sum: number, p: any) => sum + (p.price || 0), 0)

        let avgRating = 0
        if (products.length > 0) {
          const sumRating = products.reduce((sum: number, p: any) => sum + (p.rating || 0), 0)
          avgRating = sumRating / products.length
        }

        setStats([
          { label: "Total Products", value: products.length, icon: Package },
          { label: "Categories", value: categories.length, icon: Tags },
          { label: "Total Inventory Value", value: `₹${totalValue.toLocaleString()}`, icon: IndianRupee },
          { label: "Average Rating", value: avgRating.toFixed(1), icon: Star },
        ])
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your products, categories, and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-amber-600"><stat.icon size={32} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}
