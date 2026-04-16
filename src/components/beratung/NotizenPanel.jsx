import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Save, Check } from "lucide-react";

export default function NotizenPanel({ notizen, onSave }) {
  const [text, setText] = useState(notizen || "");
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setText(notizen || "");
  }, [notizen]);

  // Auto-save after 1.5s of inactivity
  useEffect(() => {
    if (text === notizen) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSave(text);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1500);
    return () => clearTimeout(timeoutRef.current);
  }, [text]);

  return (
    <div className="flex-1 flex flex-col px-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          Deine Gesprächsnotizen – werden automatisch gespeichert.
        </p>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-accent font-medium">
            <Check className="w-3 h-3" />
            Gespeichert
          </span>
        )}
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Hier Notizen eingeben...&#10;&#10;z.B. Kunde hat 2 Kinder, BU-Schutz gewünscht, Budget ca. 200€/Monat..."
        className="flex-1 min-h-[300px] rounded-2xl text-sm resize-none bg-card border shadow-sm p-4 focus:ring-primary"
      />
      <button
        onClick={() => {
          onSave(text);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
        className="mt-3 flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
      >
        <Save className="w-4 h-4" />
        Jetzt speichern
      </button>
    </div>
  );
}