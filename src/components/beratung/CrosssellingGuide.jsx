import React, { useState } from "react";
import { CROSSSELLING_PRODUKTE } from "@/lib/beratungsData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CrosssellingGuide() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = CROSSSELLING_PRODUKTE.find((p) => p.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Wähle ein Zusatzprodukt – erhalte den passenden Einstieg und Argumentationsrahmen.
            </p>
            {CROSSSELLING_PRODUKTE.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{p.produkt}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.trigger}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Alle Produkte
            </button>

            <div className="bg-card rounded-2xl p-5 border mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <p className="font-bold">{selected.produkt}</p>
                  <p className="text-xs text-muted-foreground">Wann: {selected.trigger}</p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3 mt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Nutzen für den Kunden</p>
                <p className="text-sm">{selected.nutzen}</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gesprächseinstieg – wortgenau</p>
              <p className="text-sm leading-relaxed italic text-foreground">„{selected.einstieg}"</p>
            </div>

            <div className="bg-card rounded-2xl p-5 border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tipps</p>
              <ul className="space-y-1.5">
                {selected.tipps.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}