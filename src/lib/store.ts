import { create } from "zustand";
import {
  CARRIER_MODEL,
  INITIAL_ROOF,
  PROCEDURES,
  type Part,
  type Photo,
  type Procedure,
  type RoofJob,
} from "@/lib/data";

export type LogDraft = {
  model: string;
  manufacturer: string;
  fault: string;
  steps: string;
  parts: Part[];
  photos: Photo[];
  callbackLikely: boolean;
  minutes: string;
  forkOf?: string;
};

type BayState = {
  procedures: Procedure[];
  query: string;
  scanning: boolean;
  roof: RoofJob[];
  notes: Record<string, string>;
  banner: string | null;
  log: LogDraft;
  setQuery: (q: string) => void;
  scanNameplate: () => void;
  useOnJob: (id: string) => void;
  setNote: (id: string, note: string) => void;
  startFork: (id: string) => void;
  setLog: (patch: Partial<LogDraft>) => void;
  addPart: () => void;
  updatePart: (index: number, patch: Partial<Part>) => void;
  snapPhoto: () => void;
  publish: () => Procedure | null;
  clearBanner: () => void;
};

const STOCK_SNAPS: Photo[] = [
  { src: "/photos/nameplate.jpg", label: "Nameplate" },
  { src: "/photos/jumper.jpg", label: "Board / jumper" },
  { src: "/photos/cap.jpg", label: "Failed part" },
  { src: "/photos/gauges.jpg", label: "Readings" },
];

export function seededLog(): LogDraft {
  return {
    model: CARRIER_MODEL,
    manufacturer: "Carrier",
    fault: "41 — OFM fail",
    steps: [
      "Confirm 41 on IGC after three OFM start attempts.",
      "Kill power. Meter OFM run cap — 2.1µF on a 10µF 370V.",
      "Swap cap. Leave P1 jumper as-found.",
      "Restore 24V. OFM starts. Code clears.",
    ].join("\n"),
    parts: [{ pn: "HC98JA010", what: "10µF 370VAC OFM run capacitor" }],
    photos: [
      { src: "/photos/nameplate.jpg", label: "Nameplate" },
      { src: "/photos/jumper.jpg", label: "P1 jumper as-found" },
      { src: "/photos/cap.jpg", label: "Failed OFM cap 2.1µF" },
    ],
    callbackLikely: false,
    minutes: "22",
  };
}

export const useBay = create<BayState>((set, get) => ({
  procedures: PROCEDURES.map((p) => ({ ...p })),
  query: CARRIER_MODEL,
  scanning: false,
  roof: INITIAL_ROOF.map((j) => ({ ...j })),
  notes: {},
  banner: null,
  log: seededLog(),

  setQuery: (query) => set({ query }),

  scanNameplate: () => {
    set({ scanning: true });
    window.setTimeout(() => {
      set({
        scanning: false,
        query: CARRIER_MODEL,
        log: {
          ...get().log,
          model: CARRIER_MODEL,
          manufacturer: "Carrier",
        },
      });
    }, 650);
  },

  useOnJob: (id) => {
    const proc = get().procedures.find((p) => p.id === id);
    if (!proc) return;
    const already = get().roof.some((j) => j.procedureId === id && j.time === "now");
    set({
      procedures: get().procedures.map((p) =>
        p.id === id ? { ...p, reuseCount: p.reuseCount + 1 } : p,
      ),
      roof: already
        ? get().roof
        : [
            {
              id: `job-${Date.now()}`,
              time: "17:13",
              site: "This job",
              unitTag: "RTU",
              procedureId: id,
              stranger: proc.author !== "bay3",
              status: "on_roof",
            },
            ...get().roof,
          ],
      banner: `On this job · ${proc.fileName}`,
    });
  },

  setNote: (id, note) =>
    set({ notes: { ...get().notes, [id]: note } }),

  startFork: (id) => {
    const proc = get().procedures.find((p) => p.id === id);
    if (!proc) return;
    set({
      log: {
        model: proc.model,
        manufacturer: proc.manufacturer,
        fault: proc.fault,
        steps: proc.steps.join("\n"),
        parts: proc.parts.map((x) => ({ ...x })),
        photos: proc.photos.map((x) => ({ ...x })),
        callbackLikely: false,
        minutes: String(proc.outcome.minutes),
        forkOf: proc.id,
      },
      banner: `New version of ${proc.fileName}`,
    });
  },

  setLog: (patch) => set({ log: { ...get().log, ...patch } }),

  addPart: () => {
    const { log } = get();
    if (log.parts.length >= 4) return;
    set({ log: { ...log, parts: [...log.parts, { pn: "", what: "" }] } });
  },

  updatePart: (index, patch) => {
    const { log } = get();
    const parts = log.parts.map((p, i) => (i === index ? { ...p, ...patch } : p));
    set({ log: { ...log, parts } });
  },

  snapPhoto: () => {
    const { log } = get();
    if (log.photos.length >= 4) return;
    const next =
      STOCK_SNAPS.find((s) => !log.photos.some((p) => p.src === s.src)) ??
      STOCK_SNAPS[log.photos.length % STOCK_SNAPS.length];
    set({
      log: { ...log, photos: [...log.photos, next] },
    });
  },

  publish: () => {
    const { log, procedures } = get();
    const steps = log.steps
      .split("\n")
      .map((s) => s.replace(/^\s*\d+[.)]\s*/, "").trim())
      .filter(Boolean);
    if (!log.fault.trim() || steps.length < 3) {
      set({ banner: "Need a fault and 3 steps." });
      return null;
    }
    const parent = log.forkOf
      ? procedures.find((p) => p.id === log.forkOf)
      : procedures.find((p) => p.model === log.model && p.fault === log.fault);
    const version = parent ? parent.version + 1 : 1;
    const id = `pub-${Date.now()}`;
    const fileName = `${log.model.split("-")[0] || log.model.slice(0, 6)}-v${version}`;
    const created: Procedure = {
      id,
      fileName,
      manufacturer: log.manufacturer || "Unknown",
      model: log.model,
      fault: log.fault.trim(),
      conditions: {
        voltage: "as found",
        oat: "as found",
        refrigerant: "as found",
      },
      steps,
      parts: log.parts.filter((p) => p.pn.trim() || p.what.trim()),
      photos: log.photos,
      outcome: {
        callback: log.callbackLikely,
        minutes: Number(log.minutes) || 0,
      },
      author: "bay3",
      date: "2026-08-27",
      version,
      reuseCount: 1,
      oneLineFix: steps[0] ?? log.fault,
    };
    set({
      procedures: [created, ...procedures],
      query: created.model,
      banner: `Published ${created.fileName}`,
      log: { ...log, forkOf: undefined },
      roof: [
        {
          id: `job-${id}`,
          time: "17:13",
          site: "This job",
          unitTag: "RTU",
          procedureId: id,
          stranger: false,
          status: log.callbackLikely ? "on_roof" : "closed",
          minutes: created.outcome.minutes,
        },
        ...get().roof,
      ],
    });
    return created;
  },

  clearBanner: () => set({ banner: null }),
}));
