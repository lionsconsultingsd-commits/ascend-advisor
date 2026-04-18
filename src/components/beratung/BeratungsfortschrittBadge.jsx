import React from "react";
import { cn } from "@/lib/utils";

export default function BeratungsfortschrittBadge({ aktuellePhase, gesamtPhasen, abgeschlosseneFragen, gesamtFragen }) {
  const phasenFortschritt = gesamtPhasen > 0 ? Math.round(((aktuellePhase) / gesamtPhasen) * 100) : 0;
  const fragenFortschritt = gesamtFragen > 0 ? Math.round((abgeschlosseneFragen / gesamtFragen) * 100) : 0;
  const fortschritt = Math.round((phasenFortschritt * 0.5) + (fragenFortschritt * 0.5));

  const color =
    fortschritt >= 80 ? "text-emerald-500" :
    fortschritt >= 40 ? "text-amber-500" :
    "text-muted-foreground";

  const barColor =
    fortschritt >= 80 ? "bg-emerald-500" :
    fortschritt >= 40 ? "bg-amber-500" :
    "bg-primary";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden w-16">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${fortschritt}%` }}
        />
      </div>
      <span className={cn("text-[11px] font-semibold shrink-0", color)}>
        {fortschritt} %
      </span>
    </div>
  );
}