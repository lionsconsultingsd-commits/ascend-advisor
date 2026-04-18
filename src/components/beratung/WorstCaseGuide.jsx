import React, { useState } from "react";
import { ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SZENARIEN = [
  {
    id: "bu",
    emoji: "💼",
    titel: "Berufsunfähigkeit",
    einstieg: "Stellen Sie sich vor, Sie können morgen dauerhaft nicht mehr arbeiten.",
    fragen: [
      "Wer zahlt ab morgen Ihre Miete / Ihren Kredit?",
      "Wie lange reichen Ihre Ersparnisse – 3 Monate, 6 Monate?",
      "Was passiert mit Ihrer Familie, wenn Ihr Einkommen wegfällt?",
      "Könnten Sie von der gesetzlichen Erwerbsminderungsrente leben (~€800/Monat)?",
    ],
    realitaet: "Jeder 4. Arbeitnehmer wird mindestens einmal berufsunfähig. Die gesetzliche Rente deckt nur ~30 % des letzten Nettos.",
    abschluss: "Was würde das konkret für Sie bedeuten – finanziell und für Ihre Familie?",
  },
  {
    id: "tod",
    emoji: "❤️",
    titel: "Todesfall",
    einstieg: "Ein schwieriges Thema – aber ein sehr wichtiges. Stellen Sie sich vor, Sie wären morgen nicht mehr da.",
    fragen: [
      "Wie wäre Ihre Familie / Ihr Partner finanziell abgesichert?",
      "Wer übernimmt laufende Kredite oder die Miete?",
      "Könnten Ihre Kinder so aufwachsen wie Sie es sich wünschen?",
      "Gibt es jemanden, der finanziell von Ihnen abhängig ist?",
    ],
    realitaet: "Ohne Absicherung bleibt die Familie auf Schulden sitzen. Eine Risikolebensversicherung kostet oft unter 20 € im Monat.",
    abschluss: "Wer wäre konkret betroffen – und was wäre Ihr größter Sorge dabei?",
  },
  {
    id: "pflege",
    emoji: "👴",
    titel: "Pflegebedürftigkeit",
    einstieg: "Stellen Sie sich vor, Sie oder Ihr Partner benötigen eines Tages intensive Pflege.",
    fragen: [
      "Wissen Sie, was ein Pflegeplatz im Heim heute kostet? (3.000–5.000 € / Monat)",
      "Die gesetzliche Pflegeversicherung deckt nur ~40 % – wer zahlt den Rest?",
      "Würden Ihre Kinder finanziell einspringen müssen?",
      "Haben Sie Vermögen, das im Pflegefall aufgebraucht werden würde?",
    ],
    realitaet: "Pflegebedürftigkeit trifft jeden dritten Deutschen. Die Kosten übersteigen die gesetzliche Leistung um Tausende Euro pro Monat.",
    abschluss: "Wie würden Sie sich fühlen, wenn Ihre Kinder dafür aufkommen müssten?",
  },
  {
    id: "krankheit",
    emoji: "🏥",
    titel: "Schwere Krankheit / langer Ausfall",
    einstieg: "Stellen Sie sich vor, Sie erkranken schwer und fallen 6–12 Monate aus.",
    fragen: [
      "Bekommen Sie Krankengeld – und wissen Sie, wie hoch das wäre?",
      "Wie lange zahlt Ihr Arbeitgeber weiter? (i.d.R. 6 Wochen)",
      "Können Sie Ihre laufenden Kosten mit 70 % Ihres Einkommens decken?",
      "Was passiert mit Ihrem Kredit oder Ihrer Miete in dieser Zeit?",
    ],
    realitaet: "Nach 6 Wochen springt die Krankenkasse mit ~70 % des Bruttoeinkommens ein – aber viele Kosten bleiben 100 %.",
    abschluss: "Was würde das in Ihrer aktuellen Situation bedeuten – welche Kosten wären am kritischsten?",
  },
  {
    id: "unfall",
    emoji: "🦽",
    titel: "Schwerer Unfall",
    einstieg: "Stellen Sie sich vor, ein Unfall hinterlässt Sie dauerhaft eingeschränkt.",
    fragen: [
      "Wäre Ihre Wohnung / Ihr Haus barrierefrei umbaubar – und wer zahlt das?",
      "Was würde der Umbau kosten – und haben Sie dieses Kapital verfügbar?",
      "Könnten Sie Ihren aktuellen Beruf noch ausüben?",
      "Wer würde sich um Sie kümmern – und was bedeutet das für die Betreuungsperson?",
    ],
    realitaet: "Ein Unfall kann in Sekunden alles verändern. Eine Einmalzahlung gibt Ihnen die Freiheit, selbst zu entscheiden, was nötig ist.",
    abschluss: "Was wäre Ihre größte Sorge nach einem schweren Unfall?",
  },
];

export default function WorstCaseGuide() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = SZENARIEN.find((s) => s.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Führe den Kunden durch das Szenario – stelle die Fragen laut, lass Pausen entstehen. Das Ziel ist Bewusstsein, nicht Angst.
              </p>
            </div>
            {SZENARIEN.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <span className="text-2xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{s.titel}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.einstieg}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Alle Szenarien
            </button>

            {/* Einstieg */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{selected.emoji}</span>
                <h2 className="font-bold text-base">{selected.titel}</h2>
              </div>
              <div className="bg-secondary/60 rounded-xl p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Einstieg – wortgenau sagen:</p>
                <p className="text-sm italic leading-relaxed">„{selected.einstieg}"</p>
              </div>
            </div>

            {/* Fragen */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fragen stellen – Pausen aushalten</p>
              <div className="space-y-2">
                {selected.fragen.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm italic text-foreground leading-relaxed">„{f}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Realität */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Die Realität (Fakten nennen)</p>
              <p className="text-sm leading-relaxed">{selected.realitaet}</p>
            </div>

            {/* Abschlussfrage */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-xs font-semibold text-primary mb-1">Abschlussfrage – emotional verankern:</p>
              <p className="text-sm font-medium italic">„{selected.abschluss}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}