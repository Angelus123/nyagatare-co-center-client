import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany();
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function createCategory(data: any) {
  return prisma.category.create({ data });
}

export type Category = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
};

export async function updateCategory(id: string, data: Category) {
  const { id: _ignoredId, ...updateData } = data;
  console.log("Update Data:", updateData);

  return prisma.category.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}