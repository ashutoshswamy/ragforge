import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Pipelines",
  description: "Manage your custom RAG pipelines.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PipelinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
