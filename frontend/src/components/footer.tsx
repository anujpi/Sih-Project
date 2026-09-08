"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-vn-border bg-white">
      <div className="vn-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-vn-navy text-white">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-base font-bold text-vn-navy">VAANISHIELD</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-vn-secondary">
              An AI-powered voice impersonation defense layer built for the Smart India
              Hackathon 2026 (problem statement SIH26104). It combines synthetic voice
              detection, speaker identity verification, speech-to-text scam-intent analysis,
              and an explainable unified risk score — with adaptive verification before risky
              actions.
            </p>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-vn-muted">
              <strong className="text-vn-secondary">Prototype limitation.</strong> VAANISHIELD provides
              probabilistic risk assessment. It is not a final determination of authenticity or identity.
              Verification actions, SMS/WhatsApp checks, telecom interception, and payment blocking are
              prototype simulations only and are not connected to any live system.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-bold text-vn-navy">Product</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/demo" className="text-sm text-vn-secondary transition-colors hover:text-vn-primary">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-vn-secondary transition-colors hover:text-vn-primary">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#technology" className="text-sm text-vn-secondary transition-colors hover:text-vn-primary">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-sm text-vn-secondary transition-colors hover:text-vn-primary">
                  Insights
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold text-vn-navy">Honest positioning</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-vn-secondary">
              <li>No claim of 100% detection accuracy.</li>
              <li>English, Hindi, and Kannada support is on the roadmap.</li>
              <li>Model weights are a prototype starting point, not validated production parameters.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-vn-border pt-6 text-center">
          <p className="text-xs text-vn-muted">
            VAANISHIELD · SIH 2026 · Team SIH26104 — prototype for evaluation and demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}
