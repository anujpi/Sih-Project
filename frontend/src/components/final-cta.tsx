"use client";

import { Play, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/reveal";

export default function FinalCta() {
  return (
    <section className="vn-section">
      <div className="vn-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-vn-border bg-white p-8 text-center shadow-sm sm:p-14">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(60% 55% at 50% 0%, rgba(21,101,216,0.04), transparent 65%)",
              }}
            />
            <div className="vn-grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-vn-navy text-white shadow-md">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
              Put a suspicious voice to the test
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-vn-secondary">
              Run four scenarios through the live console — from a genuine call to a cloned
              scam demanding your OTP — and watch all four intelligence layers score the
              interaction in real time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-vn-navy px-7 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-vn-navy-deep hover:shadow-lg active:scale-[0.98]"
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                Run Interactive Demo
              </Link>
            </div>
            <p className="mt-5 text-xs text-vn-muted">
              Fully offline demo mode — no backend required for the walkthrough.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
