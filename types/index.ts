export type GeminiModel = "gemini-2.5-flash" | "gemini-2.5-pro" | "gemini-3-flash-preview" | "gemini-3-pro-preview";

export interface Pipeline {
  id: string;
  user_id: string;
  name: string;
  config: PipelineConfig;
  chunk_count: number;
  created_at: string;
  updated_at: string;
}

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
