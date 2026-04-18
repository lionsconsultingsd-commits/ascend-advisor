import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PHASEN_BY_TYPE, PFLICHTFRAGEN_BY_TYPE, GESPRAECHSTYPEN, EINWAENDE_BERATUNG1, EINWAENDE_CROSSSELLING } from "@/lib/beratungsData";

// Components
import GespraechsAuswahl from "@/components/beratung/GespraechsAuswahl";
import KontaktAuswahl from "@/components/beratung/KontaktAuswahl";
import ProgressBar from "@/components/beratung/ProgressBar";
import PhaseCard from "@/components/beratung/PhaseCard";
import EinwandPanel from "@/components/beratung/EinwandPanel";
import NotizenPanel from "@/components/beratung/NotizenPanel";
import UplPanel from "@/components/beratung/UplPanel";
import BottomNav from "@/components/beratung/BottomNav";
import ProtokollTabs from "@/components/beratung/ProtokollTabs";
import DoppelUnterschrift from "@/components/beratung/DoppelUnterschrift";
import SignaturePad from "@/components/beratung/SignaturePad";
import CrosssellingGuide from "@/components/beratung/CrosssellingGuide";
import EinnahmenAusgabenRechner from "@/components/beratung/EinnahmenAusgabenRechner";
import ZieleGuide from "@/components/beratung/ZieleGuide";
import VersorgungslueckenGuide from "@/components/beratung/VersorgungslueckenGuide";
import WorstCaseGuide from "@/components/beratung/WorstCaseGuide";
import ProduktPraesentationGuide from "@/components/beratung/ProduktPraesentationGuide";
import KundenInfoBanner from "@/components/beratung/KundenInfoBanner";
import ComplianceWarning, { COMPLIANCE_FRAGEN } from "@/components/beratung/ComplianceWarning";
import UplStatusSync from "@/components/beratung/UplStatusSync";
import BeratungsfortschrittBadge from "@/components/beratung/BeratungsfortschrittBadge";
import ThemeToggle from "@/components/ThemeToggle";
import { X, MoreVertical, CheckCircle, ExternalLink } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Apply saved theme
function useSavedTheme() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || !saved) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);
}

export default function Beratung() {
  const [screen, setScreen] = useState("auswahl"); // "auswahl" | "kontakt" | "beratung"
  const [selectedTyp, setSelectedTyp] = useState(null);
  const [activeBeratungId, setActiveBeratungId] = useState(null);
  const [activeTab, setActiveTab] = useState("leitfaden");
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

  useSavedTheme();

  useEffect(() => {
    base44.auth.me().then(setCurrentUser);
  }, []);

  const { data: beratungen = [] } = useQuery({
    queryKey: ["beratungen", currentUser?.email],
    queryFn: () =>
      currentUser
        ? base44.entities.Beratung.filter({ created_by: currentUser.email }, "-created_date", 10)
        : [],
    enabled: !!currentUser,
  });

  const activeBeratung = beratungen.find((b) => b.id === activeBeratungId);
  const gespraechstyp = GESPRAECHSTYPEN.find((t) => t.id === activeBeratung?.gespraechstyp) || GESPRAECHSTYPEN[1];
  const phasen = PHASEN_BY_TYPE[activeBeratung?.gespraechstyp || "beratung1"] || PHASEN_BY_TYPE.beratung1;
  const pflichtfragen = PFLICHTFRAGEN_BY_TYPE[activeBeratung?.gespraechstyp || "beratung1"] || PFLICHTFRAGEN_BY_TYPE.beratung1;

  // Einwände je nach Typ
  const einwaende = activeBeratung?.gespraechstyp === "crossselling" ? EINWAENDE_CROSSSELLING : EINWAENDE_BERATUNG1;

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Beratung.create(data),
    onSuccess: (newBeratung) => {
      queryClient.invalidateQueries({ queryKey: ["beratungen"] });
      setActiveBeratungId(newBeratung.id);
      setScreen("beratung");
      setActiveTab("leitfaden");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Beratung.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["beratungen"] }),
  });

  // Auto Pipeline-Update in UPL nach Abschluss
  const autoPipelineUpdate = async (beratung) => {
    if (!beratung?.upl_kontakt_id) return;
    const typ = GESPRAECHSTYPEN.find((t) => t.id === beratung.gespraechstyp);
    if (!typ?.upl_pipeline_ausgang) return;
    try {
      await base44.functions.invoke("uplUpdateKontakt", {
        kontakt_id: beratung.upl_kontakt_id,
        pipeline_status: typ.upl_pipeline_ausgang,
      });
    } catch (e) {
      console.error("Pipeline-Update fehlgeschlagen:", e);
    }
  };

  const handleStartBeratung = (kundeName, existingId, uplKontaktId, typId) => {
    if (existingId) {
      setActiveBeratungId(existingId);
      setScreen("beratung");
      setActiveTab("leitfaden");
    } else {
      createMutation.mutate({
        kunde_name: kundeName,
        upl_kontakt_id: uplKontaktId || null,
        gespraechstyp: typId || "beratung1",
        datum: new Date().toISOString().split("T")[0],
        aktuelle_phase: 0,
        abgeschlossene_fragen: [],
        notizen: "",
        status: "aktiv",
        upl_synced: false,
      });
    }
  };

  const handleUpdate = (data) => {
    if (!activeBeratungId) return;
    updateMutation.mutate({ id: activeBeratungId, data });
  };

  const handlePhaseChange = (newPhase) => {
    if (!activeBeratungId) return;
    logAudit(
      "Phasenwechsel",
      `Phase gewechselt von ${aktuellePhase + 1} zu ${newPhase + 1}`,
    );
    handleUpdate({ aktuelle_phase: newPhase });
  };

  // Audit-Trail loggen
  const logAudit = async (aktion, details, vorheriger_status = null, neuer_status = null) => {
    if (!activeBeratung) return;
    base44.functions.invoke("logAuditTrail", {
      beratung_id: activeBeratungId,
      kunde_name: activeBeratung.kunde_name,
      upl_kontakt_id: activeBeratung.upl_kontakt_id || null,
      aktion,
      details,
      vorheriger_status,
      neuer_status,
      phase: activeBeratung.aktuelle_phase,
      gespraechstyp: activeBeratung.gespraechstyp,
    }).catch(() => {});
  };

  const handleBeratungAbschliessen = async () => {
    await logAudit("Beratung abgeschlossen", "Beratung wurde als abgeschlossen markiert", "aktiv", "abgeschlossen");
    await updateMutation.mutateAsync({ id: activeBeratungId, data: { status: "abgeschlossen" } });
    await autoPipelineUpdate({ ...activeBeratung, status: "abgeschlossen" });
    setActiveBeratungId(null);
    setScreen("auswahl");
  };

  const handleBeenden = () => {
    setActiveBeratungId(null);
    setScreen("auswahl");
  };

  // ── SCREEN: Gesprächsauswahl ──────────────────────────────
  if (screen === "auswahl") {
    const recentActive = beratungen.filter((b) => b.status === "aktiv").slice(0, 5);
    return (
      <GespraechsAuswahl
        onSelect={(typ) => { setSelectedTyp(typ); setScreen("kontakt"); }}
        onStartBeratung={handleStartBeratung}
        recentBeratungen={recentActive}
      />
    );
  }

  // ── SCREEN: Kontaktauswahl ────────────────────────────────
  if (screen === "kontakt") {
    return (
      <KontaktAuswahl
        gespraechstyp={selectedTyp}
        onStart={handleStartBeratung}
        onBack={() => setScreen("auswahl")}
      />
    );
  }

  // ── SCREEN: Beratung ──────────────────────────────────────
  const aktuellePhase = activeBeratung?.aktuelle_phase || 0;
  const isCrossselling = activeBeratung?.gespraechstyp === "crossselling";
  const isAbschluss = activeBeratung?.gespraechstyp === "abschlussgespraech";
  const isErstgespraech = activeBeratung?.gespraechstyp === "erstgespraech";
  const isBeratung1 = activeBeratung?.gespraechstyp === "beratung1";

  // Compliance-Fragen für diesen Typ
  const complianceFragen = COMPLIANCE_FRAGEN[activeBeratung?.gespraechstyp || "beratung1"] || [];
  const complianceFragenIds = complianceFragen.map((f) => f.id);
  const abgeschlosseneFragenAll = activeBeratung?.abgeschlossene_fragen || [];
  const gesamtFragen = pflichtfragen.length + complianceFragen.length;
  const abgeschlossenCount = abgeschlosseneFragenAll.filter(
    (id) => pflichtfragen.some((f) => f.id === id) || complianceFragenIds.includes(id)
  ).length;

  // Tab-Labels je nach Gesprächstyp
  const tabLabel = {
    leitfaden: "Leitfaden",
    einwaende: isCrossselling ? "Crossselling" : "Einwände",
    protokoll: "Protokoll",
    unterschrift: "Unterschrift",
    upl: "UPL",
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleBeenden}
          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
          title="Zurück zur Übersicht"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{gespraechstyp.emoji}</span>
            <h1 className="text-sm font-bold truncate">{activeBeratung?.kunde_name}</h1>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-muted-foreground">
              {gespraechstyp.label} · Phase {aktuellePhase + 1}/{phasen.length}
            </p>
            <BeratungsfortschrittBadge
              aktuellePhase={aktuellePhase}
              gesamtPhasen={phasen.length}
              abgeschlosseneFragen={abgeschlossenCount}
              gesamtFragen={gesamtFragen}
            />
          </div>
        </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBeratungAbschliessen}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Abschließen & Pipeline aktualisieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Progress (nur Leitfaden-Tab) */}
      {activeTab === "leitfaden" && (
        <ProgressBar
          aktuellePhase={aktuellePhase}
          onPhaseClick={handlePhaseChange}
          phasen={phasen}
        />
      )}

      {activeTab !== "leitfaden" && (
        <div className="px-4 pt-3 pb-1">
          <h2 className="text-lg font-bold">
            {activeTab === "einwaende" && (isCrossselling ? "Crossselling Guide" : "Einwandbehandlung")}
            {activeTab === "upl" && "UPL Sync"}
            {activeTab === "protokoll" && "KI-Protokoll"}
            {activeTab === "unterschrift" && "Unterschrift"}
          </h2>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col pt-2">
        {activeTab === "leitfaden" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Kundenbanner + Compliance */}
            <KundenInfoBanner beratung={activeBeratung} />
            {aktuellePhase === 0 && (
              <ComplianceWarning
                gespraechstyp={activeBeratung?.gespraechstyp}
                abgeschlosseneFragen={activeBeratung?.abgeschlossene_fragen || []}
                onFrageToggle={(frageId) => {
                  const current = activeBeratung?.abgeschlossene_fragen || [];
                  const updated = current.includes(frageId) ? current.filter((id) => id !== frageId) : [...current, frageId];
                  handleUpdate({ abgeschlossene_fragen: updated });
                }}
              />
            )}
            <div className="flex-1 overflow-hidden flex flex-row gap-0">
            {/* Linke Hauptspalte: bei Erstgespräch Phase 3 = Rechner, sonst PhaseCard */}
            {isErstgespraech && aktuellePhase === 3 ? (
              <div className="flex-1 overflow-hidden flex flex-col min-w-0">
                <div className="px-3 pt-2 pb-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Finanzrechner</p>
                </div>
                <EinnahmenAusgabenRechner />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col min-w-0">
                <PhaseCard
                  aktuellePhase={aktuellePhase}
                  abgeschlosseneFragen={activeBeratung?.abgeschlossene_fragen || []}
                  onFrageToggle={(frageId) => {
                    const current = activeBeratung?.abgeschlossene_fragen || [];
                    const updated = current.includes(frageId) ? current.filter((id) => id !== frageId) : [...current, frageId];
                    handleUpdate({ abgeschlossene_fragen: updated });
                  }}
                  onWeiter={() => handlePhaseChange(Math.min(aktuellePhase + 1, phasen.length - 1))}
                  onZurueck={() => handlePhaseChange(Math.max(aktuellePhase - 1, 0))}
                  phasen={phasen}
                  pflichtfragen={pflichtfragen}
                />
              </div>
            )}
            <div className="w-px bg-border shrink-0" />
            <div className={`${(isErstgespraech && (aktuellePhase === 3 || aktuellePhase === 4)) || (isBeratung1 && (aktuellePhase === 1 || aktuellePhase === 2 || aktuellePhase === 3)) ? "w-96" : "w-64"} shrink-0 overflow-hidden flex flex-col transition-all duration-300`}>
              {/* Rechte Spalte: bei Erstgespräch Phase 3 = PhaseCard (Tipps), sonst Guides */}
              {isErstgespraech && aktuellePhase === 3 ? (
                <PhaseCard
                  aktuellePhase={aktuellePhase}
                  abgeschlosseneFragen={activeBeratung?.abgeschlossene_fragen || []}
                  onFrageToggle={(frageId) => {
                    const current = activeBeratung?.abgeschlossene_fragen || [];
                    const updated = current.includes(frageId) ? current.filter((id) => id !== frageId) : [...current, frageId];
                    handleUpdate({ abgeschlossene_fragen: updated });
                  }}
                  onWeiter={() => handlePhaseChange(Math.min(aktuellePhase + 1, phasen.length - 1))}
                  onZurueck={() => handlePhaseChange(Math.max(aktuellePhase - 1, 0))}
                  phasen={phasen}
                  pflichtfragen={pflichtfragen}
                />
              ) : isBeratung1 && aktuellePhase === 1 ? (
                <>
                  <div className="px-3 pt-2 pb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Versorgungslücken</p>
                  </div>
                  <VersorgungslueckenGuide />
                </>
              ) : isBeratung1 && aktuellePhase === 2 ? (

                /* Beratung 1 Phase 2 = Worst-Case Guide */
                <>
                  <div className="px-3 pt-2 pb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Worst-Case Szenarien</p>
                  </div>
                  <WorstCaseGuide />
                </>
              ) : isBeratung1 && aktuellePhase === 3 ? (
                /* Beratung 1 Phase 3 = Produktpräsentation Guide */
                <>
                  <div className="px-3 pt-2 pb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Präsentations-Guide</p>
                  </div>
                  <ProduktPraesentationGuide />
                </>
              ) : isErstgespraech && aktuellePhase === 4 ? (
                /* Erstgespräch Phase 4 = Ziele Guide */
                <>
                  <div className="px-3 pt-2 pb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ziele-Guide</p>
                  </div>
                  <ZieleGuide />
                </>
              ) : (
                <>
                  <div className="px-3 pt-2 pb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notizen</p>
                  </div>
                  <NotizenPanel notizen={activeBeratung?.notizen} onSave={(text) => handleUpdate({ notizen: text })} compact />
                </>
              )}

            </div>
          </div>
          </div>
        )}

        {activeTab === "einwaende" && (
          isCrossselling
            ? <CrosssellingGuide />
            : <EinwandPanel einwaende={einwaende} />
        )}

        {activeTab === "upl" && (
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Status in UPL direkt aktualisieren</p>
              <UplStatusSync
                beratung={activeBeratung}
                onSynced={(status) => {
                  handleUpdate({ upl_synced: true });
                  logAudit("UPL Status-Update", `Status auf "${status}" gesetzt`, null, status);
                }}
              />
            </div>
            <UplPanel beratung={activeBeratung} onSyncStatusChange={(synced) => handleUpdate({ upl_synced: synced })} />
          </div>
        )}

        {activeTab === "protokoll" && (
          <ProtokollTabs
            beratung={activeBeratung}
            onProtocolGenerated={(text) => handleUpdate({ protokoll_text: text, protokoll_datum: new Date().toISOString().split("T")[0] })}
          />
        )}

        {activeTab === "unterschrift" && (
          isAbschluss ? (
            <DoppelUnterschrift
              beratung={activeBeratung}
              onSignedBerater={(url) => handleUpdate({ unterschrift_berater_url: url })}
              onSignedKunde={(url) => handleUpdate({ unterschrift_url: url })}
            />
          ) : (
            <SignaturePad existingUrl={activeBeratung?.unterschrift_url} onSigned={(url) => handleUpdate({ unterschrift_url: url })} />
          )
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}