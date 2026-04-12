import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiModel } from "@/types";

export async function embedText(
  apiKey: string,
  text: string
): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-2-preview" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateAnswer(
  apiKey: string,
  model: GeminiModel,
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const genModel = genAI.getGenerativeModel({ model });
  const result = await genModel.generateContentStream(prompt);

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
