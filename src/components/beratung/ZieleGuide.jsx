import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ZIEL_KATEGORIEN = [
  {
    id: "sicherheit",
    emoji: "🛡️",
    titel: "Sicherheit & Absicherung",
    fragen: [
      { frage: "Was würde passieren, wenn Sie morgen für 6 Monate nicht arbeiten könnten?", zweck: "Bedarfslücke aufdecken" },
      { frage: "Wer ist finanziell von Ihnen abhängig?", zweck: "Familie & Verantwortung klären" },
      { frage: "Haben Sie schon mal über Berufsunfähigkeit nachgedacht?", zweck: "Bewusstsein prüfen" },
      { frage: "Was wäre Ihr größtes finanzielles Risiko, das Sie nachts wachhält?", zweck: "Emotionalen Schmerz aufdecken" },
    ],
  },
  {
    id: "zukunft",
    emoji: "🏠",
    titel: "Zukunft & Vermögensaufbau",
    fragen: [
      { frage: "Haben Sie den Wunsch, eines Tages eine Immobilie zu kaufen?", zweck: "Kapitalbedarf ermitteln" },
      { frage: "Was wünschen Sie sich für Ihren Ruhestand – wie soll Ihr Leben dann aussehen?", zweck: "Rentenwunsch konkretisieren" },
      { frage: "Haben Sie bereits für das Alter angespart – und wie viel fehlt Ihnen Ihrer Meinung nach noch?", zweck: "Rentenlücke bewusst machen" },
      { frage: "Möchten Sie etwas für Ihre Kinder aufbauen – z. B. für Ausbildung oder einen Start ins Leben?", zweck: "Generationenziel erfassen" },
    ],
  },
  {
    id: "freiheit",
    emoji: "✈️",
    titel: "Freiheit & Lebensqualität",
    fragen: [
      { frage: "Gibt es etwas, das Sie sich im Leben noch gönnen möchten – aber bisher aufgeschoben haben?", zweck: "Wünsche & Träume öffnen" },
      { frage: "Wie wichtig ist Ihnen finanzielle Unabhängigkeit – und was bedeutet das für Sie konkret?", zweck: "Freiheitsbegriff klären" },
      { frage: "Würden Sie gerne früher in Rente gehen? Wenn ja – wie früh?", zweck: "Renteneinstieg & Kapital schätzen" },
    ],
  },
  {
    id: "gesundheit",
    emoji: "❤️",
    titel: "Gesundheit & Vorsorge",
    fragen: [
      { frage: "Wie wichtig ist Ihnen gute medizinische Versorgung – auch als Privatpatient?", zweck: "Krankenzusatz-Bedarf prüfen" },
      { frage: "Haben Sie schon einmal Situationen erlebt, in denen Sie auf bessere Versorgung angewiesen waren?", zweck: "Erfahrungsbasis nutzen" },
      { frage: "Machen Sie sich Sorgen um Ihre Eltern – oder die Ihrer Partnerschaft – in Bezug auf Pflege?", zweck: "Pflegebedarf erzeugen" },
    ],
  },
  {
    id: "werte",
    emoji: "💡",
    titel: "Werte & Prioritäten",
    fragen: [
      { frage: "Was ist Ihnen im Leben am wichtigsten – und was soll auf keinen Fall gefährdet sein?", zweck: "Kernwerte verstehen" },
      { frage: "Wenn Sie in 10 Jahren auf heute zurückblicken – was soll sich verändert haben?", zweck: "Langfristige Vision öffnen" },
      { frage: "Gibt es etwas, das Ihnen Ihr bisheriger Berater noch nie gefragt hat – das Ihnen aber wichtig wäre?", zweck: "Vertrauen aufbauen & Differenzieren" },
    ],
  },
];

export default function ZieleGuide() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = ZIEL_KATEGORIEN.find((k) => k.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Wähle eine Kategorie – erhalte konkrete Fragen für das Gespräch mit dem Kunden.
            </p>
            {ZIEL_KATEGORIEN.map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedId(k.id)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <span className="text-2xl">{k.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{k.titel}</p>
                  <p className="text-xs text-muted-foreground">{k.fragen.length} Fragen</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Alle Kategorien
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selected.emoji}</span>
              <h2 className="font-bold text-lg">{selected.titel}</h2>
            </div>

            <div className="space-y-3">
              {selected.fragen.map((f, i) => (
                <div key={i} className="bg-card rounded-2xl p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground leading-relaxed italic">
                        „{f.frage}"
                      </p>
                      <span className="inline-block mt-2 text-[11px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                        Ziel: {f.zweck}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-primary/5 border border-primary/15 rounded-2xl p-4">
              <p className="text-xs font-semibold text-primary mb-1">💡 Gesprächs-Tipp</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stelle maximal 2–3 Fragen pro Kategorie. Lass den Kunden antworten und höre aktiv zu –
                notiere Stichworte direkt in den Notizen. Was emotional aufgeladen wird, ist der wichtigste Aufhänger.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}