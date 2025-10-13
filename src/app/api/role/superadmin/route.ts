import { NextRequest, NextResponse } from "next/server";
import Admin from "@/model/admin";
import connectToDb from "@/lib/connectDB";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"

export async function POST(req : NextRequest) {
    const session = await auth.api.getSession({
        headers : await headers()
    })
    if(!session)
        return NextResponse.json({message : "Unautorized"}, {status: 401})
    await connectToDb();
    const userEmail = session.user.email;
    const user = await Admin.findOne({email : userEmail});
    if(!user || user.role == "admin")
        return NextResponse.json({message : "Unautorized"}, {status: 401})
    const {email} = await req.json();
    if(!email)
        return NextResponse.json({message : "Bad Request"}, {status : 400});
    const admin = await Admin.findOne({email : email});
    if(!admin){
        await Admin.create({
            email : email,
            role : "superadmin"
        })
    }
    else{
        admin.role = "superadmin";
        await admin.save();
    }
    return NextResponse.json({message : `${email} hass been given superadmin access`})
}