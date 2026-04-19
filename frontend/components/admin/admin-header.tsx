"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error", error)
    }
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-serif font-bold text-amber-900">Surbhi Sweet Mart <span className="text-gray-500 font-sans text-lg font-normal ml-2">| Admin Dashboard</span></h2>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
      >
        Logout
      </Button>
    </header>
  )
}
