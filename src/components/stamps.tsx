import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Stamp({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: "ink" | "closed" | "warn" | "paper";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-display text-micro font-semibold tracking-widest uppercase",
        tone === "ink" && "border-ink bg-ink text-paper",
        tone === "closed" && "border-closed bg-closed text-closed-fg",
        tone === "warn" && "border-warn bg-warn text-warn-fg",
        tone === "paper" && "border-ink bg-transparent text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Spec({ k, v, mono = true }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="font-display text-micro font-semibold tracking-widest text-mute uppercase">
        {k}
      </div>
      <div
        className={cn(
          "mt-0.5 text-ink break-all leading-snug",
          mono ? "font-mono text-sm" : "font-sans text-sm font-medium",
        )}
      >
        {v}
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 text-micro font-medium tabular-nums text-ink">
      <span>5:13</span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="flex gap-px">
          <i className="block h-2 w-1 bg-ink" />
          <i className="block h-2.5 w-1 bg-ink" />
          <i className="block h-3 w-1 bg-ink" />
          <i className="block h-3.5 w-1 bg-ink/40" />
        </span>
        <span className="h-2.5 w-5 rounded-sm border border-ink">
          <span className="ml-px mt-px block h-1.5 w-3.5 bg-ink" />
        </span>
      </span>
    </div>
  );
}

export function HomeMark() {
  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <span className="h-1 w-28 rounded-full bg-ink/25" />
    </div>
  );
}

export function ScreenJob({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-sm leading-snug text-ink-soft">{children}</p>
  );
}
