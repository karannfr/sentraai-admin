import connectToDb from "@/lib/connectDB";
import Obsfucated from "@/model/obsfucated";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDb();

  try {
    const data = await Obsfucated.find();

    const stats = {
      truncated_in: 0,
      removed_zero_width: 0,
      unicode_nfkc: 0,
      homoglyph_folds: 0,
      decoded: 0,
      clamped_runs: 0,
      truncated_out: 0,
    };

    data.forEach((d) => {
      if (d.sanitizationLog.truncated_in) stats.truncated_in++;
      stats.removed_zero_width += d.sanitizationLog.removed_zero_width;
      if (d.sanitizationLog.unicode_nfkc) stats.unicode_nfkc++;
      stats.homoglyph_folds += d.sanitizationLog.homoglyph_folds;
      if (d.sanitizationLog.decoded) stats.decoded++;
      if (d.sanitizationLog.clamped_runs) stats.clamped_runs++;
      if (d.sanitizationLog.truncated_out) stats.truncated_out++;
    });

    return NextResponse.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch sanitization stats" },
      { status: 500 }
    );
  }
}
