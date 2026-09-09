"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#product", label: "Workflow" },
  { href: "/how-it-works", label: "4 Layers" },
  { href: "/demo", label: "Security Console" },
  { href: "/#technology", label: "Matrix Benchmark" },
  { href: "/#languages", label: "India Roadmap" },
];

export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-vn-border bg-white/95 backdrop-blur-md shadow-sm"
          : "border-b border-vn-border-light bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="vn-container flex items-center justify-between gap-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="VAANISHIELD home">
          <span className="flex h-8 w-8 items-center justify-center rounded border border-vn-border bg-vn-navy text-white shadow-sm">
            <ShieldCheck className="h-4 w-4 text-vn-blue" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-wider text-vn-navy">
              VAANISHIELD
            </span>
            <span className="font-mono text-[9px] font-semibold text-vn-muted leading-none">
              SIH26104 DEFENSE MATRIX
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 font-mono text-xs font-semibold text-vn-secondary transition-colors hover:bg-vn-surface-blue hover:text-vn-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden rounded-md bg-vn-navy px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep sm:inline-flex"
          >
            Launch Console
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-vn-border bg-white p-2 text-vn-navy md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-vn-border bg-white px-4 py-3 shadow-md md:hidden"
        >
          <div className="flex flex-col gap-1 font-mono text-xs">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-vn-secondary hover:bg-vn-surface-blue hover:text-vn-navy"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-vn-navy px-4 py-2.5 font-bold text-white"
            >
              Launch Console
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
