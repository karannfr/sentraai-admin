import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/lib/connectDB";
import BannedIP from "@/model/bannedIP";

export async function POST(req: NextRequest) {
    try{
        await connectToDb();
        const {ip} = await req.json();
        if(!ip)
            return NextResponse.json({message : "Bad Request - No IP Provided"}, {status: 400});
        await BannedIP.deleteOne({
            ipAddress : ip
        })
        return NextResponse.json({message : `${ip} unbanned`})
    }catch(err){
        return NextResponse.json({message : err || "Somethign went wrong"}, {status : 500});
    }
}