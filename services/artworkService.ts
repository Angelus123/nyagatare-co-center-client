import { prisma } from "@/lib/prisma";

export async function getArtWorks() {
  return prisma.artwork.findMany();
}

export async function getArtWorkById(id: string) {
  return prisma.artwork.findUnique({
    where: { id },
  });
}

export async function createArtWork(data: any) {
  return prisma.artwork.create({ data });
}

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  price: number;
  status: "AVAILABLE" | "SOLD" | "RESERVED"; 
  medium: string;
  views: number;
  likes: number;
  featured: boolean;
  description?: string;
  imageUrl?: string;
  dimensions?: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function updateArtWork(id: string, data: Artwork) {
  const { id: _ignoredId, createdAt, ...updateData } = data;
  console.log("Update Data:", updateData);

  return prisma.artwork.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteArtWork(id: string) {
  return prisma.artwork.delete({
    where: { id },
  });
}