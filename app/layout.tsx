import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAGForge — Build Your RAG Pipeline",
  description:
    "Upload documents, configure your pipeline, and chat with your data using Gemini-powered RAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/" signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/pipelines" signUpFallbackRedirectUrl="/pipelines">
      <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
        <body className="min-h-screen flex flex-col noise-bg">{children}</body>
      </html>
    </ClerkProvider>
  );
}
