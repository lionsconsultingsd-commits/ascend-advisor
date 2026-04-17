import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PdfDownloadButton({ beratung }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasProtokoll = !!beratung?.protokoll_text;

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("generatePdfProtocol", {
        protokoll_text: beratung.protokoll_text,
        unterschrift_url: beratung.unterschrift_url || null,
        kunde_name: beratung.kunde_name,
        datum: beratung.datum || new Date().toLocaleDateString("de-DE"),
      });

      const { pdf_base64 } = res.data;
      const a = document.createElement("a");
      a.href = pdf_base64;
      a.download = `Beratungsprotokoll_${(beratung.kunde_name || "Kunde").replace(/\s+/g, "_")}.pdf`;
      a.click();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={!hasProtokoll || loading}
        variant="outline"
        className="w-full h-11 rounded-xl gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            PDF wird erstellt…
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Protokoll als PDF herunterladen
            {beratung?.unterschrift_url ? (
              <span className="text-xs text-accent ml-1">(mit Unterschrift)</span>
            ) : (
              <span className="text-xs text-muted-foreground ml-1">(ohne Unterschrift – für Insign)</span>
            )}
          </>
        )}
      </Button>
      {!hasProtokoll && (
        <p className="text-xs text-center text-muted-foreground">
          Zuerst ein Protokoll generieren
        </p>
      )}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-xs p-2 bg-destructive/10 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}