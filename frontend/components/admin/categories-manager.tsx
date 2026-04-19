"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const fetchCategories = async () => {
    try {
      setFetching(true)
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) return

    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      })

      if (res.ok) {
        setNewCategory({ name: "", slug: "", description: "" })
        fetchCategories() // refresh list
      } else {
        const err = await res.json()
        alert(err.message || "Failed to add category")
      }
    } catch {
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem("adminToken")
        const res = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (res.ok) {
          fetchCategories() // refresh list
        } else {
          const err = await res.json()
          alert(err.message || "Failed to delete category")
        }
      } catch {
        alert("An error occurred")
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Slug (e.g., premium-sweets)"
              value={newCategory.slug}
              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <Button onClick={handleAddCategory} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white flex gap-2 items-center">
            <Plus size={18} />
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fetching ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-500">No categories found.</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.slug}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 flex gap-1.5 items-center"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                </div>
              )))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
