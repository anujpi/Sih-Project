"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-vn-border bg-vn-midnight/60">
      <div className="vn-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vn-cyan to-vn-indigo text-vn-navy">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-base font-bold text-vn-text">VAANISHIELD</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-vn-muted">
              An AI-powered voice impersonation defense layer built for the Smart India
              Hackathon 2026 (problem statement SIH26104). It combines synthetic voice
              detection, speaker identity verification, speech-to-text scam-intent analysis,
              and an explainable unified risk score — with adaptive verification before risky
              actions.
            </p>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-vn-muted/70">
              <strong className="text-vn-muted">Prototype limitation.</strong> VAANISHIELD is a
              research prototype, not a certified security product. Risk scores are probabilistic
              indicators — they are not a guarantee of safe or unsafe calls. Verification actions,
              SMS/WhatsApp checks, telecom interception, and payment blocking are prototype
              simulations only and are not connected to any live system.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-bold text-vn-text">Product</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/demo" className="text-sm text-vn-muted transition-colors hover:text-vn-cyan">
                  Live Demo
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-vn-muted transition-colors hover:text-vn-cyan">
                  How it works
                </a>
              </li>
              <li>
                <a href="#technology" className="text-sm text-vn-muted transition-colors hover:text-vn-cyan">
                  Technology
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold text-vn-text">Honest positioning</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-vn-muted">
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