import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";

export default function TermsPage() {
  return (
    <div className="theme-shell min-h-screen text-[var(--text)] transition-colors duration-300">
      <LandingHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-28">
        <section className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">Terms of Service</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            These terms govern your use of AdPlatform. This is a placeholder page — replace with your legal terms before launch.
          </p>
        </section>

        <section className="theme-panel mb-8 rounded-3xl p-6 md:p-8">
          <h2 className="mb-2 text-xl font-semibold text-[var(--text)]">1. Acceptance</h2>
          <p className="text-[var(--muted)]">By using AdPlatform you agree to these terms.</p>
        </section>

        <section className="text-center">
          <a href="/signup" className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:brightness-110">Get Started</a>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
