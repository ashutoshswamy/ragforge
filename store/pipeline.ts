import { create } from "zustand";
import type { PipelineConfig, ParsedDoc, VectorChunk, ChatMessage } from "@/types";

const DEFAULT_CONFIG: PipelineConfig = {
  apiKey: "",
  model: "gemini-2.5-flash",
  chunkSize: 512,
  chunkOverlap: 64,
  topK: 4,
  systemPrompt:
    "You are a helpful assistant. Answer questions based only on the provided context. If the answer is not in the context, say so clearly.",
};

interface PipelineStore {
  currentStep: 1 | 2 | 3;
  files: File[];
  parsedDocs: ParsedDoc[];
  config: PipelineConfig;
  vectorStore: VectorChunk[];
  messages: ChatMessage[];
  isIngesting: boolean;
  pipelineId: string;
  pipelineName: string;

  setStep: (step: 1 | 2 | 3) => void;
  setFiles: (files: File[]) => void;
  setParsedDocs: (docs: ParsedDoc[]) => void;
  setConfig: (config: Partial<PipelineConfig>) => void;
  setVectorStore: (chunks: VectorChunk[]) => void;
  addMessage: (msg: ChatMessage) => void;
  setIsIngesting: (val: boolean) => void;
  setPipelineId: (id: string) => void;
  setPipelineName: (name: string) => void;
  reset: () => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  currentStep: 1,
  files: [],
  parsedDocs: [],
  config: { ...DEFAULT_CONFIG },
  vectorStore: [],
  messages: [],
  isIngesting: false,
  pipelineId: "",
  pipelineName: "Untitled Pipeline",

  setStep: (step) => set({ currentStep: step }),
  setFiles: (files) => set({ files }),
  setParsedDocs: (docs) => set({ parsedDocs: docs }),
  setConfig: (config) =>
    set((state) => ({ config: { ...state.config, ...config } })),
  setVectorStore: (chunks) => set({ vectorStore: chunks }),
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setIsIngesting: (val) => set({ isIngesting: val }),
  setPipelineId: (id) => set({ pipelineId: id }),
  setPipelineName: (name) => set({ pipelineName: name }),
  reset: () =>
    set({
      currentStep: 1,
      files: [],
      parsedDocs: [],
      config: { ...DEFAULT_CONFIG },
      vectorStore: [],
      messages: [],
      isIngesting: false,
      pipelineId: "",
      pipelineName: "Untitled Pipeline",
    }),
}));
