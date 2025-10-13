import mongoose, { Schema, Document, model, models } from "mongoose";

export interface AdminDocument extends Document {
  email: string;
  role: "superadmin" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = models.Admin || model<AdminDocument>("Admin", AdminSchema);
export default Admin;
