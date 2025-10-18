import { NextResponse } from "next/server";
import connectToDb from "@/lib/connectDB";
import Obsfucated from "@/model/obsfucated";
import InjectedData from "@/model/InjectedData";
import Chat from "@/model/Chat";

export async function GET() {
  await connectToDb();

  try {
    const totalInjected = await InjectedData.countDocuments();
    const chats = await Chat.countDocuments();
    const totalMessages = totalInjected + chats;
    const flagged = await Chat.countDocuments({"classification.label" : "flagged"})
    const flaggedChats = totalInjected + flagged;
    return NextResponse.json({
      totalMessages,
      flaggedChats,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard overview" },
      { status: 500 }
    );
  }
}
