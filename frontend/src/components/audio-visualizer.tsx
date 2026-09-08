"use client";

import {
  Activity,
  CircleStop,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

interface AudioVisualizerProps {
  active: boolean;
  bars?: number;
  className?: string;
  ariaLabel?: string;
}

const STATIC_LEVEL = 0.16;

/**
 * Animated waveform made of bars. Runs a lightweight rAF loop while
 * `active` is true; shows a flat, still line otherwise.
 */
export default function AudioVisualizer({
  active,
  bars = 32,
  className,
  ariaLabel = "Audio waveform",
}: AudioVisualizerProps) {
  const [levels, setLevels] = useState<number[]>(() => []);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      setLevels(
        Array.from({ length: bars }, () => {
          // pseudo-random waveform derived from time, avoids storing big state
          const t = performance.now() / 1200;
          const wave =
            0.5 +
            0.5 * Math.sin(t + Math.random() * Math.PI * 2) +
            Math.sin(t * 1.7 + bars) * 0.5;
          return Math.max(0.15, Math.min(1, wave * 0.7));
        })
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, bars]);

  const shown =
    active && levels.length === bars
      ? levels
      : Array.from({ length: bars }, () => STATIC_LEVEL);

  return (
    <div
      className={`flex h-14 items-end gap-[3px] ${className ?? ""}`}
      aria-label={ariaLabel}
      role="img"
    >
      {shown.map((level, i) => (
        <span
          key={i}
          className={`w-full flex-1 rounded-full transition-transform ${
            active ? "vn-wave-bar" : ""
          }`}
          style={{
            height: `${Math.max(8, level * 100)}%`,
            background: "linear-gradient(180deg, #38d6ff, #6c63ff)",
            opacity: active ? 0.9 : 0.3,
            animationDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}

export interface AudioReviewControlsProps {
  fileName: string;
  isPlaying: boolean;
  isRecording: boolean;
  recordingSeconds: number;
  maxRecordingSeconds: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onDelete: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

/**
 * Play / pause / restart / delete controls shown after a file loads,
 * plus the record toggle + timer.
 */
export function AudioReviewControls({
  fileName,
  isPlaying,
  isRecording,
  recordingSeconds,
  maxRecordingSeconds,
  onPlay,
  onPause,
  onRestart,
  onDelete,
  onStartRecording,
  onStopRecording,
}: AudioReviewControlsProps) {
  const formatTimer = useMemo(
    () =>
      `${String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:${String(
        recordingSeconds % 60
      ).padStart(2, "0")}`,
    [recordingSeconds]
  );

  return (
    <div className="space-y-3">
      {isRecording ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStopRecording}
            className="inline-flex items-center gap-2 rounded-lg border border-vn-red/50 bg-vn-red/15 px-4 py-2 text-sm font-semibold text-vn-red transition-colors hover:bg-vn-red/25"
          >
            <CircleStop className="h-4 w-4" aria-hidden="true" />
            Stop recording
          </button>
          <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2 font-mono text-sm text-vn-red"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-vn-red" />
            {formatTimer} / 00:{String(maxRecordingSeconds).padStart(2, "0")}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onStartRecording}
          className="inline-flex items-center gap-2 rounded-lg border border-vn-cyan/40 bg-vn-cyan/10 px-4 py-2 text-sm font-semibold text-vn-cyan transition-colors hover:bg-vn-cyan/20"
        >
          <Activity className="h-4 w-4" aria-hidden="true" />
          Record microphone
        </button>
      )}

      {!isRecording && fileName && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-vn-border bg-vn-navy/60 px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 text-vn-green" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm text-vn-text">
            {fileName}
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              label={isPlaying ? "Pause" : "Play"}
              onClick={isPlaying ? onPause : onPlay}
              disabled={false}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4" aria-hidden="true" />
              )}
            </IconButton>
            <IconButton label="Restart playback" onClick={onRestart} disabled={false}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="Remove audio" onClick={onDelete}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </IconButton>
            <button
              type="button"
              aria-label="Remove audio file"
              onClick={onDelete}
              className="rounded-md p-1 text-vn-muted transition-colors hover:bg-white/5 hover:text-vn-red"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-md p-1.5 text-vn-muted transition-colors hover:bg-white/5 hover:text-vn-cyan disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}