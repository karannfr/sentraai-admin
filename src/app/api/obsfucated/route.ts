import connectToDb from "@/lib/connectDB";
import Obsfucated from "@/model/obsfucated";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectToDb();
  try {
    const data = await Obsfucated.find().sort({ createdAt: -1 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch obfuscated data" }, { status: 500 });
  }
}
