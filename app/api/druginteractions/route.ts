import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    if (!body || typeof body !== 'object') {
      throw new Error("Invalid request body");
    }

    let { section, patientData } = body;
    let prompt = `Provide suggestions for the ${section} section based on the following patient data: ${JSON.stringify(patientData)}`;

    console.log("Extracted prompt:", prompt);

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error("Prompt is empty or not a valid string");
    }

    prompt = prompt.trim();

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID;

    if (!endpoint || !apiKey || !deploymentId) {
      throw new Error("Missing required environment variables");
    }

    const client = new AzureOpenAI({
      apiKey,
      endpoint,
      deployment: deploymentId,
      apiVersion: "2023-03-15-preview",
    });

    const messages = [
      { role: "system", content: "You are a helpful medical assistant." },
      { role: "user", content: prompt },
    ];

    console.log("Messages to be sent:", messages);

    const response = await client.chat.completions.create({
      model: deploymentId,
      messages: messages.map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      })),
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const suggestions = response.choices[0].message.content;

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while processing your request.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
