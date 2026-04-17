import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Square, Loader2, FileText, Check, AlertCircle, Mic } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

export default function LiveAufnahme({ beratung, onProtocolGenerated }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [protokoll, setProtokoll] = useState(beratung?.protokoll_text || "");
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];

    // Bildschirm + System-Audio aufnehmen
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        sampleRate: 44100,
      },
    });

    // Nur Audio-Track verwenden
    const audioTracks = displayStream.getAudioTracks();
    if (audioTracks.length === 0) {
      displayStream.getTracks().forEach((t) => t.stop());
      setError(
        'Kein Audio gefunden. Bitte aktiviere beim Teilen den Haken "Systemton teilen".'
      );
      return;
    }

    // Optionaler Mikrofon-Stream zum Mischen
    let micStream = null;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      // Mikrofon optional – weiter ohne
    }

    // Audio-Kontext zum Mischen beider Quellen
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const sysSource = audioContext.createMediaStreamSource(
      new MediaStream(audioTracks)
    );
    sysSource.connect(destination);

    if (micStream) {
      const micSource = audioContext.createMediaStreamSource(micStream);
      micSource.connect(destination);
    }

    const mixedStream = destination.stream;
    streamRef.current = { displayStream, micStream, audioContext };

    const mediaRecorder = new MediaRecorder(mixedStream, {
      mimeType: "audio/webm",
    });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    // Wenn Nutzer Screen-Share stoppt
    displayStream.getVideoTracks()[0]?.addEventListener("ended", () => {
      if (recording || mediaRecorderRef.current?.state === "recording") {
        handleStop();
      }
    });

    mediaRecorder.start(500);
    setRecording(true);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const handleStop = () => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
        return;
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        // Alle Streams stoppen
        const { displayStream, micStream, audioContext } = streamRef.current || {};
        displayStream?.getTracks().forEach((t) => t.stop());
        micStream?.getTracks().forEach((t) => t.stop());
        audioContext?.close();
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
    const blob = await handleStop();

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
        Teile den Bildschirm mit Systemton (z.B. Zoom) – die KI transkribiert das
        Gespräch und erstellt automatisch ein Beratungsprotokoll.
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
          <div className="flex flex-col items-center gap-3 w-full">
            <Button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/30"
              size="icon"
            >
              <Monitor className="w-7 h-7" />
            </Button>
            <div className="bg-secondary/60 rounded-xl p-3 text-xs text-muted-foreground w-full space-y-1">
              <p className="font-semibold text-foreground text-center mb-1">So geht's:</p>
              <p>1. Klick auf den Button oben</p>
              <p>2. Zoom-Fenster (oder Tab) auswählen</p>
              <p>
                3. Haken bei <span className="font-semibold">"Systemton teilen"</span> setzen
              </p>
              <p>4. Meeting starten – die App nimmt alles auf</p>
              <p>5. Stop drücken → Protokoll wird generiert</p>
            </div>
          </div>
        )}

        {recording && (
          <Button
            onClick={handleStopAndGenerate}
            className="w-16 h-16 rounded-full bg-destructive shadow-lg shadow-destructive/30"
            size="icon"
          >
            <Square className="w-7 h-7" />
          </Button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Transkription & Protokoll wird generiert…</p>
          </div>
        )}

        {recording && (
          <p className="text-xs text-muted-foreground text-center">
            Stoppe die Aufnahme um das Protokoll zu generieren
          </p>
        )}
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