import { NextResponse } from "next/server";
import { updateProduct, getProductById } from "@/services/productService";

// GET: fetch a single product by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("❌ GET /error:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT: update product by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await req.json();
    const product = await updateProduct(id, data);

    return NextResponse.json(product);
  } catch (err) {
    console.error("❌ PUT /error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}