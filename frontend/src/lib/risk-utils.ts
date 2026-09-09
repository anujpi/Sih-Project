import { RiskTier } from "@/lib/types";

export interface TierMeta {
  label: string;
  rank: number;
  hex: string;
  dotClass: string;
  textClass: string;
  badgeClass: string;
  barClass: string;
  chipClass: string;
  ringHex: string;
  bgClass: string;
}

export const TIER_META: Record<RiskTier, TierMeta> = {
  low: {
    label: "Low",
    rank: 0,
    hex: "#159A6B",
    dotClass: "bg-vn-green",
    textClass: "text-vn-green",
    badgeClass: "border-vn-green/30 bg-vn-green/8 text-vn-green",
    barClass: "bg-vn-green",
    chipClass: "border-vn-green/30 bg-vn-green/8 text-vn-green",
    ringHex: "#159A6B",
    bgClass: "bg-vn-green/5",
  },
  medium: {
    label: "Medium",
    rank: 1,
    hex: "#D97706",
    dotClass: "bg-vn-amber",
    textClass: "text-vn-amber",
    badgeClass: "border-vn-amber/30 bg-vn-amber/8 text-vn-amber",
    barClass: "bg-vn-amber",
    chipClass: "border-vn-amber/30 bg-vn-amber/8 text-vn-amber",
    ringHex: "#D97706",
    bgClass: "bg-vn-amber/5",
  },
  high: {
    label: "High",
    rank: 2,
    hex: "#EA6A00",
    dotClass: "bg-vn-orange",
    textClass: "text-vn-orange",
    badgeClass: "border-vn-orange/30 bg-vn-orange/8 text-vn-orange",
    barClass: "bg-vn-orange",
    chipClass: "border-vn-orange/30 bg-vn-orange/8 text-vn-orange",
    ringHex: "#EA6A00",
    bgClass: "bg-vn-orange/5",
  },
  critical: {
    label: "Critical",
    rank: 3,
    hex: "#D92D4F",
    dotClass: "bg-vn-red",
    textClass: "text-vn-red",
    badgeClass: "border-vn-red/30 bg-vn-red/8 text-vn-red",
    barClass: "bg-vn-red",
    chipClass: "border-vn-red/30 bg-vn-red/8 text-vn-red",
    ringHex: "#D92D4F",
    bgClass: "bg-vn-red/5",
  },
};

export const TIER_ORDER: RiskTier[] = ["low", "medium", "high", "critical"];

export function normalizeScore(value: unknown, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  let n = value;
  if (n >= 0 && n <= 1) n = n * 100;
  return Math.min(100, Math.max(0, Math.round(n * 10) / 10));
}

export function formatScore(value: unknown, fallback = 0): string {
  return `${Math.round(normalizeScore(value, fallback))}%`;
}

export function tierFromRisk(score: number): RiskTier {
  if (score < 30) return "low";
  if (score < 55) return "medium";
  if (score < 80) return "high";
  return "critical";
}

export const INTENT_LABELS: Record<string, string> = {
  otp_request: "OTP request",
  financial_request: "Financial request",
  urgency: "Urgency",
  authority_claim: "Authority claim",
  secrecy_request: "Secrecy request",
};

export const RISKY_TERMS = [
  "otp",
  "one-time password",
  "verification code",
  "urgent",
  "immediately",
  "right now",
  "emergency",
  "transfer",
  "money",
  "bank",
  "password",
  "secret",
  "upi",
  "account",
  "wire",
  "pin",
];

export function highlightTranscript(transcript: string): string {
  const escaped = transcript.replace(/[&<>"]/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return c;
    }
  });
  const pattern = new RegExp(`\\b(${RISKY_TERMS.join("|")})\\b`, "gi");
  return escaped.replace(
    pattern,
    (match) => `<mark class="vn-transcript-mark">${match}</mark>`
  );
}

export type RiskTermKind = "money" | "urgency" | "secrecy" | "otp" | "authority";

export const RISK_TERM_STYLE: Record<RiskTermKind, { bg: string; color: string; class: string }> = {
  money: { bg: "#FEF3E2", color: "#D97706", class: "vn-term-money" },
  urgency: { bg: "#FDEEE3", color: "#EA6A00", class: "vn-term-urgency" },
  secrecy: { bg: "#EEEDFF", color: "#5B5FEF", class: "vn-term-secrecy" },
  otp: { bg: "#FBECEF", color: "#D92D4F", class: "vn-term-otp" },
  authority: { bg: "#E5F0FF", color: "#1565D8", class: "vn-term-authority" },
};

export interface TranscriptMark {
  text: string;
  kind: RiskTermKind | null;
}

const TERM_KIND_PATTERNS: Array<{ kind: RiskTermKind; pattern: RegExp }> = [
  { kind: "money", pattern: /\b(transfer|money|bank|upi|account|wire|pay|payment|loan|cash|fund)\b/i },
  { kind: "urgency", pattern: /\b(urgent|immediately|right now|emergency|asap|hurry|now|today|immediate)\b/i },
  { kind: "secrecy", pattern: /\b(secret|confidential|don't tell|do not tell|keep this between|nobody knows|hide)\b/i },
  { kind: "otp", pattern: /\b(otp|one-time password|verification code|password|pin|code)\b/i },
  { kind: "authority", pattern: /\b(officer|police|court|vigil|bank manager|rbi|income tax|official|investigation)\b/i },
];

export function highlightRiskTerms(text: string): TranscriptMark[] {
  if (!text) return [{ text: "", kind: null }];
  const marks: TranscriptMark[] = [];
  for (const { kind, pattern } of TERM_KIND_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      marks.push({ text: text.slice(start, end), kind });
      if (match[0].length === 0) pattern.lastIndex += 1;
    }
  }
  if (marks.length === 0) return [{ text, kind: null }];
  marks.sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text));
  const merged: TranscriptMark[] = [];
  let cursor = 0;
  for (const mark of marks) {
    if (cursor < text.indexOf(mark.text)) {
      merged.push({ text: text.slice(cursor, text.indexOf(mark.text)), kind: null });
    }
    merged.push(mark);
    cursor = text.indexOf(mark.text) + mark.text.length;
  }
  if (cursor < text.length) merged.push({ text: text.slice(cursor), kind: null });
  return merged;
}
