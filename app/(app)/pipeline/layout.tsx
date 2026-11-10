import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configure Pipeline",
  description: "Configure and test your RAG pipeline.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
