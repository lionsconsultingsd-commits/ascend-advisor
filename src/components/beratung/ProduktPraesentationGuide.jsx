import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ProduktEmpfehlung from "@/components/beratung/ProduktEmpfehlung";

const SCHRITTE = [
  {
    id: "bruecke",
    emoji: "🌉",
    titel: "Brücke zum Bedarf bauen",
    beschreibung: "Verbinde die Lösung mit dem, was der Kunde selbst gesagt hat.",
    anleitung: [
      "Beziehe dich auf das Worst-Case-Szenario, das den Kunden am meisten bewegt hat.",
      "Nutze die eigenen Worte des Kunden – nicht Fachjargon.",
      "Bestätige nochmals das Hauptproblem, bevor du die Lösung nennst.",
    ],
    skript: [
      '„Sie haben vorhin gesagt, dass Sie sich am meisten Sorgen machen, dass [Kundenaussage]."',
      '„Genau dafür habe ich eine Lösung, die passt – darf ich Sie kurz vorstellen?"',
    ],
    tipp: "Wer die Brücke nicht baut, präsentiert ins Leere. Der Kunde muss sich selbst in der Lösung wiederfinden.",
  },
  {
    id: "nutzen",
    emoji: "🎯",
    titel: "Nutzen statt Produkt",
    beschreibung: "Erkläre was der Kunde gewinnt – nicht was das Produkt ist.",
    anleitung: [
      "Nenne niemals zuerst den Beitrag oder technische Details.",
      "Frage dich: Was bedeutet diese Absicherung konkret für das Leben des Kunden?",
      "Verknüpfe immer mit Familie, Sicherheit, Freiheit – was ihm wichtig ist.",
    ],
    skript: [
      '„Was das für Sie konkret bedeutet: Selbst wenn Sie morgen nicht mehr arbeiten könnten – Ihre Familie lebt weiter wie heute."',
      '„Ihr Kredit läuft weiter, Ihre Kinder können zur Schule – Sie müssen sich um nichts Finanzielles sorgen."',
    ],
    tipp: "Menschen kaufen keine Versicherungen – sie kaufen Sicherheit, Ruhe und den Schutz ihrer Familie.",
  },
  {
    id: "vergleich",
    emoji: "⚖️",
    titel: "Kosten vs. Risiko",
    beschreibung: "Den Beitrag ins richtige Verhältnis setzen.",
    anleitung: [
      "Erst den Wert der Leistung nennen, dann den Beitrag – nie umgekehrt.",
      "Runterrechnen auf den Tag: 30 € / Monat = 1 € pro Tag.",
      "Gegenüberstellen: Beitrag vs. finanzieller Schaden ohne Absicherung.",
    ],
    skript: [
      '„Für gerade mal [X] € im Monat – das ist weniger als ein Kaffee am Tag – sind Sie und Ihre Familie vollständig abgesichert."',
      '„Stellen Sie dagegen: Was würde es kosten, wenn das Einkommen morgen wegfällt – für Miete, Kredit, Lebensunterhalt?"',
      '„Der Beitrag ist die günstigste Versicherung gegen Ihren größten finanziellen Risikofaktor."',
    ],
    tipp: "Sage niemals nur den Beitrag. Sage immer: wofür. Der Kontext entscheidet, ob es viel oder wenig klingt.",
  },
  {
    id: "einfachheit",
    emoji: "✂️",
    titel: "Max. 2 Optionen – nie mehr",
    beschreibung: "Zu viel Auswahl lähmt die Entscheidung.",
    anleitung: [
      "Biete maximal 2 Varianten an: Basis und Empfehlung.",
      "Empfehle klar – sage, welche Du wählen würdest und warum.",
      "Erkläre den Unterschied in einem Satz.",
    ],
    skript: [
      '„Ich habe Ihnen zwei Möglichkeiten mitgebracht – eine solide Grundabsicherung und meine persönliche Empfehlung für Ihre Situation."',
      '„Meine Empfehlung ist Version B – weil sie [konkreter Grund für diesen Kunden] besser abdeckt."',
      '„Der Unterschied ist [X] € im Monat – und dafür bekommen Sie [zusätzlicher Nutzen]."',
    ],
    tipp: "Kunden wollen keine Auswahl – sie wollen einen Experten, der ihnen sagt, was das Richtige ist.",
  },
  {
    id: "sozial",
    emoji: "👥",
    titel: "Soziale Bestätigung",
    beschreibung: "Andere haben dieselbe Entscheidung getroffen – und sind froh.",
    anleitung: [
      "Nenne ähnliche Kundensituationen (anonym) als Referenz.",
      "Belege, dass diese Lösung bewährt ist.",
      "Zeige Leistungsquoten oder Bewertungen des Anbieters.",
    ],
    skript: [
      '„Viele meiner Kunden in ähnlicher Situation haben sich genau für diese Lösung entschieden – und sind sehr froh darüber."',
      '„Der Anbieter hat eine Leistungsquote von über 90 % – das heißt: In fast allen Fällen wird tatsächlich gezahlt."',
    ],
    tipp: "Niemand will der Erste sein. Soziale Bewährtheit nimmt das Risikogefühl aus der Entscheidung.",
  },
  {
    id: "abschluss",
    emoji: "🤝",
    titel: "Weichen stellen – Abschluss einleiten",
    beschreibung: "Den nächsten Schritt klar und ohne Druck benennen.",
    anleitung: [
      "Frage nach dem Gefühl, nicht nach der Entscheidung.",
      "Biete an, alle offenen Fragen zu klären – ohne Zeitdruck.",
      "Nenne den nächsten konkreten Schritt.",
    ],
    skript: [
      '„Wie klingt das für Sie – haben Sie ein gutes Gefühl dabei?"',
      '„Gibt es noch einen Punkt, der Ihnen nicht ganz klar ist oder den wir nochmal besprechen sollen?"',
      '„Wenn Sie möchten, machen wir jetzt den nächsten Schritt und schauen gemeinsam, wie wir das in die Wege leiten."',
    ],
    tipp: "Ein Abschluss entsteht nicht durch Druck – sondern dadurch, dass alle Fragen beantwortet sind und der Kunde sich sicher fühlt.",
  },
];

export default function ProduktPraesentationGuide({ beratung }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = SCHRITTE.find((s) => s.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {/* KI-Produktempfehlung */}
            <ProduktEmpfehlung beratung={beratung} />

            <p className="text-sm text-muted-foreground mb-3">
              Folge diesen 6 Schritten – in dieser Reihenfolge – um den Kunden von der Lösung zu überzeugen.
            </p>
            {SCHRITTE.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-xl shrink-0">{s.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{s.titel}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.beschreibung}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Alle Schritte
            </button>

            {/* Header */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <p className="font-bold">{selected.titel}</p>
                  <p className="text-xs text-muted-foreground">{selected.beschreibung}</p>
                </div>
              </div>
            </div>

            {/* Anleitung */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">So gehst du vor</p>
              <ul className="space-y-2">
                {selected.anleitung.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skript */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sag genau das – wortgenau</p>
              <div className="space-y-2">
                {selected.skript.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm italic text-foreground leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipp */}
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-primary">Berater-Tipp</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{selected.tipp}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}