"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[rgba(15,23,42,0.18)] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-10 w-36">
                <Image
                  src="/adflux-logo-transparent.png"
                  alt="AdFlux logo"
                  fill
                  priority
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
              Turn attention into growth with smarter ad planning, local payments, and campaign reporting built for modern businesses.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--subtle)]">Company</p>
            <div className="space-y-3 text-sm">
              <Link href="/about" className="block text-[var(--muted)] transition-colors hover:text-[var(--text)]">About</Link>
              <Link href="/pricing" className="block text-[var(--muted)] transition-colors hover:text-[var(--text)]">Pricing</Link>
              <Link href="/contact" className="block text-[var(--muted)] transition-colors hover:text-[var(--text)]">Support</Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--subtle)]">Legal</p>
            <div className="space-y-3 text-sm">
              <Link href="/terms" className="block text-[var(--muted)] transition-colors hover:text-[var(--text)]">Terms</Link>
              <Link href="/privacy" className="block text-[var(--muted)] transition-colors hover:text-[var(--text)]">Privacy</Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--subtle)]">Reach us</p>
            <div className="space-y-3 text-sm text-[var(--muted)]">
              <p>support@adflux.example</p>
              <p>+237 6xx xxx xxx</p>
              <p>© 2024 AdFlux</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
