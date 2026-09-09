export type RiskTier = "low" | "medium" | "high" | "critical";

export type PipelineStageStatus =
  | "waiting"
  | "processing"
  | "completed"
  | "skipped"
  | "error";

export interface VoiceAuthenticityResult {
  synthetic_probability: number;
  label: string;
  model_finetuned: boolean;
}

export interface IdentityVerificationResult {
  similarity_score: number;
  identity_match: boolean;
  source?: "registry" | "reference_audio";
  claimed_identity?: string;
  warning?: string;
}

export interface IntentAnalysisResult {
  transcript: string;
  flags: Record<string, boolean>;
  triggered_intents: string[];
  intent_risk_score: number;
}

export interface RiskBreakdown {
  voice_authenticity_risk: number;
  identity_mismatch_risk: number;
  intent_risk: number;
}

export interface RiskResult {
  overall_risk: number;
  tier: RiskTier;
  response: string;
  breakdown: RiskBreakdown;
}

export interface AnalysisResponse {
  voice_authenticity: VoiceAuthenticityResult;
  identity_verification: IdentityVerificationResult | null;
  intent_analysis: IntentAnalysisResult;
  risk: RiskResult;
  identity_warning?: string;
}

export interface Voiceprint {
  name: string;
}

export interface RecentAnalysis {
  id: string;
  scenario: string;
  tier: RiskTier;
  score: number;
  timestamp: string;
  isDemo: boolean;
  result: AnalysisResponse;
}

export type ScenarioType =
  | "genuine"
  | "ai_cloned"
  | "ai_cloned_scam"
  | "known_person_mismatch";

export interface ScenarioConfig {
  type: ScenarioType;
  label: string;
  description: string;
  expectedTier: RiskTier;
  footnote: string;
  transcript: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  status: PipelineStageStatus;
  statusText?: string;
  error?: string;
}

export interface AnalysisMeta {
  scenarioLabel: string;
  scenarioType: ScenarioType | null;
  claimedIdentity: string;
  modeLabel: string;
  isDemo: boolean;
  timestamp: string;
}

export type VerificationStatus =
  | "none"
  | "pending"
  | "verified"
  | "blocked"
  | "dismissed";

export interface VerificationStep {
  id: string;
  label: string;
  description: string;
}

export type ToastKind = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  message: string;
  layer?: "voice" | "identity" | "intent" | "risk";
  type?: "info" | "warning" | "success" | "progress";
}

export type AnalysisState =
  | "idle"
  | "scenario_selected"
  | "file_selected"
  | "queued"
  | "streaming"
  | "voice_processing"
  | "identity_processing"
  | "transcript_updating"
  | "intent_processing"
  | "risk_recalculating"
  | "complete"
  | "verification_required"
  | "verification_in_progress"
  | "verified"
  | "blocked"
  | "error";