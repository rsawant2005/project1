"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Shop location: 7P75+HG Kalmath, Kankavli, Maharashtra
const SHOP_LAT = 16.2653
const SHOP_LNG = 73.6972
const MAX_DELIVERY_RADIUS_KM = 20

// Haversine formula to calculate distance between two lat/lng points
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, callback: () => void) => void
    }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, cartCount, clearCart } = useCart()
  const { user, loading } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [placing, setPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Location verification states
  const [locationStatus, setLocationStatus] = useState<"idle" | "checking" | "within" | "outside" | "error">("idle")
  const [distanceKm, setDistanceKm] = useState<number | null>(null)

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 50
  const total = subtotal + shipping

  // Load Razorpay checkout.js script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [id]: value }))
  }

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error")
      alert("Geolocation is not supported by your browser.")
      return
    }
    setLocationStatus("checking")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const dist = getDistanceKm(
          position.coords.latitude,
          position.coords.longitude,
          SHOP_LAT,
          SHOP_LNG
        )
        setDistanceKm(Math.round(dist * 10) / 10)
        setLocationStatus(dist <= MAX_DELIVERY_RADIUS_KM ? "within" : "outside")
      },
      () => {
        setLocationStatus("error")
      }
    )
  }

  const handlePlaceOrder = async () => {
    const { name, email, mobile, address, city, state, pincode } = shippingAddress
    if (!name || !email || !mobile || !address || !city || !state || !pincode) {
      alert("Please fill in all shipping details.")
      return
    }

    if (locationStatus !== "within") {
      alert("Please verify your delivery location first.")
      return
    }

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment()
    } else {
      await submitOrderToServer()
    }
  }

  const handleRazorpayPayment = async () => {
    setPlacing(true)
    try {
      // Step 1: Create Razorpay order on backend
      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: total }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.message || "Failed to create payment order. Please try again.")
        setPlacing(false)
        return
      }

      const data = await res.json()

      // Step 2: Open Razorpay checkout modal
      const options: Record<string, unknown> = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Surbhi's Bakery",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (verifyRes.ok) {
              // Step 4: Place the order with payment details
              await submitOrderToServer(
                response.razorpay_order_id,
                response.razorpay_payment_id
              )
            } else {
              alert("Payment verification failed. Please contact support.")
              setPlacing(false)
            }
          } catch {
            alert("Payment verification error. Please contact support.")
            setPlacing(false)
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.mobile,
        },
        theme: {
          color: "#d97706",
        },
        modal: {
          ondismiss: function () {
            setPlacing(false)
          },
        },
      }


      if (typeof window.Razorpay === "undefined") {
        alert("Payment gateway is loading. Please try again in a moment.")
        setPlacing(false)
        return
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch {
      alert("An error occurred while initiating payment. Please try again.")
      setPlacing(false)
    }
  }

  const submitOrderToServer = async (
    razorpayOrderId?: string,
    razorpayPaymentId?: string
  ) => {
    setPlacing(true)
    try {
      const orderItems = cartItems.map((item) => ({
        productId: String((item as any)._id || item.id),
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }))

      const orderBody: Record<string, unknown> = {
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod === "razorpay" ? "razorpay" : paymentMethod,
      }

      if (razorpayOrderId) orderBody.razorpayOrderId = razorpayOrderId
      if (razorpayPaymentId) orderBody.razorpayPaymentId = razorpayPaymentId

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderBody),
      })

      if (res.ok) {
        clearCart()
        setOrderSuccess(true)
      } else {
        const err = await res.json()
        alert(err.message || "Failed to place order. Please log in first.")
      }
    } catch {
      alert("An error occurred. Please try again.")
    } finally {
      setPlacing(false)
    }
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-amber-50">
        <Header />
        <section className="pt-32 pb-16 px-6 md:px-12 flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-md w-full">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-serif text-amber-900 mb-4">Order Placed!</h1>
            <p className="text-amber-700 mb-8 font-serif">
              Thank you for your order. We will start preparing it right away!
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/profile" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-serif text-center transition-colors">
                View My Orders
              </Link>
              <Link href="/shop" className="border border-amber-600 text-amber-700 hover:bg-amber-50 px-6 py-3 rounded-lg font-serif text-center transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4">Checkout</h1>
          <p className="text-amber-800 text-lg max-w-2xl">
            Complete your order by providing the details below.
          </p>
          <div className="mt-6 h-1 w-24 bg-amber-600 rounded-full"></div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {!loading && !user ? (
            <div className="text-center bg-white py-16 rounded-xl shadow-md">
              <p className="text-amber-900 text-xl mb-6 font-serif">
                You must be signed in to proceed to checkout.
              </p>
              <Link href="/login" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-serif">
                Sign In
              </Link>
            </div>
          ) : cartCount === 0 ? (
            <div className="text-center bg-white py-16 rounded-xl shadow-md">
              <p className="text-amber-900 text-xl mb-6 font-serif">
                Your cart is empty. You cannot proceed to checkout.
              </p>
              <Link href="/shop" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-serif">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Shipping and Payment */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-white rounded-xl shadow-md overflow-hidden">
                  <CardHeader>
                    <CardTitle className="font-serif text-amber-900 text-2xl">Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-serif text-amber-800">Full Name</Label>
                        <Input id="name" placeholder="Surbhi Jain" className="font-serif" onChange={handleChange} value={shippingAddress.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-serif text-amber-800">Email</Label>
                        <Input id="email" type="email" placeholder="surbhi@example.com" className="font-serif" onChange={handleChange} value={shippingAddress.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="font-serif text-amber-800">Mobile No.</Label>
                        <Input id="mobile" type="tel" placeholder="9876543210" className="font-serif" onChange={handleChange} value={shippingAddress.mobile} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="font-serif text-amber-800">Address</Label>
                      <Input id="address" placeholder="123 Sweet Lane" className="font-serif" onChange={handleChange} value={shippingAddress.address} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="font-serif text-amber-800">City</Label>
                        <Input id="city" placeholder="Nagpur" className="font-serif" onChange={handleChange} value={shippingAddress.city} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="font-serif text-amber-800">State</Label>
                        <Input id="state" placeholder="Maharashtra" className="font-serif" onChange={handleChange} value={shippingAddress.state} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode" className="font-serif text-amber-800">Pin Code</Label>
                        <Input id="pincode" placeholder="440022" className="font-serif" onChange={handleChange} value={shippingAddress.pincode} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-xl shadow-md overflow-hidden">
                  <CardHeader>
                    <CardTitle className="font-serif text-amber-900 text-2xl">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border border-amber-200 rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="font-serif text-amber-800">Cash on Delivery</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-amber-200 rounded-lg">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="font-serif text-amber-800">
                          <span className="font-semibold block">Pay Online (Razorpay)</span>
                          <span className="text-sm text-amber-600 block mt-1">UPI, Cards, Net Banking, Wallets & more</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Delivery Location Verification */}
                <Card className="bg-white rounded-xl shadow-md overflow-hidden">
                  <CardHeader>
                    <CardTitle className="font-serif text-amber-900 text-2xl">Delivery Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-amber-700 font-serif text-sm">
                      We deliver within <strong>{MAX_DELIVERY_RADIUS_KM} km</strong> of our shop. Please verify your location to proceed.
                    </p>

                    {locationStatus === "idle" && (
                      <Button
                        onClick={checkLocation}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif"
                      >
                        📍 Verify My Location
                      </Button>
                    )}

                    {locationStatus === "checking" && (
                      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="w-5 h-5 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                        <span className="text-amber-800 font-serif">Checking your location...</span>
                      </div>
                    )}

                    {locationStatus === "within" && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-800 font-serif font-semibold">Delivery available!</span>
                        </div>
                        <p className="text-green-700 font-serif text-sm mt-1">
                          You are {distanceKm} km from our shop — within our delivery range.
                        </p>
                      </div>
                    )}

                    {locationStatus === "outside" && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-red-800 font-serif font-semibold">Outside delivery area</span>
                        </div>
                        <p className="text-red-700 font-serif text-sm mt-1">
                          You are {distanceKm} km from our shop. We only deliver within {MAX_DELIVERY_RADIUS_KM} km.
                        </p>
                        <Button
                          onClick={checkLocation}
                          variant="outline"
                          className="mt-3 border-red-300 text-red-700 hover:bg-red-50 font-serif"
                        >
                          Re-check Location
                        </Button>
                      </div>
                    )}

                    {locationStatus === "error" && (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-yellow-800 font-serif text-sm">
                          Unable to access your location. Please allow location access in your browser and try again.
                        </p>
                        <Button
                          onClick={checkLocation}
                          variant="outline"
                          className="mt-3 border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-serif"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-md p-6 h-fit">
                <h2 className="text-2xl font-serif text-amber-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm font-serif text-amber-800">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 text-amber-800 font-serif">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-amber-200 my-3"></div>
                  <div className="flex justify-between text-xl font-bold text-amber-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={placing || locationStatus !== "within"}
                  className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-serif transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placing ? "Processing..." : paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
