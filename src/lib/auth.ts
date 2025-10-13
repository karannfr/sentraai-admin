import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import connectToDb from "./connectDB";
import Admin from "@/model/admin";
import { APIError } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db,
        {
            client
        }
    ),
    socialProviders: { 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    }, 
    databaseHooks: {
        user: {
        create: {
            before: async (user, ctx) => {
                await connectToDb();
                if(!user.email)
                    throw new APIError("BAD_REQUEST", { message: "Email not found in your Google account." });
                const email = await Admin.findOne({email : user.email})
                if(!email)
                    throw new APIError("FORBIDDEN", { message: "You are not authorized to access this app." });
            },
        },
        },
    },
    plugins: [nextCookies()]
});