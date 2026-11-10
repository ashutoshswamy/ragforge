import type { Metadata } from "next";
import UseCase from "@/components/landing/UseCase";

export const metadata: Metadata = {
  title: "Chat With Your PDF Using Gemini",
  description: "Upload a PDF, DOCX or TXT file and ask questions in plain English. RAGForge answers with Gemini and cites the exact documents it used.",
  alternates: { canonical: "/chat-with-pdf" },
};

export default function Page() {
  return (
    <UseCase
      h1="Chat with your PDF using Gemini"
      intro="Stop searching long documents by hand. Upload a PDF, Word file or text file, ask a question, and get an answer grounded in your own content, with the source document listed."
      steps={[
        "Upload your PDF, DOCX or TXT files.",
        "Add your Gemini API key and pick a model.",
        "RAGForge splits the text into chunks and embeds them with Gemini embeddings.",
        "Ask questions. The best-matching chunks are retrieved and Gemini streams a cited answer.",
      ]}
      why="Answers come only from your files, so they stay on topic. You control chunk size, overlap, top-K and the system prompt. Your API key is used per request and never stored."
    />
  );
}
