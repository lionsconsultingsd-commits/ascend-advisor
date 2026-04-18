import React, { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_EINNAHMEN = [
  { id: "e1", label: "Nettoeinkommen", betrag: "" },
  { id: "e2", label: "Einkommen Partner", betrag: "" },
];

const DEFAULT_AUSGABEN = [
  { id: "a1", label: "Miete / Kredit", betrag: "" },
  { id: "a2", label: "Lebenshaltung", betrag: "" },
  { id: "a3", label: "Versicherungen (gesamt)", betrag: "" },
  { id: "a4", label: "Auto / Mobilität", betrag: "" },
  { id: "a5", label: "Sonstiges", betrag: "" },
];

function Posten({ item, onChange, onDelete, canDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
        placeholder="Bezeichnung"
        className="flex-1 h-9 rounded-xl text-sm"
      />
      <div className="relative w-28 shrink-0">
        <Input
          type="number"
          value={item.betrag}
          onChange={(e) => onChange({ ...item, betrag: e.target.value })}
          placeholder="0"
          className="h-9 rounded-xl text-sm pr-8 text-right"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
      </div>
      {canDelete && (
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function EinnahmenAusgabenRechner() {
  const [einnahmen, setEinnahmen] = useState(DEFAULT_EINNAHMEN);
  const [ausgaben, setAusgaben] = useState(DEFAULT_AUSGABEN);

  const sumEinnahmen = einnahmen.reduce((s, i) => s + (parseFloat(i.betrag) || 0), 0);
  const sumAusgaben = ausgaben.reduce((s, i) => s + (parseFloat(i.betrag) || 0), 0);
  const frei = sumEinnahmen - sumAusgaben;

  const updateEinnahme = (id, updated) =>
    setEinnahmen((prev) => prev.map((i) => (i.id === id ? updated : i)));
  const updateAusgabe = (id, updated) =>
    setAusgaben((prev) => prev.map((i) => (i.id === id ? updated : i)));

  const addEinnahme = () =>
    setEinnahmen((prev) => [...prev, { id: `e_${Date.now()}`, label: "", betrag: "" }]);
  const addAusgabe = () =>
    setAusgaben((prev) => [...prev, { id: `a_${Date.now()}`, label: "", betrag: "" }]);

  const removeEinnahme = (id) => setEinnahmen((prev) => prev.filter((i) => i.id !== id));
  const removeAusgabe = (id) => setAusgaben((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Erfasse gemeinsam mit dem Kunden alle Einnahmen und Ausgaben, um das freie Budget für Absicherung zu ermitteln.
      </p>

      {/* Einnahmen */}
      <div className="bg-card rounded-2xl p-4 border space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h3 className="font-semibold text-sm">Einnahmen</h3>
          <span className="ml-auto text-sm font-bold text-emerald-500">
            {sumEinnahmen.toLocaleString("de-DE")} €
          </span>
        </div>
        <div className="space-y-2">
          {einnahmen.map((item) => (
            <Posten
              key={item.id}
              item={item}
              onChange={(updated) => updateEinnahme(item.id, updated)}
              onDelete={() => removeEinnahme(item.id)}
              canDelete={einnahmen.length > 1}
            />
          ))}
        </div>
        <button
          onClick={addEinnahme}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-1"
        >
          <Plus className="w-3.5 h-3.5" /> Einnahme hinzufügen
        </button>
      </div>

      {/* Ausgaben */}
      <div className="bg-card rounded-2xl p-4 border space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-sm">Ausgaben</h3>
          <span className="ml-auto text-sm font-bold text-red-400">
            {sumAusgaben.toLocaleString("de-DE")} €
          </span>
        </div>
        <div className="space-y-2">
          {ausgaben.map((item) => (
            <Posten
              key={item.id}
              item={item}
              onChange={(updated) => updateAusgabe(item.id, updated)}
              onDelete={() => removeAusgabe(item.id)}
              canDelete={ausgaben.length > 1}
            />
          ))}
        </div>
        <button
          onClick={addAusgabe}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-1"
        >
          <Plus className="w-3.5 h-3.5" /> Ausgabe hinzufügen
        </button>
      </div>

      {/* Ergebnis */}
      <div
        className={cn(
          "rounded-2xl p-4 border-2 flex items-center gap-3",
          frei >= 0
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-red-500/10 border-red-500/30"
        )}
      >
        <Wallet className={cn("w-5 h-5 shrink-0", frei >= 0 ? "text-emerald-500" : "text-red-400")} />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium">Freies Budget / Monat</p>
          <p className={cn("text-2xl font-bold", frei >= 0 ? "text-emerald-500" : "text-red-400")}>
            {frei.toLocaleString("de-DE")} €
          </p>
          {sumEinnahmen > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              = {((frei / sumEinnahmen) * 100).toFixed(0)} % des Einkommens verfügbar
            </p>
          )}
        </div>
        {frei > 0 && (
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">Davon für Absicherung</p>
            <p className="text-sm font-semibold text-primary">
              ~{Math.round(frei * 0.1).toLocaleString("de-DE")} – {Math.round(frei * 0.2).toLocaleString("de-DE")} €
            </p>
            <p className="text-[10px] text-muted-foreground">(10–20 % Richtwert)</p>
          </div>
        )}
      </div>
    </div>
  );
}