import React from "react";
import { GESPRAECHSTYPEN } from "@/lib/beratungsData";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowRight, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const GRADIENT_CLASSES = {
  "from-blue-500 to-blue-600": "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600": "from-violet-500 to-violet-600",
  "from-indigo-500 to-indigo-600": "from-indigo-500 to-indigo-600",
  "from-emerald-500 to-emerald-600": "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600": "from-amber-500 to-amber-600",
};

export default function GespraechsAuswahl({ onSelect, onStartBeratung, recentBeratungen }) {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">BeratungsAssistent</h1>
          <p className="text-sm text-muted-foreground">Wähle den Gesprächstyp</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => base44.auth.logout()}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            title="Abmelden"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gesprächstyp Cards */}
      <div className="grid grid-cols-1 gap-3 mb-8">
        {GESPRAECHSTYPEN.map((typ) => (
          <button
            key={typ.id}
            onClick={() => onSelect(typ)}
            className={cn(
              "relative w-full p-5 rounded-2xl bg-gradient-to-r text-white text-left shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
              GRADIENT_CLASSES[typ.farbe]
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{typ.emoji}</span>
                <div>
                  <p className="font-bold text-lg">{typ.label}</p>
                  <p className="text-sm text-white/80">{typ.beschreibung}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/70 shrink-0" />
            </div>
          </button>
        ))}
      </div>

      {/* Letzte Beratungen */}
      {recentBeratungen && recentBeratungen.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Letzte Beratungen fortsetzen
          </h3>
          {recentBeratungen.map((b) => {
            const typ = GESPRAECHSTYPEN.find((t) => t.id === b.gespraechstyp) || GESPRAECHSTYPEN[0];
            return (
              <button
                key={b.id}
                onClick={() => onStartBeratung(b.kunde_name, b.id, b.upl_kontakt_id, b.gespraechstyp)}
                className="w-full flex items-center justify-between p-4 bg-card rounded-xl border hover:border-primary/30 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{typ.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{b.kunde_name}</p>
                    <p className="text-xs text-muted-foreground">{typ.label} · {b.status}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}