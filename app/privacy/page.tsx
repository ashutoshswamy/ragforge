import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "RAGForge privacy policy. Learn how we handle your data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="fixed inset-0 grid-pattern opacity-[0.04] pointer-events-none z-0" />

      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-3"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(14, 14, 14, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            RAG<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </Link>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-5 sm:px-8 py-16 sm:py-24">
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Privacy Policy
        </h1>
        <p
          className="text-xs uppercase tracking-widest mb-12"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
        >
          Last updated: April 16, 2026
        </p>

        <div
          className="flex flex-col gap-8 text-sm leading-relaxed"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              1. Information We Collect
            </h2>
            <p>
              <strong style={{ color: "var(--text)" }}>Account Data:</strong> When you sign up via Clerk, we receive your name, email address, and profile picture. We do not store passwords — authentication is handled entirely by Clerk.
            </p>
            <p className="mt-2">
              <strong style={{ color: "var(--text)" }}>Documents:</strong> Files you upload (PDF, TXT, DOCX) are processed to extract text, which is then chunked and embedded. Document content is stored in our database to power your RAG pipelines.
            </p>
            <p className="mt-2">
              <strong style={{ color: "var(--text)" }}>API Keys:</strong> Your Gemini API key is used per-request to generate embeddings and responses. It is never stored on our servers beyond the lifetime of a single request.
            </p>
            <p className="mt-2">
              <strong style={{ color: "var(--text)" }}>Usage Data:</strong> We collect basic usage analytics such as pipeline creation counts and chat interactions to improve the service.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li>To provide and maintain RAGForge services</li>
              <li>To process your documents and power RAG pipelines</li>
              <li>To authenticate your identity and protect your account</li>
              <li>To improve and optimize the platform</li>
              <li>To communicate important service updates</li>
            </ul>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              3. Data Storage & Security
            </h2>
            <p>
              Pipeline data and embeddings are stored in Supabase with row-level security scoped to your user account. All data is transmitted over HTTPS. We do not sell, rent, or share your personal data or document content with third parties.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              4. Third-Party Services
            </h2>
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li><strong style={{ color: "var(--text)" }}>Clerk</strong> — authentication and user management</li>
              <li><strong style={{ color: "var(--text)" }}>Google Gemini API</strong> — embeddings and text generation (using your API key)</li>
              <li><strong style={{ color: "var(--text)" }}>Supabase</strong> — database and vector storage</li>
            </ul>
            <p className="mt-2">
              Each third-party service has its own privacy policy governing their handling of data.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              5. Data Deletion
            </h2>
            <p>
              You can delete individual pipelines and their associated data at any time from your dashboard. To delete your entire account and all associated data, contact us at{" "}
              <a href="mailto:ashutoshswamy397@gmail.com" style={{ color: "var(--accent)" }}>
                ashutoshswamy397@gmail.com
              </a>.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              6. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of RAGForge after changes constitutes acceptance.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              7. Contact
            </h2>
            <p>
              Questions about this policy? Reach out at{" "}
              <a href="mailto:ashutoshswamy397@gmail.com" style={{ color: "var(--accent)" }}>
                ashutoshswamy397@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="flex items-center justify-center px-5 sm:px-8 py-5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-body)" }}
        >
          &copy; {new Date().getFullYear()} RAGForge
        </span>
      </footer>
    </div>
  );
}
