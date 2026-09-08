"use client";

import { CheckCircle2, CloudCog, Languages } from "lucide-react";
import Reveal from "@/components/reveal";

const CURRENT = ["English"];

const IN_DEV = [
  { code: "HI", label: "Hindi" },
  { code: "KN", label: "Kannada" },
];

const ROADMAP = [
  { code: "TA", label: "Tamil" },
  { code: "TE", label: "Telugu" },
  { code: "ML", label: "Malayalam" },
  { code: "MR", label: "Marathi" },
  { code: "BN", label: "Bengali" },
];

export default function LanguagesSection() {
  return (
    <section id="languages" className="vn-section scroll-mt-24">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-indigo">
              Made for Indian conversations
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-text sm:text-4xl">
              Built for Indian voices and phone audio
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-muted">
              Scam pressure does not only happen in English. VAANISHIELD&apos;s intended target is
              Hinglish and India&apos;s multilingual phone traffic — here is the honest status of
              the language roadmap.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-2xl border border-vn-green/30 bg-vn-green/5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vn-green/15 text-vn-green">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-bold text-vn-text">Working today</h3>
              <p className="mt-1 text-sm leading-relaxed text-vn-muted">
                {CURRENT.map((lang) => (
                  <span key={lang} className="inline-flex items-center gap-1.5">
                    <span className="rounded-md bg-vn-green/10 px-2 py-0.5 font-semibold text-vn-green">
                      {lang}
                    </span>
                  </span>
                ))}{" "}
                — the current models are trained on English speech.
              </p>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="h-full rounded-2xl border border-vn-cyan/30 bg-vn-cyan/5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vn-cyan/15 text-vn-cyan">
                <Languages className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-bold text-vn-text">In development</h3>
              <ul className="mt-2 space-y-1.5">
                {IN_DEV.map((lang) => (
                  <li key={lang.code} className="flex items-center gap-2 text-sm text-vn-text/90">
                    <span className="w-8 rounded-md bg-vn-cyan/10 px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-vn-cyan">
                      {lang.code}
                    </span>
                    {lang.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="h-full rounded-2xl border border-vn-violet/25 bg-vn-violet/5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-vn-violet/15 text-vn-violet">
                <CloudCog className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-bold text-vn-text">Roadmap</h3>
              <ul className="mt-2 space-y-1.5">
                {ROADMAP.map((lang) => (
                  <li key={lang.code} className="flex items-center gap-2 text-sm text-vn-muted">
                    <span className="w-8 rounded-md bg-white/5 px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-vn-muted">
                      {lang.code}
                    </span>
                    {lang.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 rounded-lg border border-vn-border bg-vn-navy/40 px-2.5 py-1.5 text-[11px] leading-relaxed text-vn-muted">
                Future capability: robustness to noisy, low-bandwidth, and compressed phone
                audio.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}