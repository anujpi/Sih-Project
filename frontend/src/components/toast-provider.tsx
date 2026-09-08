"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, TriangleAlert } from "lucide-react";
import { ToastKind, ToastMessage } from "@/lib/types";

const KIND_STYLES: Record<
  ToastKind,
  { icon: typeof Info; iconClass: string; ring: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-vn-green",
    ring: "border-vn-green/30",
  },
  error: {
    icon: XCircle,
    iconClass: "text-vn-red",
    ring: "border-vn-red/40",
  },
  info: {
    icon: Info,
    iconClass: "text-vn-cyan",
    ring: "border-vn-cyan/30",
  },
  warning: {
    icon: TriangleAlert,
    iconClass: "text-vn-amber",
    ring: "border-vn-amber/40",
  },
};

interface ToastContextValue {
  push: (kind: ToastKind, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now());
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, title: string, message?: string) => {
      const id = makeId();
      setToasts((prev) => [...prev.slice(-3), { id, kind, title, message }]);
      timersRef.current.push(setTimeout(() => dismiss(id), 5000));
    },
    [dismiss]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
      >
        {toasts.map((toast) => {
          const style = KIND_STYLES[toast.kind];
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${style.ring} bg-vn-elevated/95 px-4 py-3 shadow-2xl backdrop-blur vn-anim-rise`}
            >
              <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClass}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-vn-text">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="mt-0.5 text-xs leading-relaxed text-vn-muted">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded-md p-1 text-vn-muted transition-colors hover:bg-white/5 hover:text-vn-text"
              >
                <XCircle className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}