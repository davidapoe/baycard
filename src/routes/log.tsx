import { createFileRoute } from "@tanstack/react-router";
import { LogScreen } from "@/screens/log-screen";

export const Route = createFileRoute("/log")({ component: LogPage });

function LogPage() {
  return <LogScreen />;
}
