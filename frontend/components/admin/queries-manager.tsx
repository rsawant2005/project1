"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

interface QueryMsg {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

export default function QueriesManager() {
  const [queries, setQueries] = useState<QueryMsg[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken") || ""
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        const res = await fetch(`${API_URL}/api/messages`, {
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setQueries(data)
        }
      } catch (error) {
        console.error("Failed to fetch queries", error)
      } finally {
        setLoading(false)
      }
    }
    fetchQueries()
  }, [])

  const filteredQueries = queries.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Queries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search queries by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading queries...</p>
            ) : filteredQueries.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No queries found.</p>
              </div>
            ) : (
              filteredQueries.map((query) => (
                <div key={query._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{query.name}</h3>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>📧 {query.email}</span>
                        <span>📱 {query.phone}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {formatDate(query.createdAt)}
                    </span>
                  </div>
                  <div className="bg-amber-50 rounded p-4 text-gray-800 border border-amber-100">
                    <p className="whitespace-pre-wrap">{query.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
