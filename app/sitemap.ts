import type { MetadataRoute } from "next";

const baseUrl = "https://ragforge.ashutoshswamy.in";
// Bump when page content actually changes (a per-request date makes Google ignore lastmod).
const LAST_MODIFIED = new Date("2026-11-10");

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/chat-with-pdf", "/rag-pipeline-builder", "/privacy", "/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: LAST_MODIFIED,
  }));
}
