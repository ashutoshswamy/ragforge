import Link from "next/link";
import SiteHeader from "@/components/ui/SiteHeader";
import SiteFooter from "@/components/ui/SiteFooter";

export default function UseCase({ h1, intro, steps, why }: { h1: string; intro: string; steps: string[]; why: string }) {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl">{h1}</h1>
        <p className="mt-6 text-lg" style={{ color: "var(--text-muted)" }}>{intro}</p>
        <h2 className="text-2xl mt-12">How it works</h2>
        <ol className="mt-4 list-decimal pl-6 flex flex-col gap-2">
          {steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
        <h2 className="text-2xl mt-12">Why RAGForge</h2>
        <p className="mt-4" style={{ color: "var(--text-muted)" }}>{why}</p>
        <Link href="/sign-up" className="btn mt-10 inline-flex">Start building — free</Link>
        <p className="mt-8 text-sm"><Link href="/" className="navlink">Back to RAGForge</Link></p>
      </main>
      <SiteFooter />
    </div>
  );
}
