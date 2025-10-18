import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/lib/connectDB";
import Chat from "@/model/Chat";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = await params;
  try{
    await connectToDb();
    const chat = await Chat.findOne({thread_id : slug});
    return NextResponse.json({chat})
  }catch(err){
    return NextResponse.json({message : err || "Something went wrong"}, {status : 500})
  }

}
