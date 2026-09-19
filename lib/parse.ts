import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

// Client sends .txt as plain text and .pdf/.docx as base64 (see Step1Upload.tsx) — extract real text here.
export async function extractText(fileName: string, raw: string): Promise<string> {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) {
    const parser = new PDFParse({ data: new Uint8Array(Buffer.from(raw, "base64")) });
    try {
      const { text } = await parser.getText();
      return text;
    } finally {
      await parser.destroy();
    }
  }

  if (lower.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer: Buffer.from(raw, "base64") });
    return value;
  }

  return raw;
}
