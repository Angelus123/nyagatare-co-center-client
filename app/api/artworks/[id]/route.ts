import { NextResponse } from "next/server";
import { updateArtWork, getArtWorkById, deleteArtWork } from "@/services/artworkService";

// GET: fetch a single product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const product = await getArtWorkById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("❌ GET /artworks/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT: update product by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const data = await req.json();
    console.log("PUT data:", data);
    const product = await updateArtWork(id, data);

    return NextResponse.json(product);
  } catch (err) {
    console.error("❌ PUT /artworks/[id] error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}

// DELETE: remove product by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const deletedProduct = await deleteArtWork(id);

    return NextResponse.json(
      { message: "Product deleted successfully", deletedProduct },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ DELETE /artworks/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
  }
}
