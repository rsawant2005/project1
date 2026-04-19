import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// GET single product by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const res = await fetch(`${API_URL}/api/products/${id}`, { cache: "no-store" })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Products proxy GET by ID error:", error)
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT update product (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const authHeader = request.headers.get("authorization") || ""

    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Products proxy PUT error:", error)
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 })
  }
}

// DELETE product (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization") || ""

    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": authHeader,
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Products proxy DELETE error:", error)
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 })
  }
}
