import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, FilePlus, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Pull", match: (p: string) => p === "/" || p.startsWith("/file"), icon: ScanLine },
  { to: "/log", label: "Log", match: (p: string) => p.startsWith("/log"), icon: FilePlus },
  { to: "/shop", label: "Shop", match: (p: string) => p.startsWith("/shop"), icon: ClipboardList },
] as const;

export function TabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="border-t border-ink bg-paper pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
      <ul className="grid grid-cols-3">
        {TABS.map((tab) => {
          const active = tab.match(path);
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 font-display text-stamp tracking-widest uppercase",
                  active ? "text-ink" : "text-mute",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
