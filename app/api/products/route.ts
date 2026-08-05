import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/services/productService";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const product = await createProduct(data);
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }
}
