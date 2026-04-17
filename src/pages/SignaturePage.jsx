import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Check, Eraser, Upload, AlertCircle, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignaturePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const beratungId = urlParams.get("id");

  const [beratung, setBeratung] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [drawing, setDrawing] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    // Apply dark mode from localStorage
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || !saved) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (!beratungId) {
      setLoading(false);
      setError("Kein gültiger Beratungslink.");
      return;
    }
    base44.entities.Beratung.filter({ id: beratungId })
      .then((results) => {
        if (results && results.length > 0) {
          setBeratung(results[0]);
          if (results[0].unterschrift_url) setSaved(true);
        } else {
          setError("Beratung nicht gefunden.");
        }
      })
      .catch(() => setError("Fehler beim Laden der Beratung."))
      .finally(() => setLoading(false));
  }, [beratungId]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
    ctx.strokeStyle = `hsl(${fg})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [loading]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);
    setIsEmpty(false);
    setSaved(false);
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
    ctx.strokeStyle = `hsl(${fg})`;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleEnd = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    setSaved(false);
  };

  const saveSignature = async () => {
    if (isEmpty) return;
    setUploading(true);
    setError(null);
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "unterschrift.png", { type: "image/png" });
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        await base44.entities.Beratung.update(beratungId, { unterschrift_url: file_url });
        setBeratung((b) => ({ ...b, unterschrift_url: file_url }));
        setSaved(true);
      } catch (err) {
        setError("Fehler beim Speichern der Unterschrift.");
      } finally {
        setUploading(false);
      }
    }, "image/png");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !beratung) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-destructive font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-6 pt-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20 mb-3">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Beratungsprotokoll</h1>
          <p className="text-sm text-muted-foreground">
            Bitte unterschreiben Sie das Beratungsprotokoll digital.
          </p>
          {beratung?.kunde_name && (
            <p className="text-sm font-medium text-foreground mt-1">
              Kunde: <span className="text-primary">{beratung.kunde_name}</span>
            </p>
          )}
          {beratung?.datum && (
            <p className="text-xs text-muted-foreground">
              Datum: {new Date(beratung.datum).toLocaleDateString("de-DE")}
            </p>
          )}
        </div>

        {/* Already signed */}
        {saved && beratung?.unterschrift_url && (
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-accent font-semibold text-sm">
              <Check className="w-4 h-4" /> Unterschrift gespeichert
            </div>
            <img
              src={beratung.unterschrift_url}
              alt="Unterschrift"
              className="max-h-24 rounded-xl border bg-white p-2"
            />
            <p className="text-xs text-muted-foreground text-center">
              Vielen Dank! Ihre Unterschrift wurde erfolgreich übermittelt.
            </p>
          </div>
        )}

        {/* Signature Pad */}
        {!saved && (
          <>
            <div className="bg-card border-2 border-dashed border-border rounded-2xl p-3 space-y-2">
              <p className="text-xs text-center text-muted-foreground">Hier unterschreiben</p>
              <canvas
                ref={canvasRef}
                width={340}
                height={180}
                className="w-full rounded-xl bg-card touch-none cursor-crosshair"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-xs p-3 bg-destructive/10 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={clearCanvas} className="flex-1 rounded-xl h-11">
                <Eraser className="w-4 h-4 mr-2" />
                Löschen
              </Button>
              <Button
                onClick={saveSignature}
                disabled={isEmpty || uploading}
                className="flex-1 rounded-xl h-11"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Speichern…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Unterschrift senden
                  </span>
                )}
              </Button>
            </div>
          </>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Diese Seite wurde von Ihrem Berater für Sie bereitgestellt.
        </p>
      </div>
    </div>
  );
}