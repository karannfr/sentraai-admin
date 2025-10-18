import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBannedIP extends Document{
    ipAddress: string
}

const BannedIPSchema: Schema<IBannedIP> = new Schema({
        ipAddress : {type : String, required : true}
    },
    {
        timestamps: true,
    }
)

const BannedIP: Model<IBannedIP> = mongoose.models.BannedIP || mongoose.model<IBannedIP>("BannedIP", BannedIPSchema);

export default BannedIP;