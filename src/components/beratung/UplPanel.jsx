import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Check, AlertCircle, Settings, User } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function UplPanel({ beratung, onSyncStatusChange }) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const hasUplKontakt = !!beratung?.upl_kontakt_id;

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      await base44.functions.invoke("uplUpdateKontakt", {
        kontakt_id: beratung.upl_kontakt_id,
        notizen: beratung.notizen || "",
        pipeline_status: ["beratung_abgeschlossen"],
      });

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
        Übertrage die Beratungsnotizen zurück an den UPL-Kontakt.
      </p>

      {/* Kontakt-Status */}
      <Card className="p-5 rounded-2xl mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasUplKontakt ? "bg-accent/10" : "bg-secondary"}`}>
            {hasUplKontakt ? (
              <User className="w-5 h-5 text-accent" />
            ) : (
              <Settings className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">
              {hasUplKontakt ? "UPL-Kontakt verknüpft" : "Kein UPL-Kontakt"}
            </p>
            <p className="text-xs text-muted-foreground">
              {hasUplKontakt
                ? beratung.kunde_name
                : "Beratung wurde manuell gestartet"}
            </p>
          </div>
        </div>

        {hasUplKontakt && (
          <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
            <p>• Notizen werden im Kontakt gespeichert</p>
            <p>• Pipeline-Status wird auf "Beratung abgeschlossen" gesetzt</p>
          </div>
        )}
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
        disabled={syncing || !hasUplKontakt}
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

      {!hasUplKontakt && (
        <p className="mt-3 text-xs text-center text-muted-foreground">
          Nur verfügbar wenn ein UPL-Kontakt verknüpft ist.
        </p>
      )}

      {syncResult === "error" && (
        <div className="mt-3 flex items-center gap-2 text-destructive text-xs p-3 bg-destructive/10 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Übertragung fehlgeschlagen. Bitte erneut versuchen.</span>
        </div>
      )}

      {syncResult === "success" && (
        <div className="mt-3 flex items-center gap-2 text-accent text-xs p-3 bg-accent/10 rounded-xl">
          <Check className="w-4 h-4 shrink-0" />
          <span>Notizen wurden erfolgreich an UPL übermittelt.</span>
        </div>
      )}
    </div>
  );
}