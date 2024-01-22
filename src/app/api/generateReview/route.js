import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import PdfParse from "pdf-parse";
import OpenAI from 'openai';

export const POST = async (req, res) => {
    try {
        const formData = await req.formData();
        const file = formData.get('resume');
        const jd = formData.get('jobDescription');
        const model = formData.get('model') || 'gemini-pro';

        if (!file) {
            return NextResponse.json({ error: "Please upload a resume" }, { status: 400 })
        } else if (!jd) {
            return NextResponse.json({ error: "Please provide a job description" }, { status: 400 })
        }

        const buffer = await file.arrayBuffer();
        const data = await PdfParse(buffer);
        const textContent = data.text;

        console.log("Resume Text: ", textContent);
        let resultsObj = {};
        if (model === 'gemini-pro') {
            console.log("Using Gemini Pro");
            let prompt = `
        Hey, act like a highly skilled & very experienced ATS(Application Tracking System).
        Analyze the job description given below and extract the suitable roles and consider yourself having with a very deep understanding of these suitable roles.
        Your task is to evaluate the resume based on the given job description.
        You must consider that the job market is very competitive and you should provide best assistance for improving the resumes.
        Based on job description and considering the resume provided, assign a high accuracy percentage matching and the missing keywords with high accuracy and suggest what improvements can be made in the resume so that it can be shortlisted for the interview.
        Resume:{${textContent}}
        JobDescription:{${jd}}
        I want the response as a single string having the structure: {"JdMatch":"%", "MissingKeywords":[], "ProfileSummary":"", "Improvements":[]}
        `;
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const modelDetails = genAI.getGenerativeModel({ model: 'gemini-pro' })
            const result = await modelDetails.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            resultsObj = JSON.parse(text);
        } else {
            console.log("Using GPT-3");
            const openai = new OpenAI({
                apiKey: process.env.GPT_API_KEY
            });
            let prompt = `
            Resume:"${textContent}"
            Job Description:"${jd}"
            I want the response as a single string having the structure: {"JdMatch":"%", "MissingKeywords":[], "ProfileSummary":"", "Improvements":[]} where "JdMatch" should be a percentage value, "MissingKeywords" should be a list of keywords, "ProfileSummary" should be a string and "Improvements" should be a list of strings. Everthing here should be from your percepective`;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a highly skilled & very experienced ATS (Application Tracking System) which companies use for filtering out candidates who apply for jobs. You have a deep knowledge of most of the popular job roles in the market. Evaluate the resume based on the given job description. You must consider that the job market is very competitive and you should provide best assistance for improving the resumes. Based on job description and considering the resume provided, Your task step by step is: Step-1: Assign a very high accuracy percentage matching of resume and job description. Step-2: Extract the missing keywords from resume based on job description. Step-3: Suggest improvements that can be made in the resume so that it can be shortlisted for that particular job." }],
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo-1106",
            });
            resultsObj = JSON.parse(completion?.choices[0]?.message?.content);
        }
        return NextResponse.json({
            success: true,
            data: resultsObj,
            message: "Review generated successfully"
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Servers are busy. Please select different reviewer and try again", message: error }, { status: 500 })
    }
}