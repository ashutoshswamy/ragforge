import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "RAGForge terms of service. Understand the rules governing use of our platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfService() {
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
          Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using RAGForge, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the service.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              2. Description of Service
            </h2>
            <p>
              RAGForge is a web application that enables users to build Retrieval-Augmented Generation (RAG) pipelines. Users upload documents, configure pipeline settings, and chat with their data using Google Gemini models. The service requires users to provide their own Gemini API key.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              3. User Accounts
            </h2>
            <ul className="list-disc list-inside flex flex-col gap-1.5">
              <li>You must create an account to use RAGForge</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for all activity that occurs under your account</li>
            </ul>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 mt-2">
              <li>Upload content that violates any law or infringes on intellectual property rights</li>
              <li>Use the service to process sensitive personal data (e.g., medical records, financial data) without appropriate safeguards</li>
              <li>Attempt to reverse-engineer, decompile, or exploit the service</li>
              <li>Use the service to develop competing products</li>
              <li>Share your account credentials with others</li>
              <li>Abuse the service in a way that degrades performance for other users</li>
            </ul>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              5. Your Content
            </h2>
            <p>
              You retain ownership of all documents and data you upload to RAGForge. By uploading content, you grant us a limited license to process, store, and embed your documents solely for the purpose of providing the RAG pipeline service to you.
            </p>
            <p className="mt-2">
              You are solely responsible for ensuring you have the right to upload and process any documents you provide.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              6. API Keys
            </h2>
            <p>
              RAGForge requires a Google Gemini API key provided by you. You are responsible for any charges incurred through the Gemini API. RAGForge does not store your API key beyond the lifetime of a single request. We are not responsible for any costs or issues arising from your use of the Gemini API.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              7. Disclaimer of Warranties
            </h2>
            <p>
              RAGForge is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. We do not guarantee the accuracy, completeness, or reliability of any responses generated through the RAG pipeline.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, RAGForge and its creator shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to loss of data, revenue, or profits.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              9. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access to RAGForge at any time, with or without cause. Upon termination, your right to use the service ceases immediately. You may delete your account and data at any time.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              10. Changes to Terms
            </h2>
            <p>
              We may modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of RAGForge after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <div className="h-px" style={{ background: "var(--border)" }} />

          <section>
            <h2
              className="text-base font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            >
              11. Contact
            </h2>
            <p>
              Questions about these terms? Reach out at{" "}
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
