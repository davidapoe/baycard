import { Link } from "@tanstack/react-router";
import { SHOP_HANDLE, formatDate } from "@/lib/data";
import { useBay } from "@/lib/store";
import { ScreenJob, Stamp } from "@/components/stamps";

export function ShopScreen({ framed = false }: { framed?: boolean }) {
  const roof = useBay((s) => s.roof);
  const procedures = useBay((s) => s.procedures);
  const pulled = roof.length;
  const closed = roof.filter((j) => j.status === "closed").length;

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <header className="pt-2">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-hero font-bold leading-none tracking-tight text-ink">
            YOUR ROOF
          </h1>
          <span className="font-display text-stamp tracking-widest text-mute">
            {SHOP_HANDLE}
          </span>
        </div>
        {framed ? null : (
          <div className="mt-2">
            <ScreenJob>
              Today’s units and the files you pulled — including a stranger’s file on a different site.
            </ScreenJob>
          </div>
        )}
        <p className="mt-3 font-display text-stamp tracking-widest text-ink-soft">
          27 AUG · {pulled} UNITS · {pulled} FILES PULLED · {closed} CLOSED
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {roof.map((job) => {
          const file = procedures.find((p) => p.id === job.procedureId);
          if (!file) return null;
          const body = (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-lg font-semibold tracking-wide text-ink">
                  {job.time}
                  <span className="ml-2 font-sans text-sm font-medium tracking-normal">
                    {job.site}
                  </span>
                </span>
                <span className="shrink-0 font-display text-stamp tracking-widest text-mute">
                  {job.unitTag}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-ink-soft break-all">
                {file.manufacturer} {file.model}
              </p>
              <p className="mt-1.5 font-display text-base font-semibold leading-none tracking-wide text-ink">
                {file.fault}
                <span className="ml-2 font-sans text-sm font-normal tracking-normal text-ink-soft">
                  {file.oneLineFix}
                </span>
              </p>
              <p className="mt-1 font-mono text-xs text-mute">
                {file.fileName} · {file.author} v{file.version} · {formatDate(file.date)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {job.stranger ? (
                  <Stamp tone="ink">Stranger file · different site</Stamp>
                ) : (
                  <Stamp tone="paper">This shop has pulled it</Stamp>
                )}
                {job.status === "closed" ? (
                  <Stamp tone="closed">
                    Closed{job.minutes ? ` · ${job.minutes} min` : ""}
                  </Stamp>
                ) : (
                  <Stamp tone="warn">On roof</Stamp>
                )}
                <Stamp tone="paper">Pulled {file.reuseCount}</Stamp>
              </div>
            </>
          );

          if (framed) {
            return (
              <li
                key={job.id}
                className="rounded-md border border-rule bg-card p-3 shadow-card"
              >
                {body}
              </li>
            );
          }

          return (
            <li key={job.id}>
              <Link
                to="/file/$id"
                params={{ id: file.id }}
                className="block rounded-md border border-rule bg-card p-3 shadow-card"
              >
                {body}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
