import FaqList from "./FaqList";

export const FAQS = [
  { q: "What is RAGForge?", a: "RAGForge is a free web app that builds a retrieval-augmented generation (RAG) pipeline for you. Upload PDF, DOCX or TXT files, tune chunking and retrieval, then chat with cited answers streamed from Google Gemini." },
  { q: "Do I need my own Gemini API key?", a: "Yes. You bring a Google Gemini API key. It is sent with each request and used immediately; RAGForge does not store it." },
  { q: "Which file types are supported?", a: "PDF, DOCX and plain text (TXT). Files are parsed, split into chunks with your chosen size and overlap, and embedded with Gemini embeddings." },
  { q: "Does RAGForge cite its sources?", a: "Yes. Every answer lists the documents the retrieved chunks came from, so you can check where a claim originated." },
  { q: "Can I change how the assistant answers?", a: "Yes. You can set the system prompt, the Gemini model, chunk size, chunk overlap and how many chunks (top-K) are retrieved per question." },
  { q: "Is RAGForge free?", a: "Yes, RAGForge is free to use. You only pay Google for your own Gemini API usage." },
];

export default function FAQ() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section id="faq" className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
        <div className="lg:sticky lg:top-28 self-start">
          <h2 className="text-4xl sm:text-5xl">Frequently asked questions</h2>
          <p className="mt-5 text-lg max-w-sm" style={{ color: "var(--text-muted)" }}>
            Keys, files, sources and cost, answered in a line or two.
          </p>
        </div>
        <FaqList items={FAQS} />
      </div>
    </section>
  );
}
