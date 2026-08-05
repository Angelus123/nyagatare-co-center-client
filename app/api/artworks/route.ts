import { NextResponse } from "next/server";
import { getArtWorks, createArtWork } from "@/services/artworkService";

export async function GET() {
  const artworks = await getArtWorks();
  return NextResponse.json(artworks);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const artwork = await createArtWork(data);
    return NextResponse.json(artwork);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }
}