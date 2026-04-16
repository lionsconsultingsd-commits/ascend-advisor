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
import { X, MoreVertical, CheckCircle } from "lucide-react";
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

  // Fetch recent sessions
  const { data: beratungen = [] } = useQuery({
    queryKey: ["beratungen"],
    queryFn: () => base44.entities.Beratung.list("-created_date", 10),
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

  const handleStart = (kundeName, existingId) => {
    if (existingId) {
      setActiveBeratungId(existingId);
    } else {
      createMutation.mutate({
        kunde_name: kundeName,
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
            {activeTab === "notizen" && "Notizen"}
            {activeTab === "upl" && "UPL Sync"}
          </h2>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col pt-2">
        {activeTab === "leitfaden" && (
          <PhaseCard
            aktuellePhase={aktuellePhase}
            abgeschlosseneFragen={activeBeratung?.abgeschlossene_fragen || []}
            onFrageToggle={handleFrageToggle}
            onWeiter={() => handlePhaseChange(Math.min(aktuellePhase + 1, 6))}
            onZurueck={() => handlePhaseChange(Math.max(aktuellePhase - 1, 0))}
          />
        )}
        {activeTab === "einwaende" && <EinwandPanel />}
        {activeTab === "notizen" && (
          <NotizenPanel
            notizen={activeBeratung?.notizen}
            onSave={handleNotizenSave}
          />
        )}
        {activeTab === "upl" && (
          <UplPanel
            beratung={activeBeratung}
            onSyncStatusChange={(synced) => handleUpdate({ upl_synced: synced })}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}