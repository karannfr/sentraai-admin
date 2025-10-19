import {NextResponse } from "next/server";
import connectToDb from "@/lib/connectDB";
import Obsfucated from "@/model/obsfucated";
import InjectedData from "@/model/InjectedData";
import Chat from "@/model/Chat";

export async function GET() {
  await connectToDb();

  try {
    // Count of obfuscated messages
    const obfuscationCount = await Obsfucated.countDocuments();

    // Count of injection attempts
    const injectionCount = await InjectedData.countDocuments();

    // Count of flagged chats
    const flaggedCount = await Chat.countDocuments({ "classification.label": "flagged" });

    return NextResponse.json({
      obfuscation: obfuscationCount,
      injection: injectionCount,
      flagged: flaggedCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard overview counts" },
      { status: 500 }
    );
  }
}
