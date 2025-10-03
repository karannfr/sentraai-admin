import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connectDB";
import Obsfucated from "@/model/Obsfucated";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const counts = await Promise.all([
      Obsfucated.countDocuments({ "sanitizationLog.truncated_in": true }),
      Obsfucated.countDocuments({ "sanitizationLog.removed_zero_width": { $gt: 0 } }),
      Obsfucated.countDocuments({ "sanitizationLog.unicode_nfkc": true }),
      Obsfucated.countDocuments({ "sanitizationLog.homoglyph_folds": { $gt: 0 } }),
      Obsfucated.countDocuments({ "sanitizationLog.decoded": { $ne: null } }),
      Obsfucated.countDocuments({ "sanitizationLog.clamped_runs": true }),
      Obsfucated.countDocuments({ "sanitizationLog.truncated_out": true }),
    ]);

    const result = {
      truncated_in: counts[0],
      removed_zero_width: counts[1],
      unicode_nfkc: counts[2],
      homoglyph_folds: counts[3],
      decoded: counts[4],
      clamped_runs: counts[5],
      truncated_out: counts[6],
    };

    return NextResponse.json({ countSummary: result }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
