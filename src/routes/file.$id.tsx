import { createFileRoute } from "@tanstack/react-router";
import { FileScreen } from "@/screens/file-screen";

export const Route = createFileRoute("/file/$id")({ component: FilePage });

function FilePage() {
  const { id } = Route.useParams();
  return <FileScreen id={id} />;
}
