import { createFileRoute } from "@tanstack/react-router";
import { PullScreen } from "@/screens/pull-screen";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PullScreen />;
}
