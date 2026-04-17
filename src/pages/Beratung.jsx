import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProgressBar from "@/components/beratung/ProgressBar";
import PhaseCard from "@/components/beratung/PhaseCard";
import EinwandPanel from "@/components/beratung/EinwandPanel";
import NotizenPanel from "@/components/beratung/NotizenPanel";
import UplPanel from "@/components/beratung/UplPanel";
import BottomNav from "@/components/beratung/BottomNav";
import StartDialog from "@/components/beratung/StartDialog";
import ProtocolGenerator from "@/components/beratung/ProtocolGenerator";
import LiveAufnahme from "@/components/beratung/LiveAufnahme";
import ProtokollTabs from "@/components/beratung/ProtokollTabs";
import SignaturePad from "@/components/beratung/SignaturePad";
import { X, MoreVertical, CheckCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Beratung() {
  const [activeBeratungId, setActiveBeratungId] = useState(null);
  const [activeTab, setActiveTab] = useState("leitfaden");
  const queryClient = useQueryClient();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser);
  }, []);

  // Fetch only own sessions
  const { data: beratungen = [] } = useQuery({
    queryKey: ["beratungen", currentUser?.email],
    queryFn: () =>
      currentUser
        ? base44.entities.Beratung.filter({ created_by: currentUser.email }, "-created_date", 10)
        : [],
    enabled: !!currentUser,
  });

  // Current session
  const activeBeratung = beratungen.find((b) => b.id === activeBeratungId);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Beratung.create(data),
    onSuccess: (newBeratung) => {
      queryClient.invalidateQueries({ queryKey: ["beratungen"] });
      setActiveBeratungId(newBeratung.id);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Beratung.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beratungen"] });
    },
  });

  const handleStart = (kundeName, existingId, uplKontaktId) => {
    if (existingId) {
      setActiveBeratungId(existingId);
    } else {
      createMutation.mutate({
        kunde_name: kundeName,
        upl_kontakt_id: uplKontaktId || null,
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

  const handlePhaseChange = (phase) => {
    handleUpdate({ aktuelle_phase: phase });
  };

  const handleFrageToggle = (frageId) => {
    const current = activeBeratung?.abgeschlossene_fragen || [];
    const updated = current.includes(frageId)
      ? current.filter((id) => id !== frageId)
      : [...current, frageId];
    handleUpdate({ abgeschlossene_fragen: updated });
  };

  const handleNotizenSave = (text) => {
    handleUpdate({ notizen: text });
  };

  const handleBeratungAbschliessen = () => {
    handleUpdate({ status: "abgeschlossen" });
    setActiveBeratungId(null);
  };

  const handleBeenden = () => {
    setActiveBeratungId(null);
  };

  // Apply saved theme on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || !saved) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Start screen
  if (!activeBeratungId) {
    const recentActive = beratungen.filter((b) => b.status === "aktiv").slice(0, 5);
    return <StartDialog onStart={handleStart} recentBeratungen={recentActive} />;
  }

  const aktuellePhase = activeBeratung?.aktuelle_phase || 0;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleBeenden}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold truncate">
              {activeBeratung?.kunde_name}
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Phase {aktuellePhase + 1}/7
            </p>
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
              Beratung abschließen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </header>

      {/* Progress (only on Leitfaden tab) */}
      {activeTab === "leitfaden" && (
        <ProgressBar
          aktuellePhase={aktuellePhase}
          onPhaseClick={handlePhaseChange}
        />
      )}

      {/* Tab header */}
      {activeTab !== "leitfaden" && (
        <div className="px-4 pt-3 pb-1">
          <h2 className="text-lg font-bold">
            {activeTab === "einwaende" && "Einwandbehandlung"}
            {activeTab === "upl" && "UPL Sync"}
            {activeTab === "protokoll" && "KI-Protokoll"}
            {activeTab === "unterschrift" && "Unterschrift"}
          </h2>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col pt-2">
        {activeTab === "leitfaden" && (
          <div className="flex-1 overflow-hidden flex flex-row gap-0">
            <div className="flex-1 overflow-hidden flex flex-col min-w-0">
              <PhaseCard
                aktuellePhase={aktuellePhase}
                abgeschlosseneFragen={activeBeratung?.abgeschlossene_fragen || []}
                onFrageToggle={handleFrageToggle}
                onWeiter={() => handlePhaseChange(Math.min(aktuellePhase + 1, 6))}
                onZurueck={() => handlePhaseChange(Math.max(aktuellePhase - 1, 0))}
              />
            </div>
            <div className="w-px bg-border shrink-0" />
            <div className="w-64 shrink-0 overflow-hidden flex flex-col">
              <div className="px-3 pt-2 pb-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notizen</p>
              </div>
              <NotizenPanel
                notizen={activeBeratung?.notizen}
                onSave={handleNotizenSave}
                compact
              />
            </div>
          </div>
        )}
        {activeTab === "einwaende" && <EinwandPanel />}
        {activeTab === "upl" && (
          <UplPanel
            beratung={activeBeratung}
            onSyncStatusChange={(synced) => handleUpdate({ upl_synced: synced })}
          />
        )}
        {activeTab === "protokoll" && (
          <ProtokollTabs
            beratung={activeBeratung}
            onProtocolGenerated={(text) =>
              handleUpdate({
                protokoll_text: text,
                protokoll_datum: new Date().toISOString().split("T")[0],
              })
            }
          />
        )}
        {activeTab === "unterschrift" && (
          <SignaturePad
            existingUrl={activeBeratung?.unterschrift_url}
            onSigned={(url) => handleUpdate({ unterschrift_url: url })}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}