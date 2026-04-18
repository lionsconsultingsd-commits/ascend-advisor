import React from "react";
import { PHASEN, PFLICHTFRAGEN } from "@/lib/beratungsData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhaseCard({
  aktuellePhase,
  abgeschlosseneFragen,
  onFrageToggle,
  onWeiter,
  onZurueck,
  phasen: phasenProp,
  pflichtfragen: pflichtfragenProp,
}) {
  const phasen = phasenProp || PHASEN;
  const pflichtfragen = pflichtfragenProp || PFLICHTFRAGEN;
  const phase = phasen[aktuellePhase];
  const fragen = pflichtfragen.filter((f) => f.phase === aktuellePhase);
  const isFirst = aktuellePhase === 0;
  const isLast = aktuellePhase === phasen.length - 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={aktuellePhase}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-y-auto px-4 pb-4"
      >
        {/* Phase header */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Phase {aktuellePhase + 1}/{phasen.length}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{phase.titel}</h2>
          <p className="text-sm text-muted-foreground">{phase.beschreibung}</p>
        </div>

        {/* Tipps */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Tipps</span>
          </div>
          <ul className="space-y-1.5">
            {phase.tipps.map((tipp, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {tipp}
              </li>
            ))}
          </ul>
        </div>

        {/* Pflichtfragen */}
        {fragen.length > 0 && (
          <div className="bg-card rounded-2xl p-4 shadow-sm border mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Pflichtfragen
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                {fragen.filter((f) => abgeschlosseneFragen.includes(f.id)).length}/{fragen.length}
              </span>
            </h3>
            <div className="space-y-3">
              {fragen.map((f) => {
                const checked = abgeschlosseneFragen.includes(f.id);
                return (
                  <label
                    key={f.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all",
                      checked ? "bg-accent/10" : "bg-secondary/50 hover:bg-secondary"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onFrageToggle(f.id)}
                      className="mt-0.5"
                    />
                    <span
                      className={cn(
                        "text-sm transition-all",
                        checked && "line-through text-muted-foreground"
                      )}
                    >
                      {f.frage}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-auto">
          <Button
            variant="outline"
            onClick={onZurueck}
            disabled={isFirst}
            className="flex-1 h-12 rounded-xl text-base"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Zurück
          </Button>
          <Button
            onClick={onWeiter}
            disabled={isLast}
            className="flex-1 h-12 rounded-xl text-base"
          >
            Weiter
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}