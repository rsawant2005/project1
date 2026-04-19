import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// DELETE category by id (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization") || ""

    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": authHeader,
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Categories proxy DELETE error:", error)
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 })
  }
}
