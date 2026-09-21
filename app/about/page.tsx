import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";

export default function AboutPage() {
  return (
    <div className="theme-shell min-h-screen text-[var(--text)] transition-colors duration-300">
      <LandingHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-28">
        <section className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">About AdPlatform</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            AdPlatform helps African businesses launch and manage social media advertising campaigns using local payment methods and AI-powered targeting.
          </p>
        </section>

        <section className="theme-panel mb-8 rounded-3xl p-6 md:p-8">
          <h2 className="mb-2 text-xl font-semibold text-[var(--text)]">Our Mission</h2>
          <p className="text-[var(--muted)]">To empower creators and businesses across Africa to reach and engage their audiences through effective, accessible advertising tools.</p>
        </section>

        <section className="text-center">
          <a href="/signup" className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:brightness-110">Get Started</a>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
