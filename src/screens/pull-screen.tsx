import { Link } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import {
  EMPTY_MODEL,
  RECENT_PULL_IDS,
  searchProcedures,
  type Procedure,
} from "@/lib/data";
import { useBay } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScreenJob, Stamp } from "@/components/stamps";
import { cn } from "@/lib/utils";

export function PullScreen({ framed = false }: { framed?: boolean }) {
  const query = useBay((s) => s.query);
  const scanning = useBay((s) => s.scanning);
  const procedures = useBay((s) => s.procedures);
  const setQuery = useBay((s) => s.setQuery);
  const scanNameplate = useBay((s) => s.scanNameplate);
  const setLog = useBay((s) => s.setLog);

  const q = query.trim();
  const matches = q ? searchProcedures(procedures, q) : [];
  const recent = RECENT_PULL_IDS.map((id) =>
    procedures.find((p) => p.id === id),
  ).filter((p): p is Procedure => Boolean(p));

  const showEmpty = q.length > 0 && matches.length === 0;
  const showMatches = matches.length > 0;
  const showRecent = !q;

  function startBlankLog() {
    setLog({
      model: q.toUpperCase(),
      manufacturer: "",
      fault: "",
      steps: "",
      parts: [{ pn: "", what: "" }],
      photos: [],
      callbackLikely: false,
      minutes: "",
      forkOf: undefined,
    });
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <header className="pt-2">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-hero font-bold leading-none tracking-tight text-ink">
            BAYCARD
          </h1>
          <span className="font-display text-stamp tracking-widest text-mute">
            RTU FILES
          </span>
        </div>
        {framed ? null : (
          <div className="mt-2">
            <ScreenJob>
              Search a nameplate. Matching files ranked by reuse, not recency.
            </ScreenJob>
          </div>
        )}
      </header>

      <div className="rounded-lg border-2 border-ink bg-card p-3 shadow-card">
        <label
          htmlFor={framed ? "model-framed" : "model"}
          className="font-display text-stamp font-semibold tracking-widest text-mute"
        >
          SCAN NAMEPLATE OR TYPE MODEL
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            id={framed ? "model-framed" : "model"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="48TCED14A2A5-0A0A0"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="h-14 min-w-0 flex-1 bg-transparent font-mono text-lg text-ink outline-none placeholder:text-mute/70"
          />
          <Button
            size="icon"
            onClick={scanNameplate}
            aria-label="Scan nameplate"
            className="size-14"
          >
            <ScanLine className="size-6" strokeWidth={2} />
          </Button>
        </div>
        {scanning ? (
          <p className="mt-2 font-display text-stamp tracking-widest text-ink">
            Reading nameplate…
          </p>
        ) : null}
      </div>

      {showMatches ? (
        <section className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-sm font-semibold tracking-widest text-mute">
              {matches.length} FILE{matches.length === 1 ? "" : "S"}
            </h2>
            <span className="font-display text-micro tracking-widest text-mute">
              RANKED BY REUSE
            </span>
          </div>
          <p className="font-mono text-xs text-ink-soft break-all">{q}</p>
          <ul className="flex flex-col gap-2">
            {matches.map((p) => (
              <li key={p.id}>
                <ProcedureRow procedure={p} framed={framed} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showEmpty ? (
        <section className="rounded-lg border-2 border-dashed border-ink/40 bg-card px-4 py-8 text-center">
          <p className="font-display text-xl font-semibold tracking-wide text-ink">
            No file for this unit yet. Log the job.
          </p>
          <p className="mt-2 font-mono text-xs text-mute break-all">{q}</p>
          {framed ? (
            <Button className="mt-5" onClick={startBlankLog}>
              Log the job
            </Button>
          ) : (
            <Link
              to="/log"
              onClick={startBlankLog}
              className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-md bg-ink font-display text-lg font-semibold tracking-wide text-paper uppercase"
            >
              Log the job
            </Link>
          )}
          <button
            type="button"
            className="mt-3 font-display text-stamp tracking-widest text-mute underline-offset-4 hover:underline"
            onClick={() => setQuery(EMPTY_MODEL)}
          >
            Try {EMPTY_MODEL}
          </button>
        </section>
      ) : null}

      {showRecent ? (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-sm font-semibold tracking-widest text-mute">
            RECENT PULLS
          </h2>
          <ul className="flex flex-col gap-2">
            {recent.map((p) => (
              <li key={p.id}>
                <ProcedureRow procedure={p} framed={framed} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ProcedureRow({
  procedure,
  framed,
}: {
  procedure: Procedure;
  framed: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-xl font-semibold leading-none tracking-wide text-ink">
          {procedure.fault}
        </p>
        <span className="shrink-0 font-display text-stamp tracking-widest text-mute">
          v{procedure.version}
        </span>
      </div>
      <p className="mt-2 text-body leading-snug text-ink-soft">
        {procedure.oneLineFix}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Stamp>Pulled {procedure.reuseCount}</Stamp>
        {procedure.outcome.callback ? (
          <Stamp tone="warn">Callback</Stamp>
        ) : (
          <Stamp tone="closed">No callback</Stamp>
        )}
      </div>
      <div className="mt-2 font-mono text-xs text-mute">
        {procedure.author} · {procedure.outcome.minutes} min
      </div>
    </>
  );

  const className = cn(
    "block w-full rounded-md border border-rule bg-card p-4 text-left shadow-card",
  );

  if (framed) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <Link to="/file/$id" params={{ id: procedure.id }} className={className}>
      {inner}
    </Link>
  );
}
