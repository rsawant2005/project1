"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif text-amber-100 mb-4">SURBHI</h3>
            <p className="text-sm text-amber-200 leading-relaxed mb-6">
              Crafting premium Indian sweets and delicacies with love and tradition since 1995.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="text-amber-200 hover:text-amber-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-amber-200 hover:text-amber-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm3.315-13.5c-.24 0-.435.195-.435.435v2.13c0 .24.195.435.435.435h2.13c.24 0 .435-.195.435-.435v-2.13c0-.24-.195-.435-.435-.435h-2.13zm-6.63 0c-.24 0-.435.195-.435.435v2.13c0 .24.195.435.435.435h2.13c.24 0 .435-.195.435-.435v-2.13c0-.24-.195-.435-.435-.435h-2.13zm3.315 6.75c-1.65 0-3.15-.825-4.035-2.205-.165-.285-.06-.645.225-.81.285-.165.645-.06.81.225.645 1.11 1.845 1.8 3 1.8s2.355-.69 3-1.8c.165-.285.525-.39.81-.225.285.165.39.525.225.81-.885 1.38-2.385 2.205-4.035 2.205z" />
                </svg>
              </a>
              <a href="#" className="text-amber-200 hover:text-amber-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 5.2-5.2 8.3A15.7 15.7 0 0123 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif text-amber-100 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/collection" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-serif text-amber-100 mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-200 hover:text-amber-100 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif text-amber-100 mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm text-amber-200">Mumbai Goa Road, Kankavli, Sindhudurg-416602</p>
              </div>
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p className="text-sm text-amber-200">+91 9403612881</p>
              </div>
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-amber-200">surbhi@sweetmart.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-amber-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-amber-300">© 2025 Surbhi Sweet Mart. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-amber-300 hover:text-amber-100 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-amber-300 hover:text-amber-100 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-amber-300 hover:text-amber-100 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
