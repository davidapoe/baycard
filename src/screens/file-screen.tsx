import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { formatDate, type Procedure } from "@/lib/data";
import { useBay } from "@/lib/store";
import { PhotoStrip } from "@/components/photo-strip";
import { Button } from "@/components/ui/button";
import { ScreenJob, Spec, Stamp } from "@/components/stamps";

export function FileScreen({
  id,
  framed = false,
}: {
  id: string;
  framed?: boolean;
}) {
  const navigate = useNavigate();
  const procedure = useBay((s) => s.procedures.find((p) => p.id === id));
  const note = useBay((s) => s.notes[id] ?? "");
  const setNote = useBay((s) => s.setNote);
  const useOnJob = useBay((s) => s.useOnJob);
  const startFork = useBay((s) => s.startFork);
  const banner = useBay((s) => s.banner);

  if (!procedure) {
    return (
      <div className="px-4 py-10">
        <p className="font-display text-xl text-ink">No file.</p>
        {!framed ? (
          <Link to="/" className="mt-4 inline-block font-display tracking-wide underline">
            Back to pull
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 bg-ink px-4 py-2.5 text-paper">
        <div className="flex items-center gap-2">
          {framed ? null : (
            <Link
              to="/"
              aria-label="Back to pull"
              className="flex size-11 shrink-0 items-center justify-center rounded-sm text-paper"
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-stamp font-semibold tracking-widest">
                {procedure.fileName}
              </span>
              <span className="shrink-0 font-display text-stamp tracking-widest text-paper/70">
                v{procedure.version} · PULLED {procedure.reuseCount}
              </span>
            </div>
            <p className="font-mono text-xs leading-tight text-paper/80 break-all">
              {procedure.manufacturer} {procedure.model}
            </p>
            <p className="mt-0.5 font-display text-xl font-semibold leading-none tracking-wide">
              {procedure.fault}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-4 pt-3 pb-4">
        {framed ? null : (
          <ScreenJob>
            A work card you run on the roof. Use it, or cut a new version.
          </ScreenJob>
        )}

        {banner ? (
          <p className="border border-ink bg-card px-3 py-2 font-display text-stamp tracking-widest text-ink">
            {banner}
          </p>
        ) : null}

        <SpecBlock procedure={procedure} />

        <section>
          <h2 className="font-display text-sm font-semibold tracking-widest text-mute">
            STEPS
          </h2>
          <ol className="mt-2 flex flex-col gap-2.5">
            {procedure.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 shrink-0 font-display text-xl font-bold leading-6 text-ink tabular-nums">
                  {i + 1}
                </span>
                <p className="text-step leading-snug text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-display text-sm font-semibold tracking-widest text-mute">
            PARTS USED
          </h2>
          {procedure.parts.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">None. Labor only.</p>
          ) : (
            <ul className="mt-2 divide-y divide-rule border border-rule bg-card">
              {procedure.parts.map((part) => (
                <li
                  key={part.pn}
                  className="flex items-baseline justify-between gap-3 px-3 py-2"
                >
                  <span className="font-mono text-sm text-ink">{part.pn}</span>
                  <span className="text-right text-sm text-ink-soft">{part.what}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-display text-sm font-semibold tracking-widest text-mute">
            PHOTOS
          </h2>
          <PhotoStrip photos={procedure.photos} />
        </section>

        <section className="rounded-md border border-ink bg-card p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {procedure.outcome.callback ? (
              <Stamp tone="warn">Callback likely</Stamp>
            ) : (
              <Stamp tone="closed">No callback</Stamp>
            )}
            <Stamp tone="paper">{procedure.outcome.minutes} min on roof</Stamp>
            <Stamp>Pulled {procedure.reuseCount} times</Stamp>
          </div>
          <p className="mt-3 font-mono text-xs text-ink-soft">
            {procedure.author} · {formatDate(procedure.date)} · v{procedure.version}
          </p>
        </section>

        <section>
          <label
            htmlFor={framed ? `note-${id}-f` : `note-${id}`}
            className="font-display text-sm font-semibold tracking-widest text-mute"
          >
            NOTE FROM ROOF
          </label>
          <input
            id={framed ? `note-${id}-f` : `note-${id}`}
            value={note}
            onChange={(e) => setNote(id, e.target.value)}
            placeholder="Optional. Stays on this pull."
            className="mt-1 h-12 w-full rounded-md border border-rule bg-card px-3 text-sm text-ink outline-none placeholder:text-mute"
          />
        </section>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-col gap-2 border-t border-ink bg-paper px-4 py-3">
        <Button onClick={() => useOnJob(id)}>Use on this job</Button>
        <Button
          variant="secondary"
          onClick={() => {
            startFork(id);
            if (!framed) void navigate({ to: "/log" });
          }}
        >
          This was wrong → new version
        </Button>
      </div>
    </div>
  );
}

function SpecBlock({ procedure }: { procedure: Procedure }) {
  const c = procedure.conditions;
  return (
    <section className="rounded-md border border-rule bg-card px-3 py-2">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <Spec k="Manufacturer" v={procedure.manufacturer} />
        <Spec k="Model" v={procedure.model} />
        <Spec k="Fault" v={procedure.fault} mono={false} />
        <Spec k="Voltage" v={c.voltage} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-rule pt-2 font-mono text-xs text-ink">
        <span>OAT {c.oat}</span>
        <span>{c.refrigerant}</span>
        {c.readings ? <span>{c.readings}</span> : null}
      </div>
    </section>
  );
}
