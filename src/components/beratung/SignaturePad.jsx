import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Check, Upload, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SignaturePad({ onSigned, existingUrl }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(!!existingUrl);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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
        onSigned(file_url);
        setSaved(true);
      } catch (err) {
        setError("Fehler beim Speichern der Unterschrift.");
      } finally {
        setUploading(false);
      }
    }, "image/png");
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Der Kunde kann hier seine digitale Unterschrift leisten.
      </p>

      {existingUrl && saved && (
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-accent mb-2">Gespeicherte Unterschrift</p>
          <img src={existingUrl} alt="Unterschrift" className="max-h-24 border rounded-xl bg-white p-2" />
        </div>
      )}

      <div className="bg-card border-2 border-dashed border-border rounded-2xl p-2">
        <p className="text-xs text-center text-muted-foreground mb-2">Hier unterschreiben</p>
        <canvas
          ref={canvasRef}
          width={340}
          height={160}
          className="w-full rounded-xl bg-white touch-none cursor-crosshair"
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
          disabled={isEmpty || uploading || saved}
          className="flex-1 rounded-xl h-11"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Speichern…
            </span>
          ) : saved ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Gespeichert
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Unterschrift speichern
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}