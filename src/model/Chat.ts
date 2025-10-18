import mongoose, { Schema, Document, Model } from "mongoose";

interface SanitizationLog {
  truncated_in: boolean;
  removed_zero_width: number;
  unicode_nfkc: boolean;
  homoglyph_folds: number;
  decoded?: string;
  clamped_runs: boolean;
  truncated_out: boolean;
  sanitizedAndDeobfuscated: boolean;
}

interface Classification {
  label: string;
  category?: string | null;
  confidence: number;
  reason: string;
  excerpt?: string;
}

interface ChatHistoryItem {
  role: string;
  content: string;
}

export interface IChat extends Document {
  ipAddress: string;
  rawMessage: string;
  cleanedMessage: string;
  sanitizationLog: SanitizationLog;
  generatedResponse: string;
  classification: Classification;
  chatHistory: ChatHistoryItem[];
  thread_id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const ChatSchema: Schema<IChat> = new Schema(
  {
    ipAddress: { type: String, required: true },
    rawMessage: { type: String, required: true },
    cleanedMessage: { type: String, required: true },
    sanitizationLog: {
      truncated_in: { type: Boolean, required: true },
      removed_zero_width: { type: Number, required: true },
      unicode_nfkc: { type: Boolean, required: true },
      homoglyph_folds: { type: Number, required: true },
      decoded: { type: String, required: false },
      clamped_runs: { type: Boolean, required: true },
      truncated_out: { type: Boolean, required: true },
      sanitizedAndDeobfuscated: { type: Boolean, required: true },
    },
    generatedResponse: { type: String, required: true },
    classification: {
      label: { type: String, required: true },
      category: { type: String, default: null },
      confidence: { type: Number, required: true },
      reason: { type: String, required: true },
      excerpt: { type: String, default: "" },
    },
    chatHistory: {
      type: [
        {
          role: { type: String, required: true },
          content: { type: String, required: true },
        },
      ],
      default: [],
    },
    thread_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
