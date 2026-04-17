import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, Copy, Check } from "lucide-react";

export default function SignaturLinkButton({ beratungId }) {
  const [copied, setCopied] = useState(false);

  const signatureUrl = `${window.location.origin}/?page=signatur&id=${beratungId}`;
  // Use hash-based deep link that works with react-router
  const link = `${window.location.origin}/signatur?id=${beratungId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium">Unterschriften-Link für Kunden:</p>
      <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
        <span className="text-xs text-muted-foreground flex-1 truncate">{link}</span>
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 h-7 w-7"
          onClick={handleCopy}
          title="Link kopieren"
        >
          {copied ? (
            <Check className="w-4 h-4 text-accent" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Sende diesen Link dem Kunden z.B. im Zoom-Chat – er kann dann direkt im Browser unterschreiben.
      </p>
    </div>
  );
}