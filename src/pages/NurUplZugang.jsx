import React from "react";
import { ShieldAlert, ExternalLink } from "lucide-react";

export default function NurUplZugang() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Kein Zugang</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Das Beratungstool ist nur über Ihr UPL-Konto zugänglich. Bitte starten Sie die Beratung direkt aus einem Kontakt in UPL.
          </p>
        </div>
        <a
          href="https://app.base44.com/apps/69c140c42b1fc3201ee09f2a"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Zu UPL wechseln
        </a>
      </div>
    </div>
  );
}