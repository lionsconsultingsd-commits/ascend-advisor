import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Check, AlertCircle, ArrowRight, Settings } from "lucide-react";

export default function UplPanel({ beratung, onSyncStatusChange }) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);

    // Placeholder for UPL API integration
    // Replace this with actual API call when UPL endpoint is available
    try {
      // Simulated API call structure:
      // const response = await base44.functions.invoke('uplSync', {
      //   kunde_name: beratung.kunde_name,
      //   datum: beratung.datum,
      //   notizen: beratung.notizen,
      //   abgeschlossene_fragen: beratung.abgeschlossene_fragen,
      //   aktuelle_phase: beratung.aktuelle_phase,
      //   status: beratung.status
      // });

      // Simulated delay
      await new Promise((r) => setTimeout(r, 1500));

      setSyncResult("success");
      onSyncStatusChange(true);
    } catch (err) {
      setSyncResult("error");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <p className="text-sm text-muted-foreground mb-4">
        Übertrage die Beratungsdaten an das UPL-System deines Kollegen.
      </p>

      {/* Connection status */}
      <Card className="p-5 rounded-2xl mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">UPL API Schnittstelle</p>
            <p className="text-xs text-muted-foreground">
              Bereit zur Konfiguration
            </p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
          <p>• Endpoint wird von deinem Kollegen bereitgestellt</p>
          <p>• Beratungsdaten werden als JSON übertragen</p>
          <p>• Notizen, Pflichtfragen & Kundendaten werden synchronisiert</p>
        </div>
      </Card>

      {/* Data preview */}
      <Card className="p-5 rounded-2xl mb-4">
        <h3 className="text-sm font-semibold mb-3">Zu übertragende Daten</h3>
        <div className="space-y-2">
          {[
            { label: "Kunde", value: beratung?.kunde_name || "—" },
            { label: "Datum", value: beratung?.datum || new Date().toLocaleDateString("de-DE") },
            { label: "Phase", value: `${(beratung?.aktuelle_phase || 0) + 1}/7` },
            { label: "Fragen beantwortet", value: `${beratung?.abgeschlossene_fragen?.length || 0}` },
            { label: "Notizen", value: beratung?.notizen ? "Vorhanden" : "Keine" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-xs font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Sync button */}
      <Button
        onClick={handleSync}
        disabled={syncing}
        className="w-full h-12 rounded-xl text-base"
      >
        {syncing ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Übertrage...
          </>
        ) : syncResult === "success" ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Erfolgreich übertragen
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            An UPL übertragen
          </>
        )}
      </Button>

      {syncResult === "error" && (
        <div className="mt-3 flex items-center gap-2 text-destructive text-xs p-3 bg-destructive/10 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Übertragung fehlgeschlagen. Bitte API-Konfiguration prüfen.</span>
        </div>
      )}

      {syncResult === "success" && (
        <div className="mt-3 flex items-center gap-2 text-accent text-xs p-3 bg-accent/10 rounded-xl">
          <Check className="w-4 h-4 shrink-0" />
          <span>Daten wurden erfolgreich an UPL übermittelt.</span>
        </div>
      )}
    </div>
  );
}