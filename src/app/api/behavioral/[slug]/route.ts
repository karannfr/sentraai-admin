import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/lib/connectDB";
import Chat from "@/model/Chat";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<void | Response> {
  try {
    const { slug } = await context.params; // await the promise

    await connectToDb();
    const chat = await Chat.findOne({ thread_id: slug });

    return NextResponse.json({ chat });
  } catch (error) {
    return NextResponse.json(
      { message: error ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
