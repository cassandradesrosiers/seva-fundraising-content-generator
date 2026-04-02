import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET() {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      tools: [{ type: "web_search_20250305" as const, name: "web_search" }],
      messages: [{ role: "user", content: `Fetch southendvillageacademy.org and find the current dollar amount raised on the donation counter. Return ONLY this JSON: {"raised": "$XXX,XXX"}` }],
    });
    const text = message.content.filter(b => b.type === "text").map(b => b.type === "text" ? b.text : "").join("");
    const jsonMatch = text.match(/\{\s*"raised"\s*:\s*"(\$[\d,]+)"\s*\}/);
    const amount = jsonMatch?.[1] ?? text.match(/\$\d[\d,]+/)?.[0] ?? null;
    if (!amount) return NextResponse.json({ error: "Could not parse amount" }, { status: 422 });
    return NextResponse.json({ raised: amount, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("/api/sync error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
