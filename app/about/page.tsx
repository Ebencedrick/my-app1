import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 text-white">
      <LandingHeader />
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-20 pt-28">
        <section className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">About AdPlatform</h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">AdPlatform helps African businesses launch and manage social media advertising campaigns using local payment methods and AI-powered targeting.</p>
        </section>

        <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900/50 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Our Mission</h2>
          <p className="text-slate-300">To empower creators and businesses across Africa to reach and engage their audiences through effective, accessible advertising tools.</p>
        </section>

        <section className="text-center">
          <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg shadow-pink-500/25 hover:from-pink-400 hover:to-orange-400 transition-all">Get Started</a>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
