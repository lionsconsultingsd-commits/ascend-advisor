import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, ArrowRight } from "lucide-react";

export default function StartDialog({ onStart, recentBeratungen }) {
  const [name, setName] = useState("");

  const handleStart = () => {
    if (!name.trim()) return;
    onStart(name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
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

        {/* New session */}
        <div className="bg-card rounded-2xl p-5 border shadow-sm space-y-4">
          <h2 className="font-semibold text-sm">Neue Beratung starten</h2>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="Name des Kunden"
            className="h-12 rounded-xl text-base"
            autoFocus
          />
          <Button
            onClick={handleStart}
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
                onClick={() => onStart(b.kunde_name, b.id)}
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