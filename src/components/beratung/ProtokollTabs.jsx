import React, { useState } from "react";
import { Mic, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import ProtocolGenerator from "./ProtocolGenerator";
import LiveAufnahme from "./LiveAufnahme";
import PdfDownloadButton from "@/components/beratung/PdfDownloadButton";

const TABS = [
  { id: "mikrofon", label: "Mikrofon", icon: Mic },
  { id: "live", label: "Externes Meeting", icon: Monitor },
];

export default function ProtokollTabs({ beratung, onProtocolGenerated }) {
  const [activeTab, setActiveTab] = useState("mikrofon");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-Tab-Header */}
      <div className="flex gap-2 px-4 pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* PDF Download – immer sichtbar wenn Protokoll vorhanden */}
      {beratung?.protokoll_text && (
        <div className="px-4 pb-2">
          <PdfDownloadButton beratung={beratung} />
        </div>
      )}

      {/* Content */}
      {activeTab === "mikrofon" && (
        <ProtocolGenerator
          beratung={beratung}
          onProtocolGenerated={onProtocolGenerated}
        />
      )}
      {activeTab === "live" && (
        <LiveAufnahme
          beratung={beratung}
          onProtocolGenerated={onProtocolGenerated}
        />
      )}
    </div>
  );
}