import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// GET all products (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const queryString = category ? `?category=${category}` : ""

    const res = await fetch(`${API_URL}/api/products${queryString}`, { cache: "no-store" })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Products proxy GET error:", error)
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 })
  }
}

// POST create product (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization") || ""

    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Products proxy POST error:", error)
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
  }
}
