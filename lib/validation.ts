import { z } from "zod";

export const IngestRequestSchema = z.object({
  pipelineId: z.string().uuid(),
  apiKey: z.string().min(1),
  docs: z
    .array(
      z.object({
        name: z.string().min(1).max(256),
        text: z.string().min(1).max(2000000),
      })
    )
    .min(1)
    .max(10),
  config: z.object({
    chunkSize: z.number().int().min(256).max(2048),
    chunkOverlap: z.number().int().min(0).max(256),
  }),
});

export const QueryRequestSchema = z.object({
  pipelineId: z.string().uuid(),
  apiKey: z.string().min(1),
  question: z.string().min(1).max(5000),
  config: z.object({
    model: z.enum(["gemini-2.5-flash", "gemini-3-flash-preview"]),
    topK: z.number().int().min(1).max(10),
    systemPrompt: z.string().max(2000),
  }),
});

export const CreatePipelineSchema = z.object({
  name: z.string().min(1).max(128).default("Untitled Pipeline"),
  config: z.object({
    apiKey: z.string().min(1),
    model: z.enum(["gemini-2.5-flash", "gemini-3-flash-preview"]),
    chunkSize: z.number().int().min(256).max(2048),
    chunkOverlap: z.number().int().min(0).max(256),
    topK: z.number().int().min(1).max(10),
    systemPrompt: z.string().max(2000),
  }),
});

export type IngestRequest = z.infer<typeof IngestRequestSchema>;
export type QueryRequest = z.infer<typeof QueryRequestSchema>;
export type CreatePipelineRequest = z.infer<typeof CreatePipelineSchema>;
