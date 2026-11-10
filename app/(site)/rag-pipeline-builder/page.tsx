import type { Metadata } from "next";
import UseCase from "@/components/landing/UseCase";

export const metadata: Metadata = {
  title: "RAG Pipeline Builder, No Code Needed",
  description: "Build and test a retrieval-augmented generation pipeline without writing code. Configure chunking, retrieval and prompts, then chat with your data.",
  alternates: { canonical: "/rag-pipeline-builder" },
};

export default function Page() {
  return (
    <UseCase
      h1="Build a RAG pipeline without the boilerplate"
      intro="Prototype a retrieval-augmented generation pipeline in minutes. RAGForge handles parsing, chunking, embeddings, vector search and streaming generation, so you can focus on tuning results."
      steps={[
        "Upload documents (PDF, DOCX, TXT).",
        "Tune chunk size (256-2048), overlap, top-K and the system prompt.",
        "Build the pipeline: chunks are embedded and indexed.",
        "Chat, inspect which sources were retrieved, and iterate on settings.",
      ]}
      why="Use it to find sensible RAG settings for your content before writing production code. No vector database setup, no parser code, no chat UI to build."
    />
  );
}
