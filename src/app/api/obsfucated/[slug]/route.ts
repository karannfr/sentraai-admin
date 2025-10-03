import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connectDB";
import { IObsfucated } from "@/types/Obsfucated";
import Obsfucated from "@/model/Obsfucated";

const allowedParams = [
  "truncated_in",
  "removed_zero_width",
  "unicode_nfkc",
  "homoglyph_folds",
  "decoded",
  "clamped_runs",
  "truncated_out",
];
export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
    ) {
    const slug = await params.slug;
    if(!allowedParams.includes(slug))
        return NextResponse.json({message : "Not Found"}, {status : 404})
    try{
        await connectMongo();
        let data : IObsfucated[] = [];
        switch(slug){
            case "truncated_in" :
                data = await Obsfucated.find({ "sanitizationLog.truncated_in": true });
                break;
            case "removed_zero_width":
                data = await Obsfucated.find({ "sanitizationLog.removed_zero_width": {$gt : 0} });
                break;
            case "unicode_nfkc":
                data = await Obsfucated.find({ "sanitizationLog.unicode_nfkc": true});
                break;
            case "homoglyph_folds":
                data = await Obsfucated.find({ "sanitizationLog.homoglyph_folds": {$gt : 0} });
                break;
            case "decoded":
                data = await Obsfucated.find({ "sanitizationLog.decoded": { $ne: null } });
                break;
            case "clamped_runs":
                data = await Obsfucated.find({ "sanitizationLog.clamped_runs": true });
                break;
            case "truncated_out":
                data = await Obsfucated.find({ "sanitizationLog.truncated_out": true });
                break;
        }
        if (data && data.length > 0)
            return NextResponse.json({ data, count: data.length }, { status: 200 });
        else
            return NextResponse.json({ message: "No data found", data: [], count: 0 }, { status: 200 });
    }catch(err){
        console.error(err);
        return NextResponse.json({message : "Internal Server Error"}, {status : 500} )
    }
}
