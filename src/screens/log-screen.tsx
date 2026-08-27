import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useBay } from "@/lib/store";
import { PhotoStrip } from "@/components/photo-strip";
import { Button } from "@/components/ui/button";
import { ScreenJob } from "@/components/stamps";
import { cn } from "@/lib/utils";

export function LogScreen({ framed = false }: { framed?: boolean }) {
  const navigate = useNavigate();
  const log = useBay((s) => s.log);
  const setLog = useBay((s) => s.setLog);
  const addPart = useBay((s) => s.addPart);
  const updatePart = useBay((s) => s.updatePart);
  const snapPhoto = useBay((s) => s.snapPhoto);
  const publish = useBay((s) => s.publish);
  const banner = useBay((s) => s.banner);

  return (
    <div className="flex flex-col gap-3 px-4 pb-6">
      <header className="pt-2">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-hero font-bold leading-none tracking-tight text-ink">
            LOG FILE
          </h1>
          {log.forkOf ? (
            <span className="font-display text-stamp tracking-widest text-mute">
              NEW VER
            </span>
          ) : (
            <span className="font-display text-stamp tracking-widest text-mute">
              WRITE
            </span>
          )}
        </div>
        {framed ? null : (
          <div className="mt-2">
            <ScreenJob>
              End of job, about 60 seconds. This is the write path that makes the hub exist.
            </ScreenJob>
          </div>
        )}
      </header>

      {banner ? (
        <p className="border border-ink bg-card px-3 py-2 font-display text-stamp tracking-widest text-ink">
          {banner}
        </p>
      ) : null}

      <Field label="Model (from scan)">
        <p className="font-mono text-base leading-none text-ink break-all">
          {log.manufacturer ? `${log.manufacturer} · ` : ""}
          {log.model}
        </p>
      </Field>

      <Field label="Fault">
        <input
          value={log.fault}
          onChange={(e) => setLog({ fault: e.target.value })}
          placeholder="41 — OFM fail"
          className="h-10 w-full bg-transparent font-sans text-base text-ink outline-none placeholder:text-mute"
        />
      </Field>

      <Field label="Steps — 3 to 8 lines, verbs">
        <textarea
          value={log.steps}
          onChange={(e) => setLog({ steps: e.target.value })}
          rows={4}
          placeholder={"1. Confirm code.\n2. Meter the part.\n3. Swap. Recheck."}
          className="w-full resize-none bg-transparent font-sans text-sm leading-snug text-ink outline-none placeholder:text-mute"
        />
      </Field>

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-display text-micro font-semibold tracking-widest text-mute">
            PARTS
          </span>
          <button
            type="button"
            onClick={addPart}
            className="h-8 font-display text-micro tracking-widest text-ink"
          >
            + Part
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {log.parts.map((part, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={part.pn}
                onChange={(e) => updatePart(i, { pn: e.target.value })}
                placeholder="PN"
                className="h-11 w-2/5 rounded-sm border border-rule bg-card px-2 font-mono text-sm text-ink outline-none placeholder:text-mute"
              />
              <input
                value={part.what}
                onChange={(e) => updatePart(i, { what: e.target.value })}
                placeholder="What it was"
                className="h-11 min-w-0 flex-1 rounded-sm border border-rule bg-card px-2 text-sm text-ink outline-none placeholder:text-mute"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block font-display text-micro font-semibold tracking-widest text-mute">
          PHOTOS
        </span>
        <PhotoStrip photos={log.photos} onAdd={snapPhoto} />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLog({ callbackLikely: false })}
          className={cn(
            "h-12 flex-1 rounded-sm border font-display text-stamp tracking-widest uppercase",
            !log.callbackLikely
              ? "border-closed bg-closed text-closed-fg"
              : "border-rule bg-card text-ink-soft",
          )}
        >
          Closed
        </button>
        <button
          type="button"
          onClick={() => setLog({ callbackLikely: true })}
          className={cn(
            "h-12 flex-1 rounded-sm border font-display text-stamp tracking-widest uppercase",
            log.callbackLikely
              ? "border-warn bg-warn text-warn-fg"
              : "border-rule bg-card text-ink-soft",
          )}
        >
          Callback likely
        </button>
        <label className="flex h-12 w-20 flex-col justify-center rounded-sm border border-rule bg-card px-2">
          <span className="font-display text-micro tracking-widest text-mute">MIN</span>
          <input
            value={log.minutes}
            onChange={(e) => setLog({ minutes: e.target.value.replace(/[^\d]/g, "") })}
            inputMode="numeric"
            className="w-full bg-transparent font-mono text-sm text-ink outline-none"
          />
        </label>
      </div>

      <Button
        onClick={() => {
          const created = publish();
          if (created && !framed) {
            void navigate({ to: "/file/$id", params: { id: created.id } });
          }
        }}
      >
        Publish file
      </Button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block rounded-md border border-rule bg-card px-3 py-2">
      <span className="font-display text-micro font-semibold tracking-widest text-mute">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
