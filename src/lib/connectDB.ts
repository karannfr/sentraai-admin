// utils/connectToDb.ts
import mongoose, { Connection } from "mongoose";
import { Db, GridFSBucket } from "mongodb";

let client: Connection | null = null;
let bucket: GridFSBucket | null = null;

const MONGODB_URI = process.env.MONGO_URI as string;

interface DbConnection {
    client: Connection;
    bucket: GridFSBucket;
}

async function connectToDb(): Promise<DbConnection> {
    if (client) {
        return { client, bucket: bucket as GridFSBucket };
    }

    await mongoose.connect(MONGODB_URI);

    client = mongoose.connection;
    bucket = new mongoose.mongo.GridFSBucket(client.db as Db, {
        bucketName: "images",
    });

    console.log("Connected to the Database");
    return { client, bucket };
}

export default connectToDb;