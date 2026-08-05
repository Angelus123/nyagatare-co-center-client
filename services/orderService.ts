import { prisma } from "@/lib/prisma";

export async function getOrders() {
  return prisma.order.findMany();
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
  });
}

export async function createOrder(data: any) {
  return prisma.order.create({ data });
}

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"; // Assuming common OrderStatus enum values
  totalAmount: number;
  shippingFee: number;
  taxAmount: number;
  customerNote?: string;
  shippingFullName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone?: string;
  billingFullName: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  deliveredAt?: Date;
};

export async function updateOrder(id: string, data: Order) {
  const { id: _ignoredId, createdAt, ...updateData } = data;
  console.log("Update Data:", updateData);

  return prisma.order.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteOrder(id: string) {
  return prisma.order.delete({
    where: { id },
  });
}