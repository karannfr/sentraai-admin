import { NextRequest, NextResponse } from "next/server";
import { IObsfucated } from "@/types/Obsfucated";
import Obsfucated from "@/model/Obsfucated";
import connectMongo from "@/lib/connectDB";

export async function GET() {
    try{
        await connectMongo();
        const data : IObsfucated[] = await Obsfucated.find({}).lean();
        return NextResponse.json(
            {data},
            {status : 200}
        )
    }catch(err){
        console.error(err);
        NextResponse.json(
            {message : "Internal Server Error"},
            {status : 500}
        )
    }
}