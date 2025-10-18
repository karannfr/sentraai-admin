import mongoose, { Schema, models, Model, Document } from "mongoose";

export interface ISanitizationLog {
  truncated_in: boolean;
  removed_zero_width: number;
  unicode_nfkc: boolean;
  homoglyph_folds: number;
  decoded?: string;
  clamped_runs: boolean;
  truncated_out: boolean;
  sanitizedAndDeobfuscated: boolean;
}

export interface IObsfucated extends Document {
  ipAddress: string;
  rawMessage: string;
  cleanedMessage: string;
  sanitizationLog: ISanitizationLog;
  thread_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ObsfucatedSchema: Schema<IObsfucated> = new Schema(
  {
    ipAddress: { type: String, required: true },
    rawMessage: { type: String, required: true },
    cleanedMessage: { type: String, required: true },
    sanitizationLog: {
      truncated_in: { type: Boolean, required: true },
      removed_zero_width: { type: Number, required: true },
      unicode_nfkc: { type: Boolean, required: true },
      homoglyph_folds: { type: Number, required: true },
      decoded: { type: String },
      clamped_runs: { type: Boolean, required: true },
      truncated_out: { type: Boolean, required: true },
      sanitizedAndDeobfuscated: { type: Boolean, required: true },
    },
    thread_id: { type: String },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite issues during hot reload
const Obsfucated: Model<IObsfucated> =
  models.Obsfucated || mongoose.model("Obsfucated", ObsfucatedSchema);

export default Obsfucated;
