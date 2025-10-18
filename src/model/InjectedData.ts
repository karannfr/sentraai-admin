import mongoose, { Schema, models } from "mongoose";

const injectedDataSchema = new Schema(
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
  { timestamps: true }
);

// Prevent model overwrite issues during hot reload
const InjectedData =
  models.InjectedData || mongoose.model("InjectedData", injectedDataSchema);

export default InjectedData;
