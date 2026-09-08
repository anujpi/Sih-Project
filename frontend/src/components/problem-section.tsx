"use client";

import { Quote, UserX2 } from "lucide-react";
import Reveal from "@/components/reveal";

const SHIFT = [
  {
    title: "Attackers stopped stealing credentials",
    copy: "Cloning one trusted voice bypasses passwords, OTP-first verification, and even the 'call someone you know' advice.",
  },
  {
    title: "The victim becomes the security check",
    copy: "The human is asked to judge authenticity from memory — a task people are measurably bad at with a convincing clone.",
  },
  {
    title: "The damage happens in one call",
    copy: "A short, urgent conversation is enough: OTPs, account details, or transfers — before anyone suspects anything.",
  },
];

export default function ProblemSection() {
  return (
    <section className="vn-section">
      <div className="vn-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-amber">
                The problem
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-text sm:text-4xl">
                Voice cloning turns identity fraud into personal
              </h2>
              <p className="mt-4 text-base leading-relaxed text-vn-muted">
                A few seconds of someone&apos;s voice is enough to impersonate a parent, a
                manager, or an authority figure. Defending against real-versus-fake audio alone
                misses the point — the attacker is not trying to fool a model, they are trying to
                fool you.
              </p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {SHIFT.map((item, index) => {
              const Icon = index === 2 ? UserX2 : Quote;
              return (
                <Reveal key={item.title} delay={index * 90}>
                  <div className="flex items-start gap-4 rounded-2xl border border-vn-border bg-vn-surface/50 p-5 transition-all hover:border-vn-amber/30 hover:bg-vn-surface/70">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vn-amber/10 text-vn-amber">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-vn-text">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-vn-muted">{item.copy}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={120}>
          <figure className="relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-vn-cyan/25 bg-vn-midnight/60 p-8 text-center sm:p-12">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 120% at 50% 0%, rgba(56,214,255,0.1), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <Quote className="mx-auto h-8 w-8 text-vn-cyan/60" aria-hidden="true" />
            <blockquote className="relative mt-4 text-xl font-bold leading-snug tracking-tight text-vn-text sm:text-2xl">
              The real question is not{" "}
              <span className="text-vn-muted line-through decoration-vn-red/60">
                “Is this audio fake?”
              </span>
              <br className="hidden sm:block" /> It is{" "}
              <span className="bg-gradient-to-r from-vn-cyan to-vn-violet bg-clip-text text-transparent">
                “Is this interaction safe?”
              </span>
            </blockquote>
            <figcaption className="relative mt-4 text-xs font-medium tracking-widest text-vn-muted">
              THE QUESTION VAANISHIELD IS BUILT TO ANSWER
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}