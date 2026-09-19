import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ragforge.ashutoshswamy.in"),
  title: {
    default: "RAGForge — Build Your RAG Pipeline",
    template: "%s | RAGForge",
  },
  description:
    "Upload documents, configure your pipeline, and chat with your data using Gemini-powered RAG.",
  keywords: [
    "RAG",
    "Retrieval-Augmented Generation",
    "Gemini",
    "AI Chatbot",
    "Vector Database",
    "Embeddings",
    "Document AI",
    "Neon",
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
    title: "RAGForge — Build Your RAG Pipeline",
    description:
      "Upload documents, configure your pipeline, and chat with your data using Gemini-powered RAG.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RAGForge — Build Your RAG Pipeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAGForge — Build Your RAG Pipeline",
    description:
      "Upload documents, configure your pipeline, and chat with your data using Gemini-powered RAG.",
    images: ["/og-image.png"],
    creator: "@ashutoshswamy",
  },
  icons: {
    icon: [
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RAGForge",
  url: "https://ragforge.ashutoshswamy.in",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Upload documents, configure your pipeline, and chat with your data using Gemini-powered RAG.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Ashutosh Swamy", url: "https://ashutoshswamy.in" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <AuthProvider>
      <html lang="en" className={dmSans.variable}>
        <body className="min-h-screen flex flex-col noise-bg">
          <script
            type="application/ld+json"
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
