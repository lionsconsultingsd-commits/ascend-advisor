import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Check, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

function SinglePad({ label, onSigned, existingUrl }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(!!existingUrl);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const initCtx = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
    ctx.strokeStyle = `hsl(${fg})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return ctx;
  };

  const handleStart = (e) => {
    e.preventDefault();
    const ctx = initCtx();
    const pos = getPos(e, canvasRef.current);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);
    setIsEmpty(false);
    setSaved(false);
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const ctx = initCtx();
    const pos = getPos(e, canvasRef.current);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleEnd = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    setSaved(false);
  };

  const save = () => {
    if (isEmpty) return;
    setUploading(true);
    canvasRef.current.toBlob(async (blob) => {
      const file = new File([blob], "unterschrift.png", { type: "image/png" });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onSigned(file_url);
      setSaved(true);
      setUploading(false);
    }, "image/png");
  };

  return (
    <div className="bg-card border rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("de-DE")}</p>
      </div>
      {existingUrl && saved && (
        <img src={existingUrl} alt="Unterschrift" className="max-h-16 border rounded-xl bg-white p-1" />
      )}
      <div className="border-2 border-dashed border-border rounded-xl p-2">
        <canvas
          ref={canvasRef}
          width={300}
          height={100}
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
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={clear} className="flex-1 rounded-xl">
          <Eraser className="w-3 h-3 mr-1" /> Löschen
        </Button>
        <Button size="sm" onClick={save} disabled={isEmpty || uploading || saved} className="flex-1 rounded-xl">
          {uploading ? "…" : saved ? <><Check className="w-3 h-3 mr-1" /> Gespeichert</> : <><Upload className="w-3 h-3 mr-1" /> Speichern</>}
        </Button>
      </div>
    </div>
  );
}

export default function DoppelUnterschrift({ beratung, onSignedBerater, onSignedKunde }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Beide Parteien unterschreiben das Beratungsprotokoll digital.
      </p>
      <SinglePad
        label="Unterschrift Berater"
        existingUrl={beratung?.unterschrift_berater_url}
        onSigned={onSignedBerater}
      />
      <SinglePad
        label="Unterschrift Kunde"
        existingUrl={beratung?.unterschrift_url}
        onSigned={onSignedKunde}
      />
    </div>
  );
}