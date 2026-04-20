import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { UserPlus, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const LEERE_PERSON = () => ({ name: "", telefon: "", email: "", notiz: "" });

export default function EmpfehlungPanel({ beratung }) {
  const [personen, setPersonen] = useState([LEERE_PERSON()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updatePerson = (index, field, value) => {
    setPersonen((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

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
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <p className="font-semibold text-sm text-emerald-600">
            {personen.filter((p) => p.name.trim()).length} Empfehlung(en) gespeichert!
          </p>
          <p className="text-xs text-muted-foreground mt-1">Du findest sie im Bereich „Empfehlungen".</p>
        </div>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => { setSaved(false); setPersonen([LEERE_PERSON()]); }}>
          Weitere erfassen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Frage jetzt: <span className="font-semibold text-foreground italic">„Gibt es jemanden in Ihrem Umfeld, dem ich genauso helfen könnte?"</span>
        </p>
      </div>

      {personen.map((p, i) => (
        <div key={i} className="bg-card border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </div>
              <p className="text-sm font-semibold">Empfohlene Person</p>
            </div>
            {personen.length > 1 && (
              <button onClick={() => removePerson(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <Input
            placeholder="Name *"
            value={p.name}
            onChange={(e) => updatePerson(i, "name", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Telefon"
            value={p.telefon}
            onChange={(e) => updatePerson(i, "telefon", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="E-Mail"
            value={p.email}
            onChange={(e) => updatePerson(i, "email", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Kurze Notiz (z.B. Kollege, Familie ...)"
            value={p.notiz}
            onChange={(e) => updatePerson(i, "notiz", e.target.value)}
            className="rounded-xl"
          />
        </div>
      ))}

      <button
        onClick={addPerson}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Weitere Person hinzufügen
      </button>

      <Button
        className="w-full gap-2"
        onClick={handleSave}
        disabled={saving || !personen.some((p) => p.name.trim())}
      >
        {saving ? "Speichern..." : (
          <>
            <UserPlus className="w-4 h-4" />
            Empfehlung(en) speichern
          </>
        )}
      </Button>
    </div>
  );
}