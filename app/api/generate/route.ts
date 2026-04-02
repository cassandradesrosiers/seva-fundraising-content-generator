import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, maxTokens = 3500 } = await req.json();
    if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const clean = raw.replace(/^```json\s*/m, "").replace(/```\s*$/m, "").trim();

    return NextResponse.json(JSON.parse(clean));
  } catch (err) {
    console.error("/api/generate error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
