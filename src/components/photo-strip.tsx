import { useState } from "react";
import type { Photo } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PhotoStrip({
  photos,
  onAdd,
}: {
  photos: Photo[];
  onAdd?: () => void;
}) {
  const [open, setOpen] = useState<Photo | null>(null);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((p) => (
          <button
            key={`${p.src}-${p.label}`}
            type="button"
            onClick={() => setOpen(p)}
            className="w-28 shrink-0 text-left"
          >
            <img
              src={p.src}
              alt={p.label}
              className="h-20 w-28 rounded-sm object-cover outline outline-1 -outline-offset-1 outline-ink/20"
            />
            <div className="mt-1 font-display text-micro uppercase tracking-wider text-mute leading-tight">
              {p.label}
            </div>
          </button>
        ))}
        {onAdd && photos.length < 4
          ? Array.from({ length: 4 - photos.length }).map((_, i) => (
              <button
                key={`add-${i}`}
                type="button"
                onClick={onAdd}
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-sm border border-dashed border-ink/40 bg-photo font-display text-micro uppercase tracking-widest text-ink-soft"
              >
                Snap
              </button>
            ))
          : null}
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6"
          onClick={() => setOpen(null)}
        >
          <figure className="w-full max-w-lg">
            <img
              src={open.src}
              alt={open.label}
              className={cn(
                "w-full rounded-md object-cover outline outline-1 -outline-offset-1 outline-paper/20",
              )}
            />
            <figcaption className="mt-2 text-left font-display text-sm uppercase tracking-widest text-paper">
              {open.label}
            </figcaption>
          </figure>
        </button>
      ) : null}
    </>
  );
}
