"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-vn-border bg-white">
      <div className="vn-container py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded border border-vn-border bg-vn-navy text-white">
                <ShieldCheck className="h-4 w-4 text-vn-blue" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm font-bold tracking-wider text-vn-navy">VAANISHIELD</span>
            </div>
            <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-vn-secondary">
              Voice impersonation & audio deepfake defense system — Smart India Hackathon 2026 (Problem Statement SIH26104). Combines wav2vec2 acoustic deepfake detection, SpeechBrain ECAPA-TDNN speaker verification, faster-whisper STT scam intent analysis, and a unified 0-100 risk engine.
            </p>
            <p className="mt-3 max-w-md font-mono text-[11px] leading-relaxed text-vn-muted">
              <strong className="text-vn-navy">Research Notice:</strong> VAANISHIELD computes probabilistic risk indicators. Mitigation actions, SMS/WhatsApp out-of-band checks, telecom blocking, and financial holds are prototype simulations.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-vn-navy">Navigation</h3>
            <ul className="mt-3 space-y-2 font-mono text-xs text-vn-secondary">
              <li>
                <Link href="/demo" className="transition-colors hover:text-vn-primary">
                  Live Security Console
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="transition-colors hover:text-vn-primary">
                  4-Layer Architecture
                </Link>
              </li>
              <li>
                <Link href="/#technology" className="transition-colors hover:text-vn-primary">
                  Benchmark Matrix
                </Link>
              </li>
              <li>
                <Link href="/insights" className="transition-colors hover:text-vn-primary">
                  Local Analytics & Insights
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-vn-navy">Technical Disclosures</h3>
            <ul className="mt-3 space-y-2 font-mono text-xs text-vn-secondary">
              <li>• Probabilistic risk scoring — no false 100% certainty claims.</li>
              <li>• Fine-tuned wav2vec2 + SpeechBrain ECAPA-TDNN architecture.</li>
              <li>• India multilingual telephony & Hinglish roadmap.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-vn-border pt-5 text-center font-mono text-[11px] text-vn-muted">
          VAANISHIELD · Smart India Hackathon 2026 · Problem Statement SIH26104
        </div>
      </div>
    </footer>
  );
}
