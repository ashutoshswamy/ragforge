import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

export const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ragforge.ashutoshswamy.in"),
  title: {
    default: "RAGForge | Build a RAG Pipeline & Chat With Your Documents",
    template: "%s | RAGForge",
  },
  description:
    "Build a RAG pipeline in minutes. Upload PDF, DOCX or TXT files, tune chunking and retrieval, and chat with cited answers streamed from Google Gemini.",
  keywords: [
    "RAG",
    "Retrieval-Augmented Generation",
    "Gemini",
    "AI Chatbot",
    "Vector Database",
    "Embeddings",
    "Document AI",
    "Chat with PDF",
    "Next.js"
  ],
  authors: [{ name: "Ashutosh Swamy", url: "https://ashutoshswamy.in" }],
  creator: "Ashutosh Swamy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ragforge.ashutoshswamy.in",
    siteName: "RAGForge",
    title: "RAGForge | Build Your RAG Pipeline",
    description:
      "Upload documents, configure your pipeline, and chat with your data using Gemini-powered RAG.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RAGForge | Build Your RAG Pipeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAGForge | Build Your RAG Pipeline",
    description:
      "Upload documents, configure your pipeline, and chat with your data using Gemini-powered RAG.",
    images: ["/og-image.jpg"],
    creator: "@ashutoshswamy",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const author = {
  "@type": "Person",
  name: "Ashutosh Swamy",
  url: "https://ashutoshswamy.in",
  sameAs: [
    "https://github.com/ashutoshswamy",
    "https://linkedin.com/in/ashutoshswamy",
    "https://twitter.com/ashutoshswamy_",
  ],
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ragforge.ashutoshswamy.in/#website",
      name: "RAGForge",
      url: "https://ragforge.ashutoshswamy.in",
      inLanguage: "en",
      publisher: author,
    },
    {
      "@type": "SoftwareApplication",
      name: "RAGForge",
      url: "https://ragforge.ashutoshswamy.in",
      image: "https://ragforge.ashutoshswamy.in/og-image.jpg",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description:
        "Build a RAG pipeline in minutes. Upload PDF, DOCX or TXT files, tune chunking and retrieval, and chat with cited answers streamed from Google Gemini.",
      featureList: [
        "Gemini embeddings",
        "Configurable chunking",
        "Streaming answers",
        "Source attribution",
        "PDF, DOCX and TXT parsing",
        "Custom system prompt",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author,
    },
  ],
};

