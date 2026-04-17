import React from "react";
import { cn } from "@/lib/utils";
import { Route, MessageCircle, StickyNote, Upload, Mic, PenLine } from "lucide-react";

const TABS = [
  { id: "leitfaden", label: "Leitfaden", icon: Route },
  { id: "einwaende", label: "Einwände", icon: MessageCircle },
  { id: "notizen", label: "Notizen", icon: StickyNote },
  { id: "protokoll", label: "Protokoll", icon: Mic },
  { id: "unterschrift", label: "Unterschrift", icon: PenLine },
  { id: "upl", label: "UPL", icon: Upload },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="flex items-center border-t bg-card/80 backdrop-blur-lg px-2 pb-safe">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5 transition-all",
                isActive && "scale-110"
              )}
            />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}