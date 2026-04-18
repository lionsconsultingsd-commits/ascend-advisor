import React, { useState } from "react";
import { ChevronRight, ChevronLeft, AlertTriangle, CheckCircle2, MinusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const BEREICHE = [
  {
    id: "bu",
    emoji: "💼",
    titel: "Berufsunfähigkeit",
    risiko: "Hoch",
    frage: "Was passiert finanziell, wenn Sie dauerhaft nicht mehr arbeiten können?",
    luecke: "Gesetzliche BU-Rente deckt meist nur 30–40 % des Nettoeinkommens.",
    argumentation: [
      "Jeder 4. Arbeitnehmer wird mindestens einmal berufsunfähig.",
      "Ohne Absicherung droht sozialer Abstieg – Miete, Kredit, Lebensunterhalt gefährdet.",
      "Die gesetzliche Erwerbsminderungsrente greift erst bei voller Arbeitsunfähigkeit und ist minimal.",
      "Je jünger und gesünder heute, desto günstiger und einfacher der Abschluss.",
    ],
    empfehlung: "Berufsunfähigkeitsversicherung dringend empfohlen",
  },
  {
    id: "altersvorsorge",
    emoji: "🏦",
    titel: "Altersvorsorge / Rentenlücke",
    risiko: "Hoch",
    frage: "Wissen Sie, wie hoch Ihre gesetzliche Rente voraussichtlich sein wird?",
    luecke: "Die Rentenlücke beträgt im Schnitt 40–60 % des letzten Nettoeinkommens.",
    argumentation: [
      "Das Rentenniveau sinkt kontinuierlich – heute bereits unter 50 % des Einkommens.",
      "Inflation entwertet Ersparnisse ohne gezielten Vermögensaufbau.",
      "Wer früh beginnt, profitiert vom Zinseszinseffekt – jedes Jahr Verzögerung kostet Tausende.",
      "Staatliche Förderung (Riester, Rürup, bAV) wird oft nicht genutzt.",
    ],
    empfehlung: "Private Altersvorsorge aufbauen – Rentenlücke konkret berechnen",
  },
  {
    id: "kranken",
    emoji: "🏥",
    titel: "Krankenversorgung",
    risiko: "Mittel",
    frage: "Sind Sie zufrieden mit Ihrer aktuellen medizinischen Versorgung?",
    luecke: "Gesetzlich Versicherte warten oft Monate auf Facharzttermine, kein Chefarzt, kein Einzelzimmer.",
    argumentation: [
      "Privatpatienten erhalten schnellere Termine und bessere Behandlung.",
      "Zahnersatz und Sehhilfen sind gesetzlich kaum abgedeckt.",
      "Krankenzusatzversicherung schließt Lücken zu einem Bruchteil der PKV-Kosten.",
    ],
    empfehlung: "Krankenzusatzversicherung prüfen – Zahn, Sehen, stationär",
  },
  {
    id: "haftpflicht",
    emoji: "⚖️",
    titel: "Haftpflicht",
    risiko: "Mittel",
    frage: "Haben Sie eine private Haftpflichtversicherung?",
    luecke: "Ohne Haftpflicht haften Sie mit Ihrem gesamten Vermögen – auch für Fahrlässigkeit.",
    argumentation: [
      "Ein einfacher Missgeschick (z.B. Sturz eines Radfahrers) kann Millionenforderungen auslösen.",
      "Haftpflichtversicherung kostet meist unter 100 € im Jahr – unverzichtbar.",
      "Besonders bei Mietern: Schäden an der Wohnung müssen selbst getragen werden.",
    ],
    empfehlung: "Private Haftpflicht sofort absichern – günstiger Basisschutz",
  },
  {
    id: "pflege",
    emoji: "👴",
    titel: "Pflegerisiko",
    risiko: "Mittel",
    frage: "Haben Sie sich schon Gedanken gemacht, wer für Sie sorgt, wenn Sie pflegebedürftig werden?",
    luecke: "Gesetzliche Pflegeversicherung deckt nur ca. 40 % der tatsächlichen Pflegekosten.",
    argumentation: [
      "Pflegekosten im Heim: 3.000–5.000 € pro Monat – die Differenz zahlen Sie selbst.",
      "Ohne Absicherung müssen Kinder finanziell einspringen.",
      "Pflegezusatzversicherung jetzt abschließen – später werden Annahme schwieriger und teurer.",
    ],
    empfehlung: "Pflegezusatzversicherung empfohlen – besonders ab 40",
  },
  {
    id: "tod",
    emoji: "❤️",
    titel: "Todesfallabsicherung",
    risiko: "Situativ",
    frage: "Falls Sie morgen nicht mehr da wären – wie wäre Ihre Familie finanziell abgesichert?",
    luecke: "Ohne Risikoleben bleibt Familie oder Kreditgeber auf Schulden und Kosten sitzen.",
    argumentation: [
      "Besonders bei Kredit, Immobilie oder Familie mit Kindern unbedingt nötig.",
      "Risikolebensversicherung oft unter 20 € im Monat.",
      "Zahlt Einmalsumme im Todesfall – Familie bleibt abgesichert.",
    ],
    empfehlung: "Risikolebensversicherung – besonders bei Familie oder Kredit",
  },
  {
    id: "unfall",
    emoji: "🦽",
    titel: "Unfallrisiko",
    risiko: "Situativ",
    frage: "Haben Sie ein erhöhtes Unfallrisiko durch Beruf, Sport oder Freizeitaktivitäten?",
    luecke: "BU deckt keine Unfälle durch Fahrlässigkeit im Freizeitbereich vollständig.",
    argumentation: [
      "Einmalzahlung bei dauerhafter Invalidität durch Unfall.",
      "Besonders sinnvoll für Handwerker, Sportler, Familien mit Kindern.",
      "Sehr günstiger Beitrag – gutes Preis-Leistungs-Verhältnis.",
    ],
    empfehlung: "Unfallversicherung als Ergänzung zur BU prüfen",
  },
];

const RISIKO_CONFIG = {
  Hoch: { color: "text-red-500", bg: "bg-red-500/10 border-red-500/30", dot: "bg-red-500" },
  Mittel: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30", dot: "bg-amber-500" },
  Situativ: { color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30", dot: "bg-blue-500" },
};

// Einschätzungen: 0 = nicht bewertet, 1 = Lücke, 2 = gedeckt, 3 = nicht relevant
const STATUS_OPTIONS = [
  { value: 1, label: "Lücke!", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10 border-red-400" },
  { value: 2, label: "Gedeckt", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-400" },
  { value: 3, label: "Nicht relevant", icon: MinusCircle, color: "text-muted-foreground", bg: "bg-secondary border-border" },
];

export default function VersorgungslueckenGuide() {
  const [selectedId, setSelectedId] = useState(null);
  const [einschaetzungen, setEinschaetzungen] = useState({});
  const selected = BEREICHE.find((b) => b.id === selectedId);

  const setStatus = (id, value) =>
    setEinschaetzungen((prev) => ({ ...prev, [id]: prev[id] === value ? 0 : value }));

  const lueckenCount = Object.values(einschaetzungen).filter((v) => v === 1).length;

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">
              Bewerte jeden Bereich und notiere, wo Versorgungslücken bestehen.
            </p>

            {lueckenCount > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm font-semibold text-red-500">{lueckenCount} Versorgungslücke{lueckenCount > 1 ? "n" : ""} identifiziert</p>
              </div>
            )}

            {BEREICHE.map((b) => {
              const status = einschaetzungen[b.id] || 0;
              const statusOpt = STATUS_OPTIONS.find((s) => s.value === status);
              const risikoConf = RISIKO_CONFIG[b.risiko];
              return (
                <div key={b.id} className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setSelectedId(b.id)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <span className="text-xl shrink-0">{b.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{b.titel}</p>
                      <span className={cn("text-[10px] font-medium", risikoConf.color)}>● {b.risiko}</span>
                    </div>
                    {statusOpt && (
                      <span className={cn("text-xs font-semibold flex items-center gap-1", statusOpt.color)}>
                        <statusOpt.icon className="w-3.5 h-3.5" />
                        {statusOpt.label}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                  {/* Quick-Status-Buttons */}
                  <div className="flex border-t">
                    {STATUS_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setStatus(b.id, opt.value)}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors border-r last:border-r-0",
                            active ? cn(opt.color, opt.bg) : "text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Alle Bereiche
            </button>

            {/* Header */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <p className="font-bold">{selected.titel}</p>
                  <span className={cn("text-xs font-medium", RISIKO_CONFIG[selected.risiko].color)}>
                    ● Risiko: {selected.risiko}
                  </span>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Einstiegsfrage ans Kunden</p>
                <p className="text-sm italic">„{selected.frage}"</p>
              </div>
            </div>

            {/* Versorgungslücke */}
            <div className={cn("rounded-2xl p-4 border mb-3", RISIKO_CONFIG[selected.risiko].bg)}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Typische Versorgungslücke</p>
              <p className="text-sm font-medium">{selected.luecke}</p>
            </div>

            {/* Argumentation */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Argumentation für den Kunden</p>
              <ul className="space-y-2">
                {selected.argumentation.map((arg, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {arg}
                  </li>
                ))}
              </ul>
            </div>

            {/* Empfehlung */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
              <p className="text-xs font-semibold text-primary mb-1">Empfehlung Berater</p>
              <p className="text-sm font-medium">{selected.empfehlung}</p>
            </div>

            {/* Einschätzung setzen */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deine Einschätzung</p>
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = (einschaetzungen[selected.id] || 0) === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(selected.id, opt.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      active ? cn(opt.bg, "shadow-sm") : "bg-card hover:bg-secondary"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", active ? opt.color : "text-muted-foreground")} />
                    <span className={cn("text-sm font-medium", active ? opt.color : "text-foreground")}>
                      {opt.label}
                    </span>
                    {active && <span className="ml-auto text-xs text-muted-foreground">✓ ausgewählt</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}