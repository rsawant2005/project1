"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Product, allProducts } from "./products"
import { useAuth } from "./auth-context"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Product) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { user, authHeaders } = useAuth()

  // Load cart from DB when user logs in; clear when they log out
  useEffect(() => {
    if (user) {
      restoreCartFromDB()
    } else {
      setCartItems([])
    }
  }, [user])

  /**
   * Fetch cartData { productId: quantity } from DB,
   * then match against the static product list to rebuild full cart items.
   * Also fetch any DB-stored products so recently-added ones are included.
   */
  const restoreCartFromDB = async () => {
    try {
      // 1. Get the cart map from DB
      const cartRes = await fetch(`${API_URL}/api/cart`, {
        credentials: "include",
        headers: authHeaders(),
      })
      if (!cartRes.ok) return
      const cartData: Record<string, number> = await cartRes.json()

      if (!cartData || Object.keys(cartData).length === 0) return

      // 2. Get any DB products (to include admin-added products in lookup)
      let dbProducts: Product[] = []
      try {
        const prodRes = await fetch(`${API_URL}/api/products`)
        if (prodRes.ok) dbProducts = await prodRes.json()
      } catch { /* silent */ }

      // 3. Build a lookup of all products by id (string)
      const allAvailable: Product[] = [...dbProducts, ...allProducts]
      const productLookup = new Map<string, Product>()
      for (const p of allAvailable) {
        // DB products use _id (string), static products use numeric id
        if ((p as any)._id) productLookup.set(String((p as any)._id), p)
        if (p.id !== undefined) productLookup.set(String(p.id), p)
      }

      // 4. Rebuild cart items
      const restored: CartItem[] = []
      for (const [productId, quantity] of Object.entries(cartData)) {
        if (quantity <= 0) continue
        const product = productLookup.get(productId)
        if (product) {
          restored.push({ ...product, quantity })
        }
      }

      if (restored.length > 0) {
        setCartItems(restored)
      }
    } catch {
      // Silent fail — cart just starts empty
    }
  }

  const addToCart = async (item: Product) => {
    // Determine existing quantity
    const existingQuantity = cartItems.find((i) => i.id === item.id)?.quantity || 0;

    if (item.stock !== undefined && existingQuantity + 1 > item.stock) {
      alert(`Only ${item.stock} items available in stock`);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })

    // Sync to DB if logged in
    if (user) {
      try {
        await fetch(`${API_URL}/api/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
          body: JSON.stringify({ productId: String(item.id) }),
        })
      } catch { /* silent */ }
    }
  }

  const removeFromCart = async (id: string | number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

    if (user) {
      try {
        await fetch(`${API_URL}/api/cart/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: authHeaders(),
        })
      } catch { /* silent */ }
    }
  }

  const updateQuantity = async (id: string | number, quantity: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (item.stock !== undefined && quantity > item.stock) {
      alert(`Only ${item.stock} items available in stock`);
      setCartItems((prevItems) => [...prevItems]); // Force re-render to reset input value
      return;
    }

    setCartItems((prevItems) =>
      quantity <= 0
        ? prevItems.filter((item) => item.id !== id)
        : prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )

    if (user) {
      try {
        await fetch(`${API_URL}/api/cart`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
          body: JSON.stringify({ productId: String(id), quantity }),
        })
      } catch { /* silent */ }
    }
  }

  const clearCart = async () => {
    setCartItems([])

    if (user) {
      try {
        await fetch(`${API_URL}/api/cart/clear`, {
          method: "DELETE",
          credentials: "include",
          headers: authHeaders(),
        })
      } catch { /* silent */ }
    }
  }

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}