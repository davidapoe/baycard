import { PhoneFrame } from "@/components/phone-frame";
import { FileScreen } from "@/screens/file-screen";
import { LogScreen } from "@/screens/log-screen";
import { PullScreen } from "@/screens/pull-screen";
import { ShopScreen } from "@/screens/shop-screen";

export function Board() {
  return (
    <div className="min-h-dvh bg-floor px-5 py-6 text-floor-fg">
      <header className="mx-auto mb-6 flex max-w-7xl items-end justify-between gap-4">
        <div>
          <p className="font-display text-stamp tracking-widest text-floor-fg/50">
            PACKAGED RTU
          </p>
          <h1 className="font-display text-4xl font-bold leading-none tracking-tight text-floor-fg">
            BAYCARD
          </h1>
        </div>
        <p className="hidden max-w-sm text-right text-sm leading-snug text-floor-fg/55 sm:block">
          Four screens. Search a nameplate, run a closed file, log a new version.
        </p>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-5">
        <PhoneFrame
          label="1 · PULL"
          caption="Search a nameplate. Matching files ranked by reuse, not recency."
        >
          <PullScreen framed />
        </PhoneFrame>
        <PhoneFrame
          label="2 · FILE"
          caption="A work card you run on the roof. Use it, or cut a new version."
        >
          <FileScreen id="48tc-41-ofmcap" framed />
        </PhoneFrame>
        <PhoneFrame
          label="3 · LOG"
          caption="End of job, about 60 seconds. This is the write path."
        >
          <LogScreen framed />
        </PhoneFrame>
        <PhoneFrame
          label="4 · SHOP"
          caption="Today’s units and the files you pulled, including a stranger’s."
        >
          <ShopScreen framed />
        </PhoneFrame>
      </div>
    </div>
  );
}
