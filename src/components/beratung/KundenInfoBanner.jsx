import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Phone, Tag, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function KundenInfoBanner({ beratung }) {
  const [kontakt, setKontakt] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!beratung?.upl_kontakt_id) return;
    base44.functions.invoke("uplGetKontaktDetail", { kontakt_id: beratung.upl_kontakt_id })
      .then((res) => {
        if (res.data?.kontakt) setKontakt(res.data.kontakt);
      })
      .catch(() => {});
  }, [beratung?.upl_kontakt_id]);

  if (!kontakt && !beratung?.upl_kontakt_id) return null;

  return (
    <div className="mx-4 mb-2 bg-card border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold truncate">{beratung?.kunde_name}</p>
          {kontakt?.status && (
            <p className="text-[11px] text-muted-foreground">UPL-Status: {kontakt.status}</p>
          )}
        </div>
        {kontakt && (expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />)}
      </button>

      {expanded && kontakt && (
        <div className="border-t px-4 py-3 space-y-2 bg-secondary/20">
          {kontakt.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{kontakt.phone}</span>
            </div>
          )}
          {kontakt.tags && kontakt.tags.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {kontakt.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}
          {kontakt.notes && (
            <div className="text-xs text-muted-foreground bg-card rounded-lg p-2 border">
              <span className="font-semibold text-foreground">Notizen: </span>{kontakt.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}