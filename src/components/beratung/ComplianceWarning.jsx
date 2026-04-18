import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Compliance-Pflichtfragen pro Gesprächstyp
export const COMPLIANCE_FRAGEN = {
  erstgespraech: [
    { id: "c_eg1", frage: "Datenschutzerklärung vorgelegt und bestätigt?" },
    { id: "c_eg2", frage: "Nachhaltigkeitspräferenzen (ESG) abgefragt?" },
    { id: "c_eg3", frage: "Einwilligung zur Datenverarbeitung eingeholt?" },
  ],
  beratung1: [
    { id: "c_b1_1", frage: "Angemessenheitsprüfung durchgeführt?" },
    { id: "c_b1_2", frage: "Risikoprofil des Kunden aktualisiert?" },
    { id: "c_b1_3", frage: "Nachhaltigkeitspräferenzen (ESG) dokumentiert?" },
    { id: "c_b1_4", frage: "Interessenkonflikte offengelegt? (§ 17 IDD)" },
  ],
  beratung2: [
    { id: "c_b2_1", frage: "Angebotsvergleich dokumentiert?" },
    { id: "c_b2_2", frage: "Kundenwunsch schriftlich festgehalten?" },
    { id: "c_b2_3", frage: "Produktinformationsblatt (PIB) übergeben?" },
  ],
  abschlussgespraech: [
    { id: "c_ag1", frage: "Beratungsprotokoll (§ 61 VVG) erstellt?" },
    { id: "c_ag2", frage: "Widerrufsrecht erläutert (14 Tage)?" },
    { id: "c_ag3", frage: "Unterschrift Kunde + Berater eingeholt?" },
    { id: "c_ag4", frage: "IPID / Produktinformationsblatt übergeben?" },
  ],
  crossselling: [
    { id: "c_cs1", frage: "Cross-Selling-Bedarf dokumentiert?" },
    { id: "c_cs2", frage: "Kundenwunsch für Zusatzprodukt bestätigt?" },
  ],
};

export default function ComplianceWarning({ gespraechstyp, abgeschlosseneFragen, onFrageToggle }) {
  const fragen = COMPLIANCE_FRAGEN[gespraechstyp] || [];
  if (fragen.length === 0) return null;

  const offene = fragen.filter((f) => !abgeschlosseneFragen.includes(f.id));
  const alleDone = offene.length === 0;

  return (
    <div className={cn(
      "mx-4 mb-3 rounded-xl border p-3",
      alleDone
        ? "bg-emerald-500/5 border-emerald-500/30"
        : "bg-amber-500/5 border-amber-500/30"
    )}>
      <div className="flex items-center gap-2 mb-2">
        {alleDone
          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        }
        <p className={cn("text-xs font-semibold", alleDone ? "text-emerald-600" : "text-amber-600")}>
          {alleDone ? "Compliance vollständig ✓" : `${offene.length} Compliance-Pflichtschritt${offene.length > 1 ? "e" : ""} offen`}
        </p>
      </div>
      <div className="space-y-1.5">
        {fragen.map((f) => {
          const done = abgeschlosseneFragen.includes(f.id);
          return (
            <label key={f.id} className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => onFrageToggle(f.id)}
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                  done
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-amber-400 hover:border-amber-500"
                )}
              >
                {done && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <span className={cn("text-xs transition-colors", done ? "line-through text-muted-foreground" : "text-foreground")}>
                {f.frage}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}