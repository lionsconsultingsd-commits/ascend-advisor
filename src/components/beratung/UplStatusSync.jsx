import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const STATUS_OPTIONEN = [
  { label: "Im Beratungsprozess", value: "Im Beratungsprozess", emoji: "🔄" },
  { label: "Unterschrift fehlt", value: "Unterschrift fehlt", emoji: "✍️" },
  { label: "Unterschrift vorhanden", value: "Unterschrift vorhanden", emoji: "✅" },
  { label: "Abgeschlossen", value: "Abgeschlossen", emoji: "🏁" },
  { label: "Cross-Selling offen", value: "Cross-Selling offen", emoji: "⭐" },
  { label: "Wiedervorlage", value: "Wiedervorlage", emoji: "📅" },
];

export default function UplStatusSync({ beratung, onSynced }) {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  if (!beratung?.upl_kontakt_id) return null;

  const handleSync = async (status) => {
    setSelectedStatus(status);
    setSyncing(true);
    try {
      await base44.functions.invoke("uplUpdateKontakt", {
        kontakt_id: beratung.upl_kontakt_id,
        pipeline_status: status,
      });
      setSynced(true);
      if (onSynced) onSynced(status);
      setTimeout(() => setSynced(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  if (synced) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-600">
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-medium">Status aktualisiert: {selectedStatus}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 rounded-xl" disabled={syncing}>
          {syncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Status in UPL aktualisieren
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {STATUS_OPTIONEN.map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => handleSync(opt.value)}>
            <span className="mr-2">{opt.emoji}</span>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}