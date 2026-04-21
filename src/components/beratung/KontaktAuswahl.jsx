import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function KontaktAuswahl({ gespraechstyp, onStart, onBack }) {
  const [name, setName] = useState("");

  useEffect(() => {
    // URL-Parameter auslesen (von UPL Deep-Link)
    const params = new URLSearchParams(window.location.search);
    const kontaktName = params.get("kontakt_name") || params.get("kunde_name") || params.get("name");
    const kontaktId = params.get("kontakt_id") || params.get("upl_kontakt_id");

    if (kontaktName) {
      // Direkt starten, kein Namenseingabe nötig
      onStart(kontaktName.trim(), null, kontaktId || null, gespraechstyp.id);
    }
  }, []);

  const handleManualStart = () => {
    if (!name.trim()) return;
    onStart(name.trim(), null, null, gespraechstyp.id);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{gespraechstyp.emoji}</span>
            <h1 className="text-xl font-bold">{gespraechstyp.label}</h1>
          </div>
          <p className="text-sm text-muted-foreground">Name des Kunden eingeben</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div className="bg-card rounded-2xl p-5 border shadow-sm space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground">Kundenname</h2>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualStart()}
            placeholder="Name des Kunden"
            className="h-12 rounded-xl text-base"
            autoFocus
          />
          <Button onClick={handleManualStart} disabled={!name.trim()} className="w-full h-12 rounded-xl text-base">
            {gespraechstyp.label} starten
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}