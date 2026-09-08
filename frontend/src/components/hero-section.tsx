"use client";

import { ArrowDown, PlayCircle } from "lucide-react";
import Link from "next/link";
import LiveGuardWidget from "@/components/live-guard-widget";
import Reveal from "@/components/reveal";
import { LiveStatusTicker } from "@/components/status-badge";

const STATS = [
  { value: "4", label: "intelligence layers" },
  { value: "Explainable", label: "risk assessment" },
  { value: "Adaptive", label: "verification" },
  { value: "EN · HI · KN", label: "roadmap" },
];

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36"
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="vn-grid-bg absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 50% at 80% 0%, rgba(56,214,255,0.14), transparent 60%), radial-gradient(60% 45% at 10% 20%, rgba(108,99,255,0.12), transparent 55%), radial-gradient(50% 40% at 50% 100%, rgba(167,139,250,0.08), transparent 60%)",
          }}
        />
      </div>

      <div className="vn-container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Copy */}
        <Reveal>
          <div className="max-w-2xl">
            <LiveStatusTicker variant="live" label="Threat protection active" icon="shield" />
            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-vn-cyan">
              Real-time voice impersonation defense
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-vn-text sm:text-5xl lg:text-[3.4rem]">
              When a voice can be{" "}
              <span className="bg-gradient-to-r from-vn-cyan via-vn-violet to-vn-indigo bg-clip-text text-transparent">
                cloned,
              </span>
              <br />
              voice alone cannot be trusted.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-vn-muted sm:text-lg">
              VAANISHIELD adds an intelligent security layer between a suspicious voice and a
              dangerous decision. It listens to four signals at once — synthetic voice, speaker
              identity, conversation intent, and a unified risk score — and tells you whether an
              interaction is safe enough to act on.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-vn-cyan to-vn-indigo px-6 py-3 text-base font-bold text-white shadow-xl shadow-vn-cyan/25 transition-all hover:shadow-vn-cyan/45 hover:brightness-110 active:scale-[0.98]"
              >
                <PlayCircle className="h-5 w-5" aria-hidden="true" />
                Try Live Demo
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-vn-border bg-white/5 px-6 py-3 text-base font-semibold text-vn-text transition-colors hover:border-vn-cyan/40 hover:text-vn-cyan"
              >
                Explore How It Works
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-6 text-xs font-medium tracking-wide text-vn-muted">
              Probabilistic analysis · Explainable evidence · Adaptive verification
            </p>
          </div>
        </Reveal>

        {/* Hero illustration */}
        <Reveal delay={120}>
          <LiveGuardWidget />
        </Reveal>
      </div>

      {/* Stats row */}
      <div className="vn-container mt-16">
        <Reveal delay={80}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-vn-border bg-vn-border sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-vn-surface/70 px-4 py-5 text-center"
              >
                <dt className="order-2 text-xs font-medium text-vn-muted">{stat.label}</dt>
                <dd className="order-1 bg-gradient-to-r from-vn-cyan to-vn-violet bg-clip-text font-mono text-xl font-bold text-transparent sm:text-2xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}