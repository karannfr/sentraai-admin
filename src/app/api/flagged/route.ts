import { NextResponse } from "next/server";
import connectToDb from "@/lib/connectDB";
import InjectedData from "@/model/InjectedData";


const uri = process.env.MONGO_URI!;

export async function GET() {
  try {
    await connectToDb();
    const flaggedData = await InjectedData.find().sort({ createdAt: -1 });

    return NextResponse.json(flaggedData);
  } catch (error) {
    console.error("Error fetching flagged data:", error);
    return NextResponse.json({ error: "Failed to fetch flagged data" }, { status: 500 });
  }
}
