import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { weatherTool } from "@/lib/tools/weather";
import { analyzeTool } from "@/lib/tools/analyze";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are a helpful AI assistant with access to tools. You can:
1. Fetch weather forecasts for any location using the weather tool
2. Run Python code for data analysis using the analyze tool

When asked about weather, use the weather tool with the appropriate coordinates.
When asked to analyze data or do calculations, write Python code and use the analyze tool to execute it.

Always explain the results clearly to the user.`,
    messages,
    tools: {
      weather: weatherTool,
      analyze: analyzeTool,
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
