export type Part = {
  pn: string;
  what: string;
};

export type Photo = {
  src: string;
  label: string;
};

export type Conditions = {
  voltage: string;
  oat: string;
  refrigerant: string;
  readings?: string;
};

export type Procedure = {
  id: string;
  fileName: string;
  manufacturer: string;
  model: string;
  fault: string;
  conditions: Conditions;
  steps: string[];
  parts: Part[];
  photos: Photo[];
  outcome: { callback: boolean; minutes: number };
  author: string;
  date: string;
  version: number;
  reuseCount: number;
  oneLineFix: string;
};

export type RoofJob = {
  id: string;
  time: string;
  site: string;
  unitTag: string;
  procedureId: string;
  stranger: boolean;
  status: "closed" | "on_roof";
  minutes?: number;
};

export const SHOP_HANDLE = "bay3";

export const PROCEDURES: Procedure[] = [
  {
    id: "48tc-41-ofmcap",
    fileName: "48TC-41-ofmcap",
    manufacturer: "Carrier",
    model: "48TCED14A2A5-0A0A0",
    fault: "41 — OFM fail",
    conditions: {
      voltage: "460V 3Ø",
      oat: "94°F",
      refrigerant: "R-410A",
      readings: "SH 12°F / SC 9°F",
    },
    steps: [
      "Confirm 41 on IGC after three OFM start attempts.",
      "Kill power. Meter OFM run cap — 2.1µF on a 10µF 370V.",
      "Swap cap. Leave P1 jumper as-found.",
      "Restore 24V. OFM starts. Code clears.",
      "Recheck SH/SC. Ride two minutes.",
    ],
    parts: [{ pn: "HC98JA010", what: "10µF 370VAC OFM run capacitor" }],
    photos: [
      { src: "/photos/nameplate.jpg", label: "Nameplate" },
      { src: "/photos/jumper.jpg", label: "P1 jumper as-found" },
      { src: "/photos/cap.jpg", label: "Failed OFM cap 2.1µF" },
    ],
    outcome: { callback: false, minutes: 22 },
    author: "apex_rtu",
    date: "2026-07-14",
    version: 3,
    reuseCount: 31,
    oneLineFix: "Replace OFM run cap. Jumper stays.",
  },
  {
    id: "48tc-hp-coil",
    fileName: "48TC-HP-coil",
    manufacturer: "Carrier",
    model: "48TCED14A2A5-0A0A0",
    fault: "HP lockout — no cool",
    conditions: {
      voltage: "460V 3Ø",
      oat: "101°F",
      refrigerant: "R-410A",
      readings: "SC 22°F / disc. 285 psig",
    },
    steps: [
      "HP trip at four minutes. Leaving air only 8°F over OAT.",
      "Coil packed with cottonwood. OFM is running.",
      "Coil-gun both faces. Comb four crushed fins at discharge.",
      "Reset HP. Head 340/118. SC 11°F.",
    ],
    parts: [],
    photos: [
      { src: "/photos/coil.jpg", label: "Cottonwood-packed coil" },
      { src: "/photos/nameplate.jpg", label: "Nameplate" },
      { src: "/photos/gauges.jpg", label: "Head after wash" },
    ],
    outcome: { callback: false, minutes: 38 },
    author: "bay6",
    date: "2026-06-02",
    version: 1,
    reuseCount: 14,
    oneLineFix: "Wash condenser. Reset HP. No parts.",
  },
  {
    id: "48tc-heat-3flash",
    fileName: "48TC-heat-3flash",
    manufacturer: "Carrier",
    model: "48TCED14A2A5-0A0A0",
    fault: "No heat — IGC 3-flash",
    conditions: {
      voltage: "460V 3Ø",
      oat: "41°F",
      refrigerant: "R-410A",
      readings: "24V at W1, 0V at GV",
    },
    steps: [
      "IGC 3-flash: pressure switch open with inducer on.",
      "Vinyl tube full of condensate. Blow it out.",
      "Switch still open dry. Replace HK06NB121.",
      "Heat fires. Limit and rollout stay closed.",
    ],
    parts: [{ pn: "HK06NB121", what: "Inducer pressure switch 0.55\" wc" }],
    photos: [
      { src: "/photos/psw.jpg", label: "PSW tube full of condensate" },
      { src: "/photos/nameplate.jpg", label: "Nameplate" },
    ],
    outcome: { callback: false, minutes: 41 },
    author: "anon-4f",
    date: "2026-05-19",
    version: 2,
    reuseCount: 8,
    oneLineFix: "Replace inducer pressure switch.",
  },
  {
    id: "lgh-nocool-txv",
    fileName: "LGH-nocool-txv",
    manufacturer: "Lennox",
    model: "LGH120H4BS1Y",
    fault: "No cool — outdoor fan running",
    conditions: {
      voltage: "208V 3Ø",
      oat: "91°F",
      refrigerant: "R-410A",
      readings: "SH 32°F / SC 4°F, ESP 1.1\" wc",
    },
    steps: [
      "Compressor and OFM running. 18°F split. Supply 62°F.",
      "SH 32°F, SC 4°F. Sight glass full — not a charge issue.",
      "TXV bulb off the suction line. Ice at distributor.",
      "Replace TXV 12J24. Bulb at 10 o'clock, insulated.",
      "SH 11°F, SC 9°F. Split 22°F.",
    ],
    parts: [{ pn: "12J24", what: "TXV kit, 10-ton R-410A" }],
    photos: [
      { src: "/photos/txv.jpg", label: "TXV / distributor iced" },
      { src: "/photos/gauges.jpg", label: "SH 32°F before swap" },
      { src: "/photos/nameplate.jpg", label: "Nameplate" },
    ],
    outcome: { callback: false, minutes: 54 },
    author: "delta_svc",
    date: "2026-08-03",
    version: 2,
    reuseCount: 14,
    oneLineFix: "Replace TXV. SH 32 → 11.",
  },
  {
    id: "ysc-igc-dip",
    fileName: "YSC-igc-dip",
    manufacturer: "Trane",
    model: "YSC120A4RHA0",
    fault: "No heat — IGC dead",
    conditions: {
      voltage: "230V 1Ø",
      oat: "38°F",
      refrigerant: "R-22",
      readings: "24V at R, board LED dark",
    },
    steps: [
      "IGC dark. F1 open. GV coil shorted to ground.",
      "Install CNT07727. DIP: SW1-1 ON, SW1-2 OFF, SW1-3 ON, SW1-4 OFF.",
      "Replace GV 024-35498-000. Fit 3A fuse.",
      "Call W1. Inducer, ignitor, GV, flame sense.",
      "W2 brings second stage. No rollout.",
    ],
    parts: [
      { pn: "CNT07727", what: "Ignition control board" },
      { pn: "024-35498-000", what: "Gas valve, 24V 2-stage" },
      { pn: "FUS00247", what: "3A automotive fuse" },
    ],
    photos: [
      { src: "/photos/dip.jpg", label: "New board DIP as set" },
      { src: "/photos/nameplate.jpg", label: "Nameplate" },
      { src: "/photos/jumper.jpg", label: "Failed board, F1 open" },
    ],
    outcome: { callback: false, minutes: 47 },
    author: "roof_mike",
    date: "2026-04-22",
    version: 1,
    reuseCount: 19,
    oneLineFix: "Board + GV. DIP SW1-1 ON, SW1-3 ON.",
  },
];

export const RECENT_PULL_IDS = [
  "48tc-41-ofmcap",
  "ysc-igc-dip",
  "lgh-nocool-txv",
];

export const INITIAL_ROOF: RoofJob[] = [
  {
    id: "job-1",
    time: "07:40",
    site: "Food Lion — RTU-4",
    unitTag: "RTU-4",
    procedureId: "48tc-41-ofmcap",
    stranger: false,
    status: "closed",
    minutes: 22,
  },
  {
    id: "job-2",
    time: "09:15",
    site: "Strip ctr — RTU-2",
    unitTag: "RTU-2",
    procedureId: "ysc-igc-dip",
    stranger: true,
    status: "closed",
    minutes: 47,
  },
  {
    id: "job-3",
    time: "11:02",
    site: "Whse west — LGH",
    unitTag: "LGH-W",
    procedureId: "lgh-nocool-txv",
    stranger: false,
    status: "on_roof",
  },
];

export const CARRIER_MODEL = "48TCED14A2A5-0A0A0";
export const EMPTY_MODEL = "ZF180N24A2AAA1A";

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

export function searchProcedures(
  list: Procedure[],
  query: string,
): Procedure[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/[\s,;/]+/).filter(Boolean);
  const matched = list.filter((p) => {
    const hay = [
      p.manufacturer,
      p.model,
      p.fault,
      p.fileName,
      p.oneLineFix,
      p.author,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((t) => hay.includes(t) || p.model.toLowerCase().includes(t));
  });
  return matched.sort((a, b) => b.reuseCount - a.reuseCount);
}

export function modelLockLabel(model: string): string {
  const p = PROCEDURES.find((x) => x.model === model);
  return p ? `${p.manufacturer} ${model}` : model;
}
