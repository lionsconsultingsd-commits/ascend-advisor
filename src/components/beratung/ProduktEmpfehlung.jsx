import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Loader2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Regelbasierte Sofort-Empfehlung (ohne KI) als Fallback
function getRegelEmpfehlungen(beratung) {
  const fragen = beratung?.abgeschlossene_fragen || [];
  const notizen = (beratung?.notizen || "").toLowerCase();
  const empfehlungen = [];

  // BU: Wenn Risikoanalyse oder Worst-Case BU relevant
  if (fragen.includes("b1_8") || fragen.includes("b1_9") || fragen.includes("b1_10") || notizen.includes("bu") || notizen.includes("berufsu")) {
    empfehlungen.push({
      emoji: "💼",
      produkt: "Berufsunfähigkeitsversicherung",
      grund: "Risikoanalyse zeigt erhöhten Absicherungsbedarf bei Berufsausfall.",
    });
  }

  // Risikoleben: Wenn Familie / Kredit im Gespräch
  if (notizen.includes("kredit") || notizen.includes("familie") || notizen.includes("kind") || notizen.includes("immobilie")) {
    empfehlungen.push({
      emoji: "❤️",
      produkt: "Risikolebensversicherung",
      grund: "Familie oder laufende Kredite machen eine Hinterbliebenenabsicherung sinnvoll.",
    });
  }

  // Pflege: Wenn Worst-Case Pflege oder Alter erwähnt
  if (notizen.includes("pflege") || notizen.includes("eltern") || notizen.includes("alter")) {
    empfehlungen.push({
      emoji: "👴",
      produkt: "Pflegeversicherung",
      grund: "Pflegethema wurde im Gespräch relevant – gesetzliche Leistung deckt nur ~40 %.",
    });
  }

  // Altersvorsorge: Wenn keine Rente/AV erwähnt
  if (notizen.includes("rente") || notizen.includes("altersvorsorge") || notizen.includes("av")) {
    empfehlungen.push({
      emoji: "🏦",
      produkt: "Altersvorsorge / bAV",
      grund: "Rentenlücke wurde thematisiert – staatliche Förderung und Arbeitgeberzuschuss nutzbar.",
    });
  }

  // Standard: Wenn nichts gefunden, die häufigsten Empfehlungen
  if (empfehlungen.length === 0) {
    empfehlungen.push(
      { emoji: "💼", produkt: "Berufsunfähigkeitsversicherung", grund: "Statistisch: Jeder 4. wird berufsunfähig – der wichtigste Basisschutz." },
      { emoji: "❤️", produkt: "Risikolebensversicherung", grund: "Günstiger Basisschutz für Familie und Kredit." }
    );
  }

  return empfehlungen.slice(0, 3);
}

export default function ProduktEmpfehlung({ beratung }) {
  const [empfehlungen, setEmpfehlungen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [kiGenutzt, setKiGenutzt] = useState(false);

  const generateEmpfehlungen = async () => {
    setLoading(true);
    try {
      const notizen = beratung?.notizen || "";
      const fragen = beratung?.abgeschlossene_fragen || [];

      const prompt = `Du bist ein erfahrener Versicherungsberater. Basierend auf folgenden Informationen aus einer Beratung, empfehle 2-3 konkrete Versicherungsprodukte.

Kundenname: ${beratung?.kunde_name || "unbekannt"}
Notizen des Beraters: "${notizen}"
Abgeschlossene Pflichtfragen: ${fragen.length} von möglichen Pflichtschritten

Gib genau 2-3 Produktempfehlungen zurück. Jede mit:
- Produkt: kurzer Produktname
- Emoji: ein passendes Emoji
- Grund: 1 Satz warum dieses Produkt zu diesem Kunden passt (konkret, nicht generisch)

Antworte NUR als JSON, kein anderer Text.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            empfehlungen: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  produkt: { type: "string" },
                  emoji: { type: "string" },
                  grund: { type: "string" },
                },
              },
            },
          },
        },
      });

      if (result?.empfehlungen?.length > 0) {
        setEmpfehlungen(result.empfehlungen.slice(0, 3));
        setKiGenutzt(true);
      } else {
        setEmpfehlungen(getRegelEmpfehlungen(beratung));
      }
    } catch (e) {
      // Fallback auf regelbasierte Empfehlungen
      setEmpfehlungen(getRegelEmpfehlungen(beratung));
    } finally {
      setLoading(false);
    }
  };

  // Wenn noch keine Empfehlungen: Schnellstart-Button
  if (!empfehlungen) {
    return (
      <div className="mb-4 bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-primary">Produktempfehlung für {beratung?.kunde_name || "diesen Kunden"}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Basierend auf Notizen & Beratungsverlauf – passende Produkte in Sekunden.
        </p>
        <Button
          size="sm"
          className="w-full gap-2"
          onClick={generateEmpfehlungen}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analysiere Beratung...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Empfehlung generieren
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-card border rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">
            Empfohlene Produkte
          </span>
          {kiGenutzt && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">KI</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setEmpfehlungen(null); setKiGenutzt(false); }}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            neu
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Empfehlungen */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {empfehlungen.map((e, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-secondary/30 rounded-xl p-3"
            >
              <span className="text-xl shrink-0 mt-0.5">{e.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{e.produkt}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{e.grund}</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground text-center pt-1">
            Basierend auf Notizen & Beratungsverlauf
          </p>
        </div>
      )}
    </div>
  );
}