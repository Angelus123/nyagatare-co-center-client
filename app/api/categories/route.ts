import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/services/categoryService";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const category = await createCategory(data);
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }
}