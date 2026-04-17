import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, FileText, Check, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function ProtocolGenerator({ beratung, onProtocolGenerated, onCrmSynced }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [protokoll, setProtokoll] = useState(beratung?.protokoll_text || "");
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.start(500);
    setRecording(true);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
        resolve(blob);
      };
      mediaRecorder.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    });
  };

  const handleStopAndGenerate = async () => {
    setLoading(true);
    setError(null);
    const blob = await stopRecording();

    // Blob → Base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        const res = await base44.functions.invoke("generateBeratungProtocol", {
          audio_base64: base64,
          beratung_id: beratung?.id,
          kunde_name: beratung?.kunde_name,
          phase: `Phase ${(beratung?.aktuelle_phase || 0) + 1}`,
          notizen: beratung?.notizen || "",
          abgeschlossene_fragen: beratung?.abgeschlossene_fragen || [],
          upl_kontakt_id: beratung?.upl_kontakt_id || null,
        });

        const { protokoll: generiertes, crm_synced } = res.data;
        setProtokoll(generiertes);
        onProtocolGenerated(generiertes);
        if (crm_synced && onCrmSynced) onCrmSynced();
      } catch (err) {
        setError("Fehler bei der Protokollerstellung. Bitte erneut versuchen.");
      } finally {
        setLoading(false);
      }
    };
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Nehme das Gespräch auf – die KI erstellt daraus automatisch ein Beratungsprotokoll.
      </p>

      {/* Aufnahme-Steuerung */}
      <div className="bg-card border rounded-2xl p-5 flex flex-col items-center gap-4">
        {recording && (
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            Aufnahme läuft · {formatTime(seconds)}
          </div>
        )}

        {!recording && !loading && (
          <Button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/30"
            size="icon"
          >
            <Mic className="w-7 h-7" />
          </Button>
        )}

        {recording && (
          <Button
            onClick={handleStopAndGenerate}
            className="w-16 h-16 rounded-full bg-destructive shadow-lg shadow-destructive/30"
            size="icon"
          >
            <MicOff className="w-7 h-7" />
          </Button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Protokoll wird generiert…</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {recording
            ? "Stoppe die Aufnahme um das Protokoll zu generieren"
            : loading
            ? ""
            : "Drücke den Knopf um die Aufnahme zu starten"}
        </p>
      </div>

      {/* Fehler */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-xs p-3 bg-destructive/10 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Protokoll-Anzeige */}
      {protokoll && (
        <div className="bg-card border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Generiertes Protokoll</h3>
            <span className="ml-auto flex items-center gap-1 text-xs text-accent">
              <Check className="w-3 h-3" /> {beratung?.upl_kontakt_id ? "Gespeichert & ins CRM übertragen" : "Gespeichert"}
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed">
            <ReactMarkdown>{protokoll}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}