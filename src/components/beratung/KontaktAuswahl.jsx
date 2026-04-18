import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Search, User, Phone, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function KontaktAuswahl({ gespraechstyp, onStart, onBack }) {
  const [name, setName] = useState("");
  const [kontakte, setKontakte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.functions.invoke("uplGetKontakte", {})
      .then((res) => setKontakte(res.data?.kontakte || []))
      .catch(() => setKontakte([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = kontakte.filter((k) => {
    const fullName = `${k.first_name || ""} ${k.last_name || ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || (k.phone || "").includes(search);
  });

  const handleSelectKontakt = (k) => {
    const displayName = `${k.first_name || ""} ${k.last_name || ""}`.trim();
    onStart(displayName, null, k.id, gespraechstyp.id);
  };

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
          <p className="text-sm text-muted-foreground">Kunden auswählen oder eingeben</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {/* UPL Kontakte */}
        <div className="bg-card rounded-2xl p-5 border shadow-sm space-y-3">
          <h2 className="font-semibold text-sm">Kontakt aus UPL wählen</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name oder Telefon suchen..."
              className="pl-9 h-10 rounded-xl"
            />
          </div>
          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-0.5">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-4">Keine Kontakte gefunden</p>
            ) : (
              filtered.map((k) => (
                <button
                  key={k.id}
                  onClick={() => handleSelectKontakt(k)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{k.first_name} {k.last_name}</p>
                    {k.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {k.phone}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Manuelle Eingabe */}
        <div className="bg-card rounded-2xl p-5 border shadow-sm space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground">Oder manuell eingeben</h2>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualStart()}
            placeholder="Name des Kunden"
            className="h-12 rounded-xl text-base"
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