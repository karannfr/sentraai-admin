// /api/chats/stats/route.ts
import { NextResponse } from "next/server";
import Chat from "@/model/Chat";
import connectToDb from "@/lib/connectDB";

export async function GET() {
  await connectToDb();

  const stats = await Chat.aggregate([
    {
      $group: {
        _id: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          label: "$classification.label",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.day",
        counts: {
          $push: { label: "$_id.label", count: "$count" },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const formatted = stats.map((entry) => {
    const safe = entry.counts.find((c: { label: string; }) => c.label === "safe")?.count || 0;
    const malicious = entry.counts.find((c: { label: string; }) => c.label === "malicious")?.count || 0;
    return { date: entry._id, safe, malicious };
  });

  return NextResponse.json(formatted);
}
