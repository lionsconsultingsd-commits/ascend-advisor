import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, ArrowRight, Search, User, Phone, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

export default function StartDialog({ onStart, recentBeratungen }) {
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
    onStart(displayName, null, k.id);
  };

  const handleManualStart = () => {
    if (!name.trim()) return;
    onStart(name.trim(), null, null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-background pt-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        {/* Logo / Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Briefcase className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">BeratungsAssistent</h1>
          <p className="text-sm text-muted-foreground">
            Dein Leitfaden für professionelle Kundenberatung
          </p>
        </div>

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
              <p className="text-xs text-center text-muted-foreground py-4">
                Keine Kontakte gefunden
              </p>
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
                    <p className="text-sm font-medium truncate">
                      {k.first_name} {k.last_name}
                    </p>
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

        {/* Manual entry */}
        <div className="bg-card rounded-2xl p-5 border shadow-sm space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground">
            Oder manuell eingeben
          </h2>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualStart()}
            placeholder="Name des Kunden"
            className="h-12 rounded-xl text-base"
          />
          <Button
            onClick={handleManualStart}
            disabled={!name.trim()}
            className="w-full h-12 rounded-xl text-base"
          >
            Beratung starten
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Recent sessions */}
        {recentBeratungen && recentBeratungen.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Letzte Beratungen
            </h3>
            {recentBeratungen.map((b) => (
              <button
                key={b.id}
                onClick={() => onStart(b.kunde_name, b.id, b.upl_kontakt_id)}
                className="w-full flex items-center justify-between p-4 bg-card rounded-xl border hover:border-primary/30 hover:shadow-sm transition-all text-left"
              >
                <div>
                  <p className="font-medium text-sm">{b.kunde_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Phase {(b.aktuelle_phase || 0) + 1}/7 · {b.status}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}