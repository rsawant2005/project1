"use client"
import { use, useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

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
  unit?: string
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-amber-50">
        <Header />
        <div className="flex justify-center items-center h-screen px-6 pt-32 pb-12">
          <p className="text-xl text-amber-800">Loading product details...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-amber-50">
        <Header />
        <div className="flex flex-col justify-center items-center h-screen px-6 pt-32 pb-12">
          <h1 className="text-4xl text-amber-900 mb-4 font-serif">Product Not Found</h1>
          <Link href="/shop" className="text-amber-600 hover:text-amber-700 underline font-serif">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />
      <section className="pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 flex justify-center items-center bg-amber-100">
            <div className="relative w-full h-80 md:h-96">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              {product.badge && (
                <span className="absolute top-4 right-4 bg-amber-600 text-white text-sm font-serif px-3 py-1 rounded">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-serif text-amber-900 mb-2">{product.name}</h1>
            <p className="text-sm font-serif text-amber-600 capitalize mb-4">{product.category}</p>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-gray-300"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-serif text-amber-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through font-serif">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-lg font-serif text-amber-700 mt-2">
                per {product.unit || "KG"}
              </span>
            </div>

            <div className="mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-xl font-serif text-amber-900 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed font-serif">
                {product.description || "No description available for this product."}
              </p>
            </div>
            
            <div className={`mb-6 text-lg font-serif ${product.stock === 0 ? "text-red-500 font-semibold" : "text-amber-800"}`}>
              {product.stock === 0 ? "Currently Out of Stock" : `Available in stock: ${product.stock ?? 0}`}
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              {product.stock === 0 ? (
                <button
                  disabled
                  className="px-8 py-3 bg-red-100 text-red-600 border border-red-200 cursor-not-allowed rounded-lg font-serif text-lg font-semibold flex-1"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={() => addToCart({ ...product, id: product._id || product.id } as any)}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 font-serif text-lg font-semibold shadow-md flex-1 text-center"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
