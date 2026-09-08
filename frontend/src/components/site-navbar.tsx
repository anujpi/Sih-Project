"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/demo", label: "Live Demo" },
  { href: "/#technology", label: "Technology" },
  { href: "/#about", label: "About" },
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-vn-border bg-white/90 backdrop-blur-xl shadow-sm shadow-vn-navy/5"
          : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <div className="vn-container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="VAANISHIELD home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-vn-navy text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-mono text-base font-bold tracking-wide text-vn-navy">
            VAANISHIELD
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-vn-secondary transition-colors hover:text-vn-navy hover:bg-vn-surface-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden rounded-xl bg-vn-navy px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep hover:shadow-md sm:inline-flex"
          >
            Run a Safety Check
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border border-vn-border bg-white p-2 text-vn-navy md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-vn-border bg-white px-4 py-3 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-vn-secondary transition-colors hover:text-vn-navy hover:bg-vn-surface-blue"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-vn-navy px-4 py-2.5 text-sm font-bold text-white"
            >
              Run a Safety Check
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
