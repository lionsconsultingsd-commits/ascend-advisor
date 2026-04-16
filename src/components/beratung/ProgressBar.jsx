import React from "react";
import { PHASEN } from "@/lib/beratungsData";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function ProgressBar({ aktuellePhase, onPhaseClick }) {
  const progress = ((aktuellePhase + 1) / PHASEN.length) * 100;

  return (
    <div className="px-4 py-3">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Phase dots */}
      <div className="flex justify-between items-center">
        {PHASEN.map((phase) => {
          const isDone = phase.id < aktuellePhase;
          const isCurrent = phase.id === aktuellePhase;

          return (
            <button
              key={phase.id}
              onClick={() => onPhaseClick(phase.id)}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                  isDone && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110",
                  !isDone && !isCurrent && "bg-secondary text-muted-foreground"
                )}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : phase.id + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors hidden sm:block",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {phase.kurz}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}