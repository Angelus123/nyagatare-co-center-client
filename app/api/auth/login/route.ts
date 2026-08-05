import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

export async function GET() {
  return NextResponse.json({
    message: "👋 Welcome to the Login API. Use POST to log in with your credentials.",
  });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Use findFirst instead of findUnique until index is fixed in Mongo
    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
    });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }
console.log("Verifying password for user:", password, "password:", user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }
    console.log("Password is valid:", isPasswordValid);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated JWT:", token);

    return NextResponse.json({
      message: "Login successful ✅",
      welcome: `Welcome back, ${user.firstName ?? "friend"}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
