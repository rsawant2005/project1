"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { User } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { buttonVariants } from "@/components/ui/button"

export default function Header() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-amber-900/95 backdrop-blur-sm border-b border-amber-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/surbhi-sweet-mart-logo.jpg"
            alt="Surbhi Sweet Mart Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif text-amber-200">SURBHI</h1>
            <p className="text-xs text-amber-100">SWEET MART</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={buttonVariants({
                variant: "link",
                className: `text-amber-200 hover:text-amber-100 transition-colors duration-200 font-serif text-lg font-semibold ${pathname === link.href ? "active" : ""
                  }`,
              })}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex gap-8 items-center">
          {/* Cart Button */}
          <Link href="/cart">
            <button className="flex items-center gap-2 px-4 py-2 text-amber-100 hover:text-amber-300 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-base font-serif">Cart</span>
              {cartCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-amber-100 hover:text-amber-300 transition-colors duration-200">
                  <User className="w-6 h-6 rounded-full" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-amber-800 border-amber-700 text-amber-50">
                <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-amber-200 -mt-2">{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-amber-700" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="font-serif cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-amber-700" />
                <DropdownMenuItem onClick={logout} className="font-serif text-red-400 focus:text-red-300 focus:bg-red-900/50 cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-amber-50 rounded-lg transition-colors duration-200 font-serif text-base">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-amber-100 hover:text-amber-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
