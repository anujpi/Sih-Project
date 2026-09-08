"use client";

import { PlayCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/reveal";

export default function FinalCta() {
  return (
    <section className="vn-section">
      <div className="vn-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-vn-border p-8 text-center sm:p-14">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(60% 55% at 50% 0%, rgba(56,214,255,0.14), transparent 65%), radial-gradient(45% 45% at 80% 100%, rgba(108,99,255,0.12), transparent 60%)",
              }}
            />
            <div className="vn-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden="true" />

            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-vn-cyan to-vn-indigo text-vn-navy shadow-xl shadow-vn-cyan/25">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-vn-text sm:text-4xl">
              Put a suspicious voice to the test
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-vn-muted">
              Run four scenarios through the live console — from a genuine call to a cloned
              scam demanding your OTP — and watch all four intelligence layers score the
              interaction in real time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-vn-cyan to-vn-indigo px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-vn-cyan/25 transition-all hover:shadow-vn-cyan/45 hover:brightness-110 active:scale-[0.98]"
              >
                <PlayCircle className="h-5 w-5" aria-hidden="true" />
                Try the Live Demo
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