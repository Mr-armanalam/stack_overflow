/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatAIGeneratedText } from "@/lib/utils";

export const POST = async (request: Request) => {
  const { question } = await request.json();

  try {
    const apikey: any = process.env.NEXT_PUBLIC_GENERATIVE_AI_API_KEY;
    console.log(apikey);

    // const response = await fetch("https://api.llama.com/v1/endpoint", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.LLAMA_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'Llama3.2-90B-Vision',
    //     // messages: [{ role: 'system', content: customPrompt}],
    //     messages: [
    //       {
    //         role: "system",
    //         content:
    //           "You are a knowlegeable assistant that provides quality information. Your goal is to provide accurate, thorough, and engaging answer",
    //       },
    //       {
    //         role: "user",
    //         content: `Tell me ${question}`,
    //       },
    //     ],
    //   }),
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const responseData = await response.json();

    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = question;
    const result = await model.generateContent(prompt);

    const responseData = result.response.text();
    const reply = await formatAIGeneratedText(responseData)

    return NextResponse.json({reply});
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
