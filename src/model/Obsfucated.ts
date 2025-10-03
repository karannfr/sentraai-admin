// models/Obsfucated.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import { IObsfucated } from "@/types/Obsfucated";

export interface ObsfucatedDocument extends IObsfucated, Document {}

const sanitizationLogSchema = new Schema(
  {
    truncated_in: { type: Boolean, required: true },
    removed_zero_width: { type: Number, required: true },
    unicode_nfkc: { type: Boolean, required: true },
    homoglyph_folds: { type: Number, required: true },
    decoded: { type: String, required: false },
    clamped_runs: { type: Boolean, required: true },
    truncated_out: { type: Boolean, required: true },
    sanitizedAndDeobfuscated: { type: Boolean, required: true },
  },
  { _id: false }
);

const obsfucatedSchema = new Schema<ObsfucatedDocument>(
  {
    rawMessage: { type: String, required: true },
    cleanedMessage: { type: String, required: true },
    sanitizationLog: { type: sanitizationLogSchema, required: true },
    thread_id: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Obsfucated: Model<ObsfucatedDocument> =
  mongoose.models.Obsfucated || mongoose.model<ObsfucatedDocument>("Obsfucated", obsfucatedSchema);

export default Obsfucated;
