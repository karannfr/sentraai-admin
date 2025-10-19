import { NextRequest, NextResponse } from "next/server";
import connectToDb from "@/lib/connectDB";
import BannedIP from "@/model/bannedIP";

export async function POST(req: NextRequest) {
    try{
        await connectToDb();
        const {ip} = await req.json();
        if(!ip)
            return NextResponse.json({message : "Bad Request - No IP Provided"}, {status: 400});
        await BannedIP.create({
            ipAddress : ip
        })
        return NextResponse.json({message : `${ip} banned`})
    }catch(err){
        return NextResponse.json({message : err || "Somethign went wrong"}, {status : 500});
    }
}

export async function GET() {
    try{
        await connectToDb();
        const data = await BannedIP.find({})
        return NextResponse.json({data})
    }catch(err){
        return NextResponse.json({message : err || "Somethign went wrong"}, {status : 500});
    }
}