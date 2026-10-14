"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "./icons";

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
} as const;

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: keyof typeof sizes;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`animate-fade-up flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-black/5 bg-white shadow-soft sm:max-h-[calc(100vh-2rem)] sm:rounded-3xl ${sizes[size]}`}
      >
        <span
          aria-hidden
          className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-black/10 sm:hidden"
        />
        <div className="flex items-start justify-between gap-4 border-b border-black/5 px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-full text-ink/50 transition hover:bg-canvas hover:text-ink"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-5 sm:pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
