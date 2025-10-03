import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connectDB";
import InjectedData from "@/model/InjectedData";
import { IInjectedData } from "@/types/InjectedData";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const data = await InjectedData.find({}).lean();

    return NextResponse.json(
      { data: data as IInjectedData[] },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/your-endpoint failed:", err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
