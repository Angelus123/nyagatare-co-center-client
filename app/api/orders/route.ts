import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/services/orderService";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const order = await createOrder(data);
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }
}