import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import PdfParse from "pdf-parse";

export const POST = async (req, res) => {
    try {
        const formData = await req.formData();
        const file = formData.get('resume');
        const jd = formData.get('jobDescription');
        const relatedFields = formData.get('relatedFields'); // ['data science', 'data analyst', 'big data engineer']

        if (!file) {
            return NextResponse.json({ error: "Please upload a resume" }, { status: 400 })
        } else if (!jd) {
            return NextResponse.json({ error: "Please provide a job description" }, { status: 400 })
        }

        const buffer = await file.arrayBuffer();
        const data = await PdfParse(buffer);
        const textContent = data.text;
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);

        let prompt = `
        Hey, act like a highly skilled & very experienced ATS(Application Tracking System).
        Analyze the job description given below and extract the suitable roles and consider yourself having with a very deep understanding of these suitable roles.
        Your task is to evaluate the resume based on the given job description.
        You must consider that the job market is very competitive and you should provide best assistance for improving the resumes.
        Based on job description, assign a high accuracy percentage matching and the missing keywords with high accuracy and suggest what improvements can be made in the resume so that it can be shortlisted for the interview.
        Resume:{${textContent}}
        JobDescription:{${jd}}
        I want the response as a single string having the structure: {"JdMatch":"%", "MissingKeywords":[], "ProfileSummary":"", "Improvements":[]}
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const resultsObj = JSON.parse(text);

        return NextResponse.json({
            success: true,
            data: resultsObj,
            message: "Review generated successfully"
        }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Servers are busy. Please try again" }, { status: 500 })
    }
}