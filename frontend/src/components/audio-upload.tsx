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
  formatBytes,
  MAX_FILE_SIZE_MB,
  validateAudioFile,
} from "@/lib/api-client";
import { ChevronDown, FileAudio, UploadCloud, UserRound, Zap } from "lucide-react";

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
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const refInputRef = useRef<HTMLInputElement | null>(null);

  const hasAudio = value.audioFile !== null;
  const hasReference = value.referenceAudioFile !== null;
  const audioObjectUrl = useMemo(
    () => (value.audioFile ? URL.createObjectURL(value.audioFile) : null),
    [value.audioFile]
  );

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
      recorder.onstop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        const blob = new Blob(chunksRef.current, { type: blobType() });
        const file = new File([blob], `vaanishield-recording.${extensionFor(blob.type)}`, {
          type: blob.type,
        });
        setAudio(file);
        setAudioError(null);
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
        push("success", "Recording captured", "Your recording is ready for analysis.");
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

  return (
    <section
      aria-labelledby="audio-input-heading"
      className="card-surface rounded-2xl"
    >
      <div className="space-y-6 p-5 sm:p-6">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h3 id="audio-input-heading" className="text-base font-semibold text-vn-navy">
              Call audio
            </h3>
            <p className="mt-1 text-sm text-vn-muted">
              Upload, drop, or record the voice interaction you want VAANISHIELD to analyze.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-vn-primary/25 bg-vn-primary/8 px-2.5 py-1 text-[11px] font-medium text-vn-primary sm:inline-flex">
            <Zap className="h-3 w-3" aria-hidden="true" />
            {isDemoRun ? "Demo input" : "Live input"}
          </span>
        </header>

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
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan ${
            dragging
              ? "border-vn-cyan bg-vn-cyan/10"
              : "border-vn-border bg-vn-surface-blue/60 hover:border-vn-cyan/50 hover:bg-vn-cyan/5"
          }`}
        >
          {hasAudio ? (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-vn-cyan/15 text-vn-cyan">
                <FileAudio className="h-7 w-7" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-vn-navy">{value.audioFile!.name}</span>
              <span className="text-xs text-vn-muted">
                {formatBytes(value.audioFile!.size)} — click to replace
              </span>
            </>
          ) : (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-vn-cyan/20 to-vn-indigo/20 text-vn-cyan">
                <UploadCloud className="h-7 w-7" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-vn-navy sm:text-base">
                Drag & drop audio, or{" "}
                <span className="text-vn-cyan underline underline-offset-2">browse files</span>
              </span>
              <span className="rounded-full border border-vn-border bg-vn-page px-3 py-1 font-mono text-[11px] text-vn-muted">
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
          <p role="alert" className="flex items-center gap-2 text-sm text-vn-red">
            {audioError}
          </p>
        )}

        <div className="rounded-xl border border-vn-border bg-white p-4">
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

        <div className="rounded-xl border border-vn-border bg-white">
          <button
            type="button"
            aria-expanded={refOpen}
            onClick={() => setRefOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-vn-navy">
              <UserRound className="h-4 w-4 text-vn-cyan" aria-hidden="true" />
              Add identity reference
              <span className="rounded-full border border-vn-border bg-vn-page px-2 py-0.5 text-[10px] text-vn-muted">
                optional
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-vn-muted transition-transform ${refOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {refOpen && (
            <div className="grid gap-5 border-t border-vn-border p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="claimed-identity" className="text-sm font-medium text-vn-navy">
                    Claimed identity
                  </label>
                  <span className="text-[11px] text-vn-muted">optional</span>
                </div>
                <select
                  id="claimed-identity"
                  value={value.claimedIdentity}
                  onChange={(e) => setClaimed(e.target.value)}
                  className="w-full rounded-lg border border-vn-border bg-vn-surface-blue/60 px-3 py-2 text-sm text-vn-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan"
                >
                  {CLAIMED_IDENTITY_OPTIONS.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-relaxed text-vn-muted">
                  When set, Layer 2 compares the caller against this registered identity.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reference-audio" className="text-sm font-medium text-vn-navy">
                  Reference voice <span className="text-vn-muted">(trusted sample)</span>
                </label>
                <label
                  htmlFor="reference-audio"
                  className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-vn-border bg-vn-surface-blue/60 px-3 py-2 text-sm text-vn-muted transition-colors hover:border-vn-cyan/50 hover:text-vn-navy"
                >
                  <UserRound className="h-4 w-4 text-vn-cyan" aria-hidden="true" />
                  {hasReference
                    ? value.referenceAudioFile!.name
                    : "Upload known speaker sample"}
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
                    Remove reference voice
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-vn-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-relaxed text-vn-muted">
            {isDemoRun
              ? "No audio file attached — the selected scenario runs as a simulated playback through all four layers."
              : "Real audio will be sent to the VAANISHIELD API endpoint /analyze/full."}
          </p>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-vn-cyan to-vn-indigo px-6 py-3 text-sm font-bold text-white shadow-lg shadow-vn-cyan/20 transition-all hover:shadow-vn-cyan/40 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan disabled:cursor-not-allowed disabled:opacity-40 ${
              isAnalyzing ? "cursor-wait" : "active:scale-[0.98]"
            }`}
          >
            <Zap className="h-4 w-4" aria-hidden="true" />
            {isAnalyzing ? "Analyzing…" : "Analyze Voice Interaction"}
          </button>
        </div>
      </div>
    </section>
  );
}
