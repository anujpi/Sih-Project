"use client";

import { ArrowRight, Play, Layers } from "lucide-react";
import Link from "next/link";
import LiveGuardWidget from "@/components/live-guard-widget";
import Reveal from "@/components/reveal";

const TRUST_LABELS = [
  "Probabilistic analysis",
  "Explainable evidence",
  "Adaptive verification",
];

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32"
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="vn-grid-bg absolute inset-0 opacity-50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 50% at 80% 0%, rgba(0,167,199,0.06), transparent 60%), radial-gradient(60% 45% at 10% 20%, rgba(21,101,216,0.05), transparent 55%)",
          }}
        />
      </div>

      <div className="vn-container grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Copy */}
        <Reveal>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-vn-primary/20 bg-vn-primary/8 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-vn-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-vn-primary vn-pulse-soft" aria-hidden="true" />
              Real-time voice impersonation defense
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-vn-navy sm:text-5xl lg:text-[3.2rem]">
              Can you trust the voice
              <br />
              on the other end?
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-vn-secondary sm:text-lg">
              VAANISHIELD analyzes the voice, the claimed identity, and the conversation
              context before a dangerous decision is made. It checks authenticity, identity,
              intent, and context — with evidence you can actually read.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-vn-navy px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-vn-navy-deep hover:shadow-lg active:scale-[0.98]"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Run Interactive Demo
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-vn-border bg-white px-6 py-3 text-base font-semibold text-vn-navy transition-colors hover:border-vn-primary/40 hover:text-vn-primary"
              >
                <Layers className="h-4 w-4" aria-hidden="true" />
                Explore the Four Layers
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_LABELS.map((label) => (
                <li key={label} className="flex items-center gap-1.5 text-xs font-medium text-vn-muted">
                  <span className="h-1 w-1 rounded-full bg-vn-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Hero illustration */}
        <Reveal delay={120}>
          <LiveGuardWidget state="idle" />
        </Reveal>
      </div>
    </section>
  );
}
