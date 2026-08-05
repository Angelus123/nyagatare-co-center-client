import { NextResponse } from "next/server";
import { updateOrder, getOrderById, deleteOrder } from "@/services/orderService";

// GET: fetch a single order by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("❌ GET /orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PUT: update order by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const data = await req.json();
    console.log("PUT data:", data);
    const order = await updateOrder(id, data);

    return NextResponse.json(order);
  } catch (err) {
    console.error("❌ PUT /orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 400 });
  }
}

// DELETE: remove order by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const deletedOrder = await deleteOrder(id);

    return NextResponse.json(
      { message: "Order deleted successfully", deletedOrder },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ DELETE /orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 400 });
  }
}