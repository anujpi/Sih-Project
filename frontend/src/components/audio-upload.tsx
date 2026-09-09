"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ScenarioType } from "@/lib/types";
import { CLAIMED_IDENTITY_OPTIONS } from "@/lib/demo-scenarios";
import AudioVisualizer, {
  AudioReviewControls,
} from "@/components/audio-visualizer";
import { useToast } from "@/components/toast-provider";
import {
  ACCEPTED_TYPES,
  deleteVoice,
  formatBytes,
  getVoices,
  MAX_FILE_SIZE_MB,
  registerVoice,
  validateAudioFile,
} from "@/lib/api-client";
import {
  ChevronDown,
  FileAudio,
  Plus,
  Shield,
  Trash2,
  UploadCloud,
  UserCheck,
  UserRound,
  Zap,
} from "lucide-react";

export interface AnalysisInputState {
  scenario: ScenarioType;
  audioFile: File | null;
  referenceAudioFile: File | null;
  claimedIdentity: string;
}

const MAX_RECORDING_SECONDS = 12;

interface AudioUploadProps {
  mode: "demo" | "api";
  value: AnalysisInputState;
  onValueChange: (value: AnalysisInputState) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function AudioUpload({
  mode,
  value,
  onValueChange,
  onAnalyze,
  isAnalyzing,
}: AudioUploadProps) {
  const { push } = useToast();
  const [dragging, setDragging] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [refError, setRefError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Voiceprint Registry state
  const [registeredVoices, setRegisteredVoices] = useState<string[]>([]);
  const [registerName, setRegisterName] = useState("");
  const [registerFile, setRegisterFile] = useState<File | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [customIdentityInput, setCustomIdentityInput] = useState("");
  const [isCustomIdentity, setIsCustomIdentity] = useState(false);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const refInputRef = useRef<HTMLInputElement | null>(null);
  const regInputRef = useRef<HTMLInputElement | null>(null);

  const hasAudio = value.audioFile !== null;
  const hasReference = value.referenceAudioFile !== null;
  const audioObjectUrl = useMemo(
    () => (value.audioFile ? URL.createObjectURL(value.audioFile) : null),
    [value.audioFile]
  );

  const fetchRegisteredVoices = useCallback(async () => {
    if (mode !== "api") return;
    const voices = await getVoices();
    setRegisteredVoices(voices);
  }, [mode]);

  useEffect(() => {
    void fetchRegisteredVoices();
  }, [fetchRegisteredVoices]);

  useEffect(() => {
    return () => {
      if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    };
  }, [audioObjectUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const setAudio = useCallback(
    (file: File | null) => {
      onValueChange({ ...value, audioFile: file });
    },
    [value, onValueChange]
  );

  const setReference = useCallback(
    (file: File | null) => {
      onValueChange({ ...value, referenceAudioFile: file });
    },
    [value, onValueChange]
  );

  const setClaimed = useCallback(
    (identity: string) => {
      onValueChange({ ...value, claimedIdentity: identity });
    },
    [value, onValueChange]
  );

  function handleAudioFile(file: File | undefined) {
    if (!file) return;
    const error = validateAudioFile(file, "Audio");
    setAudioError(error);
    if (error) {
      setAudio(null);
      push("error", "Audio rejected", error);
      return;
    }
    setAudio(file);
    push("success", "Audio loaded", `${file.name} (${formatBytes(file.size)}) is ready.`);
  }

  function handleReferenceFile(file: File | undefined) {
    if (!file) return;
    const error = validateAudioFile(file, "Reference voice");
    setRefError(error);
    if (error) {
      setReference(null);
      push("error", "Reference voice rejected", error);
      return;
    }
    setReference(file);
    push("success", "Reference voice loaded", "Identity verification will compare the caller against it.");
  }

  async function handleRegisterVoiceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!registerName.trim() || !registerFile) {
      push("error", "Registration incomplete", "Provide both a speaker name and an audio file.");
      return;
    }

    setIsRegistering(true);
    try {
      const res = await registerVoice(registerName.trim(), registerFile);
      push("success", "Voiceprint registered", `Voiceprint for "${res.registered}" saved to backend registry.`);
      setRegisterName("");
      setRegisterFile(null);
      void fetchRegisteredVoices();
      setClaimed(res.registered);
    } catch {
      push("error", "Registration failed", "Failed to store voiceprint. Ensure the backend API is online.");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleDeleteVoiceprint(name: string) {
    try {
      await deleteVoice(name);
      push("info", "Voiceprint deleted", `"${name}" removed from registry.`);
      if (value.claimedIdentity === name) {
        setClaimed("Not specified");
      }
      void fetchRegisteredVoices();
    } catch {
      push("error", "Deletion failed", `Could not remove voiceprint "${name}".`);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleAudioFile(e.dataTransfer.files?.[0]);
  }

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioError("Microphone is not supported in this browser.");
      push("error", "Recording unavailable", "This browser does not expose a microphone.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        const blob = new Blob(chunksRef.current, { type: blobType() });
        const file = new File([blob], "vaanishield-recording.wav", { type: blob.type || "audio/wav" });
        setAudio(file);
        setAudioError(null);
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
        push("success", "Recording captured", "Your recording was encoded to WAV format and is ready for analysis.");
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          const next = s + 1;
          if (next >= MAX_RECORDING_SECONDS && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return next;
        });
      }, 1000);
    } catch {
      setAudioError(
        "Microphone access denied. Grant permission or upload an audio file instead."
      );
      push("error", "Microphone unavailable", "Permission was not granted for recording.");
    }
  }

  function blobType(): string {
    if (typeof MediaRecorder !== "undefined") {
      const types = ["audio/webm", "audio/mp4", "audio/ogg"];
      for (const t of types) {
        if (MediaRecorder.isTypeSupported(t)) return t;
      }
    }
    return "audio/webm";
  }

  function extensionFor(type: string): string {
    if (type.includes("mp4")) return "m4a";
    if (type.includes("ogg")) return "ogg";
    return "webm";
  }

  function togglePlayback() {
    if (!audioElRef.current) return;
    if (isPlaying) {
      audioElRef.current.pause();
    } else {
      void audioElRef.current.play();
    }
  }

  function restartPlayback() {
    if (!audioElRef.current) return;
    audioElRef.current.currentTime = 0;
    void audioElRef.current.play();
  }

  const canAnalyze = !isAnalyzing && !isRecording;
  const isDemoRun = mode === "demo";

  // Build combined identity list
  const identityOptions = useMemo(() => {
    const opts = ["Not specified", ...registeredVoices];
    CLAIMED_IDENTITY_OPTIONS.forEach((opt) => {
      if (!opts.includes(opt)) opts.push(opt);
    });
    return opts;
  }, [registeredVoices]);

  return (
    <section
      aria-labelledby="audio-input-heading"
      className="card-surface rounded-xl border border-vn-border bg-white"
    >
      <div className="space-y-5 p-5 sm:p-6">
        <header className="flex items-start justify-between gap-3 border-b border-vn-border-light pb-4">
          <div>
            <h3 id="audio-input-heading" className="text-base font-bold text-vn-navy">
              Call Telemetry Input
            </h3>
            <p className="mt-1 text-xs text-vn-secondary">
              Upload, drop, or record the audio stream to be screened by the 4-layer risk pipeline.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-md border border-vn-border bg-vn-surface-blue px-2.5 py-1 font-mono text-[11px] font-semibold text-vn-navy sm:inline-flex">
            <Zap className="h-3 w-3 text-vn-primary" aria-hidden="true" />
            {isDemoRun ? "Demo Mode" : "API Live"}
          </span>
        </header>

        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload or drop an audio file"
          onClick={() => audioInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") audioInputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
            dragging
              ? "border-vn-primary bg-vn-surface-blue"
              : "border-vn-border bg-vn-page hover:border-vn-secondary hover:bg-white"
          }`}
        >
          {hasAudio ? (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-vn-border bg-vn-surface-blue text-vn-navy">
                <FileAudio className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-vn-navy">{value.audioFile!.name}</span>
              <span className="font-mono text-xs text-vn-muted">
                {formatBytes(value.audioFile!.size)} — click to swap
              </span>
            </>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-vn-border bg-white text-vn-secondary shadow-sm">
                <UploadCloud className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-vn-navy">
                Drop audio recording, or{" "}
                <span className="text-vn-primary underline underline-offset-2">browse files</span>
              </span>
              <span className="rounded border border-vn-border bg-white px-2.5 py-0.5 font-mono text-[11px] text-vn-muted">
                WAV · MP3 · M4A · OGG · WebM — max {MAX_FILE_SIZE_MB} MB
              </span>
            </>
          )}
          <input
            ref={audioInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            aria-label="Upload call audio file"
            onChange={(e) => {
              handleAudioFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        {audioError && (
          <p role="alert" className="flex items-center gap-2 text-xs font-semibold text-vn-red">
            {audioError}
          </p>
        )}

        {/* Audio Visualizer & Review */}
        <div className="rounded-lg border border-vn-border bg-vn-page p-4">
          <AudioVisualizer active={isRecording || isPlaying} bars={36} />
          <div className="mt-3">
            <AudioReviewControls
              fileName={
                isRecording
                  ? `Recording ${recordingSeconds}s`
                  : (value.audioFile?.name ?? "")
              }
              isPlaying={isPlaying}
              isRecording={isRecording}
              recordingSeconds={recordingSeconds}
              maxRecordingSeconds={MAX_RECORDING_SECONDS}
              onPlay={togglePlayback}
              onPause={() => audioElRef.current?.pause()}
              onRestart={restartPlayback}
              onDelete={() => {
                setAudio(null);
                setAudioError(null);
                push("info", "Audio cleared", "Select another file or record again.");
              }}
              onStartRecording={() => void toggleRecording()}
              onStopRecording={() => toggleRecording()}
            />
          </div>
          {value.audioFile && audioObjectUrl && (
            <audio
              ref={audioElRef}
              src={audioObjectUrl}
              loop={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>

        {/* Layer 2: Identity Reference & Voiceprint Registry */}
        <div className="rounded-lg border border-vn-border bg-white">
          <button
            type="button"
            aria-expanded={refOpen}
            onClick={() => setRefOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-vn-page"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold text-vn-navy">
              <UserRound className="h-4 w-4 text-vn-primary" aria-hidden="true" />
              Layer 2: Speaker Identity Reference
              <span className="rounded border border-vn-border bg-vn-page px-2 py-0.5 font-mono text-[10px] text-vn-muted">
                optional
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-vn-muted transition-transform ${refOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {refOpen && (
            <div className="space-y-5 border-t border-vn-border p-4">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Claimed Identity Selector / Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="claimed-identity" className="text-xs font-bold text-vn-navy">
                      Claimed Identity Name
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomIdentity((v) => !v)}
                      className="text-[11px] text-vn-primary hover:underline"
                    >
                      {isCustomIdentity ? "Choose from list" : "Type custom name"}
                    </button>
                  </div>

                  {isCustomIdentity ? (
                    <input
                      id="claimed-identity-input"
                      type="text"
                      placeholder="e.g. Alice, Branch Manager"
                      value={customIdentityInput}
                      onChange={(e) => {
                        setCustomIdentityInput(e.target.value);
                        setClaimed(e.target.value || "Not specified");
                      }}
                      className="w-full rounded-md border border-vn-border bg-white px-3 py-2 text-xs font-medium text-vn-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary"
                    />
                  ) : (
                    <select
                      id="claimed-identity"
                      value={value.claimedIdentity}
                      onChange={(e) => setClaimed(e.target.value)}
                      className="w-full rounded-md border border-vn-border bg-white px-3 py-2 text-xs font-medium text-vn-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary"
                    >
                      {identityOptions.map((id) => (
                        <option key={id} value={id}>
                          {registeredVoices.includes(id) ? `✓ ${id} (Registered)` : id}
                        </option>
                      ))}
                    </select>
                  )}

                  <p className="text-[11px] leading-relaxed text-vn-muted">
                    If present in the voiceprint registry, Layer 2 checks against stored vector embeddings.
                  </p>
                </div>

                {/* Fresh Reference Voice Upload */}
                <div className="space-y-2">
                  <label htmlFor="reference-audio" className="text-xs font-bold text-vn-navy">
                    Fresh Reference Sample <span className="font-normal text-vn-muted">(if un-registered)</span>
                  </label>
                  <label
                    htmlFor="reference-audio"
                    className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-vn-border bg-vn-page px-3 py-2 text-xs text-vn-muted transition-colors hover:border-vn-primary hover:text-vn-navy"
                  >
                    <UserRound className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
                    {hasReference
                      ? value.referenceAudioFile!.name
                      : "Upload audio sample"}
                    <input
                      id="reference-audio"
                      ref={refInputRef}
                      type="file"
                      accept={ACCEPTED_TYPES.join(",")}
                      className="sr-only"
                      aria-label="Upload reference voice audio file"
                      onChange={(e) => {
                        handleReferenceFile(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {refError && (
                    <p role="alert" className="text-xs text-vn-red">
                      {refError}
                    </p>
                  )}
                  {hasReference && !refError && (
                    <button
                      type="button"
                      className="text-xs text-vn-muted underline underline-offset-2 transition-colors hover:text-vn-red"
                      onClick={() => {
                        setReference(null);
                        push("info", "Reference voice cleared");
                      }}
                    >
                      Remove sample
                    </button>
                  )}
                </div>
              </div>

              {/* Voiceprint Registry Management Section (API Mode) */}
              {mode === "api" && (
                <div className="rounded-lg border border-vn-border bg-vn-page p-4">
                  <div className="flex items-center justify-between gap-2 border-b border-vn-border pb-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-vn-navy">
                      <Shield className="h-4 w-4 text-vn-primary" aria-hidden="true" />
                      Voiceprint Registry
                    </span>
                    <span className="font-mono text-[10px] text-vn-muted">
                      {registeredVoices.length} registered
                    </span>
                  </div>

                  {/* Register Voice Form */}
                  <form onSubmit={handleRegisterVoiceSubmit} className="mt-3 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Speaker identifier (e.g., Alice)"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="rounded-md border border-vn-border bg-white px-3 py-1.5 text-xs text-vn-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary"
                      />
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="reg-file"
                          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-vn-border bg-white px-3 py-1.5 text-xs text-vn-secondary transition-colors hover:border-vn-primary"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          {registerFile ? registerFile.name : "Select audio"}
                          <input
                            id="reg-file"
                            ref={regInputRef}
                            type="file"
                            accept={ACCEPTED_TYPES.join(",")}
                            className="sr-only"
                            onChange={(e) => setRegisterFile(e.target.files?.[0] || null)}
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={isRegistering || !registerName || !registerFile}
                          className="inline-flex items-center justify-center gap-1 rounded-md bg-vn-navy px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-vn-navy-deep disabled:opacity-40"
                        >
                          <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          {isRegistering ? "Saving…" : "Save Voice"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* List of Registered Voiceprints */}
                  {registeredVoices.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-vn-border pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-vn-muted">
                        Stored Voiceprints
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {registeredVoices.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1.5 rounded border border-vn-border bg-white px-2.5 py-1 font-mono text-xs font-semibold text-vn-navy"
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              onClick={() => void handleDeleteVoiceprint(name)}
                              className="text-vn-muted hover:text-vn-red"
                              title={`Delete ${name}`}
                            >
                              <Trash2 className="h-3 w-3" aria-hidden="true" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col gap-3 border-t border-vn-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-relaxed text-vn-muted">
            {isDemoRun
              ? "Offline demo scenario — executes full 4-layer decision pipeline in simulated mode."
              : "Live analysis will post call audio to API endpoint /analyze/full."}
          </p>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-vn-navy px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary disabled:cursor-not-allowed disabled:opacity-40 ${
              isAnalyzing ? "cursor-wait" : "active:scale-[0.98]"
            }`}
          >
            <Zap className="h-4 w-4 text-vn-blue" aria-hidden="true" />
            {isAnalyzing ? "Analyzing Signal…" : "Analyze Interaction"}
          </button>
        </div>
      </div>
    </section>
  );
}
