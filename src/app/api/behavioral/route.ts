import { NextResponse, NextRequest } from "next/server";
import connectToDb from "@/lib/connectDB";
import Chat from "@/model/Chat";

export async function GET(req : NextRequest, res : NextResponse) {
    try{
    await connectToDb();
    const chats = await Chat.find({}).sort({createdAt : -1});
    return NextResponse.json({chats});
    }catch(err){
        NextResponse.json({message : err || "Something  Went Wrong"}, {status: 500});
    }
}