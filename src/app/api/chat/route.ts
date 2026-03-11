// src/app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-2.5-flash'), // Using the active 2026 model
      messages,
      system: "You are the Sudarshan AI. Handle theft checks by promising a response within 3-12 hours.",
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI ROUTE ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}