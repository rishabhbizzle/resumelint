import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const POST = async (request, { params }) => {
    try {
        console.log(request)
        // const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        // const model = genAI.getGenerativeModel('gemini-pro')
        return NextResponse.json({
            success: true,
            message: "Server is working"
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}