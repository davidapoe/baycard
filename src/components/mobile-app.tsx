import { Outlet } from "@tanstack/react-router";
import { HomeMark, StatusBar } from "@/components/stamps";
import { TabBar } from "@/components/tab-bar";

export function MobileApp() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <StatusBar />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <TabBar />
      <HomeMark />
    </div>
  );
}
