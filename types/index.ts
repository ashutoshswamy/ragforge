export type GeminiModel = "gemini-2.5-flash" | "gemini-3-flash-preview";

export interface PipelineConfig {
  apiKey: string;
  model: GeminiModel;
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  systemPrompt: string;
}

export interface ParsedDoc {
  name: string;
  text: string;
}

export interface VectorChunk {
  text: string;
  embedding: number[];
  source: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}
