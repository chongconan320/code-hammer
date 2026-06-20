"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Icon } from "@iconify/react";

/* ── Types ── */

export type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  show: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

/* ── Toast config ── */

const TOAST_ICONS: Record<ToastType, string> = {
  success: "lucide:check-circle",
  error: "lucide:x-circle",
  info: "lucide:info",
};

const TOAST_COLORS: Record<ToastType, string> = {
  success: "border-green-500/30 bg-green-50 text-green-900",
  error: "border-red-500/30 bg-red-50 text-red-900",
  info: "border-primary/30 bg-card text-foreground",
};

const TOAST_DURATION = 4000;
let nextId = 0;

/* ── Provider ── */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);

      const timer = setTimeout(() => {
        remove(id);
      }, TOAST_DURATION);
      timersRef.current.set(id, timer);
    },
    [remove],
  );

  /* cleanup timers on unmount */
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Toast container — fixed top-right */}
      <div
        aria-label="Notifications"
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "24rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            style={{ pointerEvents: "auto" }}
            className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm shadow-panel animate-toast-in ${TOAST_COLORS[toast.type]}`}
          >
            <Icon
              icon={TOAST_ICONS[toast.type]}
              width="18"
              height="18"
              className="mt-px shrink-0"
            />
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => remove(toast.id)}
              className="-mr-0.5 ml-1 shrink-0 rounded p-0.5 opacity-50 transition-opacity hover:opacity-100"
              aria-label="Dismiss"
            >
              <Icon icon="lucide:x" width="14" height="14" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
