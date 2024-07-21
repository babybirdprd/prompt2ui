import { systemPrompt } from "@/app/api/chat/prompt";
import { CoreMessage, streamText } from "ai";
import { Configuration, OpenAIApi } from "@openrouter/ai";

const config = new Configuration({
  basePath: process.env.OPENROUTER_BASE_URL + "/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  baseOptions: {
    headers: {
      "HTTP-Referer": "https://yourapp.com/", // Optional, for including your app on openrouter.ai rankings.
      "X-Title": "Vercel Testing", // Optional. Shows in rankings on openrouter.ai.
    },
  },
});

const openrouter = new OpenAIApi(config);

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await openrouter.createCompletion({
    model: "gpt-4-2023-06-01",
    prompt: systemPrompt + "\n" + messages.map(m => m.content).join("\n"),
    stream: true,
  });

  return result.toAIStreamResponse();
}
