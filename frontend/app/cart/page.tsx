"use client"

import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart()
  const { user } = useAuth()

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4">
            Your Cart
          </h1>
          <p className="text-amber-800 text-lg max-w-2xl">
            Review your selected sweets before proceeding to checkout.
          </p>
          <div className="mt-6 h-1 w-24 bg-amber-600 rounded-full"></div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {cartCount === 0 ? (
            <div className="text-center bg-white py-16 rounded-xl shadow-md">
              <p className="text-amber-900 text-xl mb-6 font-serif">
                Your cart is empty.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-serif"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-amber-100">
                  <thead className="bg-amber-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900 uppercase font-serif">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900 uppercase font-serif">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900 uppercase font-serif">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900 uppercase font-serif">
                        Total
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-amber-100">
                              <Image
                                src={item.image} // ✅ Use item.image to get image
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-serif text-amber-900 text-lg">
                                {item.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-amber-800 font-serif">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id!, parseInt(e.target.value))
                            }
                            className="w-20 px-2 py-1 border border-amber-300 rounded-md text-amber-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                          />
                        </td>
                        <td className="px-6 py-4 text-amber-900 font-serif">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => removeFromCart(item.id!)}
                            className="text-red-600 hover:text-red-800 font-serif"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl shadow-md p-6 h-fit">
                <h2 className="text-2xl font-serif text-amber-900 mb-4">
                  Cart Summary
                </h2>

                <div className="space-y-3 text-amber-800 font-serif">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹50.00</span>
                  </div>
                  <div className="h-px bg-amber-200 my-3"></div>
                  <div className="flex justify-between text-xl font-bold text-amber-900">
                    <span>Total</span>
                    <span>₹{(subtotal + 50).toFixed(2)}</span>
                  </div>
                </div>

                {user ? (
                  <Link href="/checkout" className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-serif transition-colors duration-200 text-center block">
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link href="/login" className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-serif transition-colors duration-200 text-center block">
                    Sign in to Checkout
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
