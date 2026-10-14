import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-black/5 bg-white p-4 shadow-soft sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  icon,
  children,
  action,
}: {
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/80">
        {icon && (
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-canvas text-ink/70">
            {icon}
          </span>
        )}
        {children}
      </h2>
      {action}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-black/5 bg-canvas px-3 py-1 text-xs font-medium text-ink/75">
      {children}
    </span>
  );
}

export function Badge({
  children,
  tone = "butter",
}: {
  children: ReactNode;
  tone?: "butter" | "sage" | "peri" | "ink";
}) {
  const tones: Record<string, string> = {
    butter: "bg-butter-200 text-ink",
    sage: "bg-sage-200 text-ink",
    peri: "bg-peri-200 text-ink",
    ink: "bg-ink text-white",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
