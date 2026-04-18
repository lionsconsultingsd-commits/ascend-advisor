import React, { useState } from "react";
import { EINWAENDE as EINWAENDE_DEFAULT } from "@/lib/beratungsData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EinwandPanel({ einwaende: einwaendeProp }) {
  const einwaende = einwaendeProp || EINWAENDE_DEFAULT;
  const [selectedId, setSelectedId] = useState(null);
  const selected = einwaende.find((e) => e.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-muted-foreground mb-3">
              Wähle den Einwand des Kunden – erhalte sofort die passende Antwort.
            </p>
            {einwaende.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <span className="text-2xl">{e.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    „{e.einwand}"
                  </p>
                  <p className="text-xs text-muted-foreground">{e.kategorie}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedId(null)}
              className="mb-3 -ml-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Alle Einwände
            </Button>

            <div className="bg-card rounded-2xl p-5 border shadow-sm mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <p className="font-bold text-foreground">„{selected.einwand}"</p>
                  <p className="text-xs text-muted-foreground">{selected.kategorie}</p>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-1 px-1">
              Sag genau das:
            </h3>
            <p className="text-xs text-muted-foreground mb-3 px-1">Schritt für Schritt – in dieser Reihenfolge sprechen</p>

            <div className="space-y-2">
              {selected.behandlung.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border bg-card"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed italic">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}