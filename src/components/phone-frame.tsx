import type { ReactNode } from "react";
import { HomeMark, StatusBar } from "@/components/stamps";

export function PhoneFrame({
  label,
  caption,
  children,
}: {
  label: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex flex-col items-center gap-3">
      <div className="phone-slot">
        <div className="phone-zoom">
          <div className="overflow-hidden rounded-xl border border-rule/40 bg-ink p-2 shadow-phone">
            <div className="overflow-hidden rounded-lg bg-paper">
              <StatusBar />
              <div className="h-phone overflow-y-auto overscroll-contain">
                {children}
              </div>
              <HomeMark />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="w-full px-1">
        <div className="font-display text-sm font-semibold tracking-widest text-floor-fg">
          {label}
        </div>
        <p className="mt-1 text-sm leading-snug text-floor-fg/70">{caption}</p>
      </figcaption>
    </figure>
  );
}
