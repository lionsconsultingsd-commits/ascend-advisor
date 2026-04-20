import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronRight, ChevronLeft, UserPlus, CheckCircle2, Plus, Trash2, Lightbulb, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Master Guide Daten ───────────────────────────────────────
const GUIDE_SCHRITTE = [
  {
    id: "timing",
    emoji: "⏰",
    titel: "Der richtige Moment",
    kurz: "Wann fragen?",
    beschreibung: "Empfehlungen nur im emotionalen Hochpunkt erfragen.",
    inhalt: [
      {
        typ: "erklaerung",
        text: "Der beste Moment für eine Empfehlung ist JETZT – direkt nachdem der Kunde 'Ja' gesagt hat. Die Emotion ist auf dem Höchststand, das Vertrauen maximal.",
      },
      {
        typ: "tipp",
        text: "Warte nie auf 'irgendwann'. Wer heute nicht fragt, fragt morgen auch nicht. Die Bereitschaft zur Empfehlung sinkt mit jeder Woche.",
      },
    ],
    skript: null,
  },
  {
    id: "bruecke",
    emoji: "🌉",
    titel: "Die Brücke bauen",
    kurz: "Überleitung",
    beschreibung: "Natürlich vom Abschluss zur Empfehlungsfrage überleiten.",
    inhalt: [
      {
        typ: "erklaerung",
        text: "Springe nie direkt zur Empfehlungsfrage. Leite über – so fühlt es sich für den Kunden natürlich an, nicht wie eine Verkaufsstrategie.",
      },
    ],
    skript: [
      {
        label: "Überleitung nach Abschluss",
        text: '„Herr/Frau [Name], ich freue mich wirklich, dass wir heute eine gute Lösung für Sie gefunden haben. Genau das ist es, wofür ich jeden Tag arbeite."',
      },
      {
        label: "Brücke zur Empfehlung",
        text: '„Darf ich Sie noch etwas fragen – ganz unverbindlich?"',
      },
    ],
  },
  {
    id: "einstieg",
    emoji: "🎯",
    titel: "Die Einstiegsfrage",
    kurz: "Einstieg",
    beschreibung: "Die erste Frage entscheidet – weich, konkret, nicht aufdringlich.",
    inhalt: [
      {
        typ: "erklaerung",
        text: 'Stelle niemals eine Ja/Nein-Frage wie \u201eKennen Sie jemanden?\u201c \u2013 das l\u00e4dt zum Nein ein. Stelle eine Nachdenkfrage, die den Kunden in seiner Welt abholt.',
      },
      {
        typ: "warnung",
        text: 'Nicht sagen: \u201eK\u00f6nnen Sie mich weiterempfehlen?\u201c \u2192 wirkt bittend und schwach.',
      },
    ],
    skript: [
      {
        label: "Variante 1 – Familie / Freunde",
        text: '„Wenn Sie kurz überlegen – gibt es jemanden in Ihrem Umfeld, der gerade ähnliche Fragen hat wie Sie heute? Jemanden, dem ich genauso helfen könnte?"',
      },
      {
        label: "Variante 2 – Kollegen / Arbeit",
        text: '„Viele meiner Kunden haben Kollegen oder Freunde, die sich ähnliche Sorgen machen – Absicherung, Altersvorsorge, Familie. Fällt Ihnen spontan jemand ein?"',
      },
      {
        label: "Variante 3 – Lebenssituation",
        text: '„Sie haben mir erzählt, dass Ihr Bruder / Ihre Freundin auch gerade [Situation] hat. Glauben Sie, dass er/sie von so einem Gespräch profitieren könnte?"',
      },
    ],
  },
  {
    id: "schweigen",
    emoji: "🤫",
    titel: "Schweigen aushalten",
    kurz: "Pause",
    beschreibung: "Nach der Frage: Mund halten. Die Stille arbeitet für dich.",
    inhalt: [
      {
        typ: "erklaerung",
        text: "Nachdem du die Empfehlungsfrage gestellt hast: SCHWEIGE. Wer zuerst spricht, verliert. Lass den Kunden nachdenken – das dauert oft 5–10 Sekunden, die sich ewig anfühlen.",
      },
      {
        typ: "tipp",
        text: "Lächle, halte Blickkontakt, nicke leicht. Zeige: Du hast Zeit. Wer die Stille bricht, signalisiert Unsicherheit.",
      },
    ],
    skript: null,
  },
  {
    id: "einwand",
    emoji: "🛡️",
    titel: "Einwände bei Empfehlungen",
    kurz: "Einwände",
    beschreibung: "Was tun, wenn der Kunde zögert oder ablehnt?",
    inhalt: [
      {
        typ: "erklaerung",
        text: "Auch hier gibt es Einwände. Die häufigsten – und wie du damit umgehst:",
      },
    ],
    einwaende: [
      {
        einwand: '„Ich möchte niemanden aufdrängen."',
        antwort: '„Völlig verständlich – das würde ich auch nie tun. Ich kontaktiere die Person nur, wenn sie selbst Interesse hat. Sie entscheidet. Ich melde mich nur kurz vor – ganz unverbindlich."',
      },
      {
        einwand: '„Mir fällt gerade niemand ein."',
        antwort: '„Kein Problem. Darf ich Sie in 2–3 Tagen kurz erinnern? Oft fällt einem etwas ein, wenn man einen Moment darüber nachgedacht hat."',
      },
      {
        einwand: '„Ich frage mal nach, ob das okay ist."',
        antwort: '„Super – das ist sehr rücksichtsvoll von Ihnen. Kann ich Ihnen kurz einen kleinen Text schicken, den Sie einfach weiterleiten können? So haben Sie und die Person alles auf einen Blick."',
      },
    ],
    skript: null,
  },
  {
    id: "konkret",
    emoji: "📋",
    titel: "Daten sofort erfassen",
    kurz: "Erfassen",
        beschreibung: "Sobald ein Name f\u00e4llt \u2013 sofort notieren. Nicht einfach merken.",
    inhalt: [
      {
        typ: "erklaerung",
        text: "Wenn der Kunde einen Namen nennt, zoegere nicht. Hol dein Telefon raus oder nutze das Formular unten. Wer nicht sofort erfasst, verliert die Empfehlung.",
      },
      {
        typ: "tipp",
        text: "Frage immer: Name + Telefon oder E-Mail + kurzer Kontext (warum könnte er/sie Bedarf haben?). Mehr brauchst du nicht.",
      },
    ],
    skript: [
      {
        label: "Daten abfragen",
        text: '„Perfekt – wie heißt die Person? Und haben Sie eine Telefonnummer oder E-Mail von ihr, damit ich mich kurz vorstellen kann?"',
      },
      {
        label: "Kontext erfragen",
        text: '„Und damit ich gut vorbereitet bin: Was ist seine/ihre aktuelle Situation – arbeitet er/sie, hat er/sie Familie, gibt es etwas Wichtiges, das ich wissen sollte?"',
      },
    ],
  },
  {
    id: "abschluss",
    emoji: "🙏",
    titel: "Wertschätzung zeigen",
    kurz: "Danke",
    beschreibung: "Eine Empfehlung ist ein Vertrauensbeweis – behandle sie so.",
    inhalt: [
      {
        typ: "erklaerung",
        text: "Jede Empfehlung ist ein Geschenk. Der Kunde vertraut dir seinen Kontakt an. Zeige echte Dankbarkeit – und halte dein Versprechen: Nur Kontakt aufnehmen, wenn der Kontext passt.",
      },
    ],
    skript: [
      {
        label: "Abschlusssatz",
        text: '„Vielen herzlichen Dank – das bedeutet mir wirklich viel. Ich werde die Person mit dem gleichen Respekt behandeln, den Sie von mir erfahren haben."',
      },
    ],
  },
];

// ─── Erfassungsformular ───────────────────────────────────────
const LEERE_PERSON = () => ({ name: "", telefon: "", email: "", notiz: "" });

function EmpfehlungFormular({ beratung }) {
  const [personen, setPersonen] = useState([LEERE_PERSON()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updatePerson = (index, field, value) =>
    setPersonen((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  const addPerson = () => setPersonen((prev) => [...prev, LEERE_PERSON()]);
  const removePerson = (index) => setPersonen((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    const gueltig = personen.filter((p) => p.name.trim());
    if (gueltig.length === 0) return;
    setSaving(true);
    try {
      for (const p of gueltig) {
        await base44.entities.Empfehlung.create({
          beratung_id: beratung?.id,
          empfehler_name: beratung?.kunde_name,
          empfohlene_person_name: p.name,
          empfohlene_person_telefon: p.telefon || null,
          empfohlene_person_email: p.email || null,
          notiz: p.notiz || null,
          status: "offen",
        });
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="font-semibold text-sm text-emerald-600">
          {personen.filter((p) => p.name.trim()).length} Empfehlung(en) gespeichert!
        </p>
        <Button variant="outline" size="sm" onClick={() => { setSaved(false); setPersonen([LEERE_PERSON()]); }}>
          Weitere erfassen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {personen.map((p, i) => (
        <div key={i} className="bg-secondary/30 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Person {i + 1}</p>
            {personen.length > 1 && (
              <button onClick={() => removePerson(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Input placeholder="Name *" value={p.name} onChange={(e) => updatePerson(i, "name", e.target.value)} className="rounded-xl h-9 text-sm" />
          <Input placeholder="Telefon" value={p.telefon} onChange={(e) => updatePerson(i, "telefon", e.target.value)} className="rounded-xl h-9 text-sm" />
          <Input placeholder="E-Mail" value={p.email} onChange={(e) => updatePerson(i, "email", e.target.value)} className="rounded-xl h-9 text-sm" />
          <Input placeholder="Kontext (z.B. Kollege, hat Familie...)" value={p.notiz} onChange={(e) => updatePerson(i, "notiz", e.target.value)} className="rounded-xl h-9 text-sm" />
        </div>
      ))}
      <button onClick={addPerson} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
        <Plus className="w-3.5 h-3.5" /> Weitere Person
      </button>
      <Button className="w-full gap-2" onClick={handleSave} disabled={saving || !personen.some((p) => p.name.trim())}>
        {saving ? "Speichern..." : <><UserPlus className="w-4 h-4" /> Empfehlung(en) speichern</>}
      </Button>
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────
export default function EmpfehlungGuide({ beratung }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showFormular, setShowFormular] = useState(false);
  const selected = GUIDE_SCHRITTE.find((s) => s.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <AnimatePresence mode="wait">

        {/* ── Detailansicht ── */}
        {selected ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Alle Schritte
            </button>

            {/* Header */}
            <div className="bg-card rounded-2xl p-4 border mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <p className="font-bold">{selected.titel}</p>
                  <p className="text-xs text-muted-foreground">{selected.beschreibung}</p>
                </div>
              </div>
            </div>

            {/* Inhalt */}
            {selected.inhalt.map((block, i) => (
              <div key={i} className={cn(
                "rounded-2xl p-4 border mb-3",
                block.typ === "tipp" ? "bg-primary/5 border-primary/15" :
                block.typ === "warnung" ? "bg-amber-500/5 border-amber-500/20" :
                "bg-card"
              )}>
                {block.typ === "tipp" && (
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs font-semibold text-primary">Berater-Tipp</p>
                  </div>
                )}
                {block.typ === "warnung" && (
                  <p className="text-xs font-semibold text-amber-600 mb-1">⚠ Achtung</p>
                )}
                <p className="text-sm leading-relaxed">{block.text}</p>
              </div>
            ))}

            {/* Einwände */}
            {selected.einwaende && (
              <div className="bg-card rounded-2xl p-4 border mb-3 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Häufige Einwände & Antworten</p>
                {selected.einwaende.map((e, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-semibold italic text-foreground">{e.einwand}</p>
                    <div className="flex items-start gap-2 pl-2">
                      <MessageSquare className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{e.antwort}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skript */}
            {selected.skript && (
              <div className="bg-card rounded-2xl p-4 border mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Wortgenaue Formulierungen</p>
                <div className="space-y-3">
                  {selected.skript.map((s, i) => (
                    <div key={i}>
                      <p className="text-[11px] font-semibold text-primary mb-1">{s.label}</p>
                      <div className="bg-secondary/50 rounded-xl p-3">
                        <p className="text-sm italic leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

        ) : showFormular ? (
          /* ── Formular ── */
          <motion.div key="formular" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setShowFormular(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Zurück zum Guide
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Empfehlung erfassen</h2>
            </div>
            <EmpfehlungFormular beratung={beratung} />
          </motion.div>

        ) : (
          /* ── Übersicht ── */
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Folge diesen Schritten – in dieser Reihenfolge – um professionell nach Empfehlungen zu fragen.
            </p>

            {GUIDE_SCHRITTE.map((s, i) => (
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
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.titel}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.beschreibung}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
              </button>
            ))}

            {/* CTA Formular */}
            <button
              onClick={() => setShowFormular(true)}
              className="w-full flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl hover:bg-primary/10 transition-all text-left group mt-2"
            >
              <UserPlus className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-primary">Empfehlung erfassen</p>
                <p className="text-xs text-muted-foreground">Namen & Kontaktdaten direkt speichern</p>
              </div>
              <ChevronRight className="w-4 h-4 text-primary shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}