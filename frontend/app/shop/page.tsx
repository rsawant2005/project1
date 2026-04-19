"use client"

import { useMemo, useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { allProducts } from "@/lib/products"
import { useCart } from "@/lib/cart-context"

interface Product {
  _id?: string
  id?: number
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  description?: string
  stock?: number
}

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{ _id: string, name: string, slug: string }>>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/products`),
          fetch(`/api/admin/categories`)
        ])

        if (productsRes.ok) {
          const dbProducts = await productsRes.json()
          setProducts(dbProducts)
        } else {
          setProducts([])
        }

        if (categoriesRes.ok) {
          const dbCategories = await categoriesRes.json()
          setCategories(dbCategories)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, []) // Only fetch once on mount — category filtering is handled in useMemo

  const filteredProducts = useMemo(() => {
    if (categoryFilter) {
      return products.filter((p) => p.category === categoryFilter)
    }
    return products
  }, [products, categoryFilter])

  const activeCategoryName = useMemo(() => {
    if (!categoryFilter) return "All Products"
    const cat = categories.find(c => c.slug === categoryFilter)
    return cat ? cat.name : "All Products"
  }, [categories, categoryFilter])

  const getProductId = (product: Product) => product._id || String(product.id)

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />

      {/* Shop Header */}
      <section className="pt-32 pb-12 px-6 md:px-12 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4">
            {activeCategoryName}
          </h1>
          {loading ? (
            <p className="text-amber-800 text-lg">Loading...</p>
          ) : (
            <p className="text-amber-800 text-lg">{filteredProducts.length} products available</p>
          )}
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-amber-900 mb-4 text-center">Categories</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/shop"
                className={`px-4 py-2 rounded-lg font-serif ${!categoryFilter
                  ? "bg-amber-600 text-white"
                  : "bg-white text-amber-900 border border-amber-300 hover:bg-amber-100"
                  }`}
              >
                All
              </a>
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/shop?category=${category.slug}`}
                  className={`px-4 py-2 rounded-lg font-serif ${categoryFilter === category.slug
                    ? "bg-amber-600 text-white"
                    : "bg-white text-amber-900 border border-amber-300 hover:bg-amber-100"
                    }`}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden bg-amber-100">
                    <Link href={`/product/${getProductId(product)}`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-serif px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/product/${getProductId(product)}`}>
                      <h3 className="text-lg font-serif text-amber-900 mb-2 hover:underline">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-gray-300"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-serif text-amber-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2 font-serif">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        <span className="text-sm font-serif text-amber-700 px-2 block md:inline mt-1 md:mt-0">
                          per {(product as any).unit || "KG"}
                        </span>
                      </div>
                      {product.stock === 0 ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-400 text-white cursor-not-allowed rounded-lg font-serif text-sm inline-block text-center"
                        >
                          Out of Stock
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({ ...product, id: product._id || product.id } as any)
                          }}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 font-serif text-sm inline-block text-center"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
