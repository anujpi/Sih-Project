"use client";

import { Play, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/reveal";

export default function FinalCta() {
  return (
    <section className="vn-section border-b border-vn-border bg-vn-page">
      <div className="vn-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-vn-border bg-white p-8 text-center shadow-sm sm:p-12">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-md border border-vn-border bg-vn-surface-blue text-vn-navy shadow-sm">
              <ShieldCheck className="h-5 w-5 text-vn-primary" aria-hidden="true" />
            </span>
            <h2 className="mx-auto mt-4 max-w-xl text-2xl font-extrabold tracking-tight text-vn-navy sm:text-3xl">
              Test Audio Telemetry Against the 4-Layer Defense Matrix
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-vn-secondary sm:text-sm">
              Evaluate real audio uploads or sample offline scenarios — from bonafide calls to deepfake scam interactions — and observe real-time feature extraction and risk classification.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-md bg-vn-navy px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep active:scale-[0.98]"
              >
                <Play className="h-4 w-4 text-vn-blue" aria-hidden="true" />
                Launch Security Console
              </Link>
            </div>
            <p className="mt-4 font-mono text-[11px] text-vn-muted">
              Supports both offline simulated scenarios and live FastAPI inference at /analyze/full.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
