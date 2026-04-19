"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, PlusCircle, Tags, ClipboardList, MessageSquare } from "lucide-react"

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Add Product", href: "/admin/products/add", icon: PlusCircle },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Queries", href: "/admin/queries", icon: MessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-amber-900 text-white shadow-lg">
      <div className="p-6 border-b border-amber-800">
        <h1 className="text-2xl font-serif font-bold">SURBHI</h1>
        <p className="text-sm text-amber-200">Admin Panel</p>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === item.href ? "bg-amber-700 text-white" : "text-amber-100 hover:bg-amber-800",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
