import mongoose, { Document, Model, Schema } from "mongoose";
import { IInjectedData } from "@/types/InjectedData";


export interface InjectedDataDocument extends IInjectedData, Document {}

const sanitizationLogSchema = new Schema({
  truncated_in: { type: Boolean, required: true },
  removed_zero_width: { type: Number, required: true },
  unicode_nfkc: { type: Boolean, required: true },
  homoglyph_folds: { type: Number, required: true },
  decoded: { type: String, required: false },
  clamped_runs: { type: Boolean, required: true },
  truncated_out: { type: Boolean, required: true },
  sanitizedAndDeobfuscated: { type: Boolean, required: true },
});

const injectedDataSchema = new Schema<InjectedDataDocument>(
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

const InjectedData: Model<InjectedDataDocument> =
  mongoose.models.InjectedData || mongoose.model<InjectedDataDocument>("InjectedData", injectedDataSchema);

export default InjectedData;
