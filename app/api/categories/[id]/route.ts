import { NextResponse } from "next/server";
import { updateCategory, getCategoryById, deleteCategory } from "@/services/categoryService";

// GET: fetch a single category by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (err) {
    console.error("❌ GET /categories/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// PUT: update category by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const data = await req.json();
    console.log("PUT data:", data);
    const category = await updateCategory(id, data);

    return NextResponse.json(category);
  } catch (err) {
    console.error("❌ PUT /categories/[id] error:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 400 });
  }
}

// DELETE: remove category by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const deletedCategory = await deleteCategory(id);

    return NextResponse.json(
      { message: "Category deleted successfully", deletedCategory },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ DELETE /categories/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 400 });
  }
}