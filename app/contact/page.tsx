import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";

export default function ContactPage() {
  return (
    <div className="theme-shell min-h-screen text-[var(--text)] transition-colors duration-300">
      <LandingHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-28">
        <section className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Have questions or need help? Reach our support team via email or use the in-app support after signing in.
          </p>
        </section>

        <section className="theme-panel mb-8 rounded-3xl p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Support</h3>
              <p className="text-sm text-[var(--muted)]">Email: <span className="font-medium text-[var(--text)]">support@adplatform.example</span></p>
              <p className="mt-2 text-sm text-[var(--muted)]">Response time: 1 business day</p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Sales</h3>
              <p className="text-sm text-[var(--muted)]">For partnerships and enterprise inquiries, email <span className="font-medium text-[var(--text)]">sales@adplatform.example</span></p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <a href="/signup" className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:brightness-110">Get Started</a>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
