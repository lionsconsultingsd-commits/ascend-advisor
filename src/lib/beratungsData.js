// Gesprächsleitfaden - Phasen
export const PHASEN = [
  {
    id: 0,
    titel: "Begrüßung & Rapport",
    kurz: "Begrüßung",
    icon: "HandShake",
    beschreibung: "Vertrauen aufbauen, Gesprächsrahmen setzen",
    tipps: [
      "Blickkontakt halten, lächeln",
      "Namen des Kunden verwenden",
      "Dauer & Ablauf kurz erklären",
      "Getränk anbieten"
    ]
  },
  {
    id: 1,
    titel: "Bedarfsanalyse",
    kurz: "Bedarf",
    icon: "Search",
    beschreibung: "Aktuelle Situation & Wünsche des Kunden verstehen",
    tipps: [
      "Offene Fragen stellen",
      "Aktiv zuhören & zusammenfassen",
      "Familienstand, Beruf, Einkommen erfragen",
      "Bestehende Verträge erfassen"
    ]
  },
  {
    id: 2,
    titel: "Risikoanalyse",
    kurz: "Risiko",
    icon: "Shield",
    beschreibung: "Absicherungslücken identifizieren",
    tipps: [
      "Worst-Case-Szenarien besprechen",
      "Prioritäten setzen lassen",
      "Gesundheitsfragen stellen",
      "Vorerkrankungen dokumentieren"
    ]
  },
  {
    id: 3,
    titel: "Lösungspräsentation",
    kurz: "Lösung",
    icon: "Lightbulb",
    beschreibung: "Passende Produkte vorstellen",
    tipps: [
      "Nutzen statt Features betonen",
      "Max. 2-3 Optionen anbieten",
      "Vergleiche visualisieren",
      "Preis-Leistung hervorheben"
    ]
  },
  {
    id: 4,
    titel: "Einwandbehandlung",
    kurz: "Einwände",
    icon: "MessageCircle",
    beschreibung: "Bedenken ernst nehmen & professionell entkräften",
    tipps: [
      "Einwand wertschätzen",
      "Nachfragen statt dagegen argumentieren",
      "Nutze die Einwand-Tools der App",
      "Emotionen ernst nehmen"
    ]
  },
  {
    id: 5,
    titel: "Abschluss",
    kurz: "Abschluss",
    icon: "FileCheck",
    beschreibung: "Zusammenfassung & Entscheidung herbeiführen",
    tipps: [
      "Zusammenfassung geben",
      "Alternativfrage stellen",
      "Unterschrift einholen",
      "Nächste Schritte erklären"
    ]
  },
  {
    id: 6,
    titel: "Nachbereitung",
    kurz: "Nachbereitung",
    icon: "ClipboardCheck",
    beschreibung: "Dokumentation & Follow-Up",
    tipps: [
      "Notizen vervollständigen",
      "Daten an UPL übertragen",
      "Follow-Up Termin vereinbaren",
      "Empfehlungsfrage stellen"
    ]
  }
];

// Pflichtfragen pro Phase
export const PFLICHTFRAGEN = [
  { id: "pf1", phase: 0, frage: "Wie sind Sie auf uns aufmerksam geworden?" },
  { id: "pf2", phase: 0, frage: "Datenschutzeinwilligung eingeholt?" },
  { id: "pf3", phase: 1, frage: "Familienstand & Kinder?" },
  { id: "pf4", phase: 1, frage: "Beruf & Einkommen?" },
  { id: "pf5", phase: 1, frage: "Bestehende Versicherungen?" },
  { id: "pf6", phase: 1, frage: "Welche Ziele & Wünsche hat der Kunde?" },
  { id: "pf7", phase: 2, frage: "Gesundheitszustand & Vorerkrankungen?" },
  { id: "pf8", phase: 2, frage: "Hobbys mit erhöhtem Risiko?" },
  { id: "pf9", phase: 2, frage: "Was passiert bei Berufsunfähigkeit?" },
  { id: "pf10", phase: 2, frage: "Haftpflichtrisiken besprochen?" },
  { id: "pf11", phase: 3, frage: "Budget des Kunden geklärt?" },
  { id: "pf12", phase: 3, frage: "Leistungsunterschiede erklärt?" },
  { id: "pf13", phase: 5, frage: "Widerrufsrecht erklärt?" },
  { id: "pf14", phase: 5, frage: "Beratungsprotokoll unterschrieben?" },
  { id: "pf15", phase: 6, frage: "Empfehlungsfrage gestellt?" },
  { id: "pf16", phase: 6, frage: "Nächster Kontakttermin vereinbart?" }
];

// 7 Häufigste Einwände mit Behandlung
export const EINWAENDE = [
  {
    id: "e1",
    einwand: "Das ist mir zu teuer",
    kategorie: "Preis",
    emoji: "💰",
    behandlung: [
      "Verständnis zeigen: „Ich verstehe, dass der Preis wichtig ist."",
      "Herunterbrechen: „Das sind nur X€ pro Tag – weniger als ein Kaffee."",
      "Gegenrechnung: „Was würde es kosten, KEINE Absicherung zu haben?"",
      "Alternative: „Wir können den Schutz anpassen, damit er ins Budget passt.""
    ]
  },
  {
    id: "e2",
    einwand: "Ich muss noch darüber nachdenken",
    kategorie: "Aufschieben",
    emoji: "🤔",
    behandlung: [
      "Wertschätzung: „Das ist verständlich, es ist eine wichtige Entscheidung."",
      "Konkretisieren: „Was genau möchten Sie noch bedenken?"",
      "Dringlichkeit: „Ihr Gesundheitszustand ist jetzt optimal – das kann sich ändern."",
      "Verbindlichkeit: „Soll ich Ihnen die Unterlagen mitgeben? Wann sprechen wir uns wieder?""
    ]
  },
  {
    id: "e3",
    einwand: "Ich habe schon einen Berater",
    kategorie: "Wettbewerb",
    emoji: "🤝",
    behandlung: [
      "Respekt: „Super, dass Sie bereits beraten werden."",
      "Mehrwert: „Eine Zweitmeinung kann nie schaden – kostenlos und unverbindlich."",
      "Check: „Wann wurde Ihr Schutz zuletzt überprüft?"",
      "Vergleich: „Oft gibt es Einsparpotential bei gleichem oder besserem Schutz.""
    ]
  },
  {
    id: "e4",
    einwand: "Das brauche ich nicht",
    kategorie: "Kein Bedarf",
    emoji: "🚫",
    behandlung: [
      "Nachfragen: „Was genau meinen Sie – den Schutz allgemein oder dieses Produkt?"",
      "Szenario: „Stellen Sie sich vor, morgen passiert X – wer zahlt dann?"",
      "Statistik: „Jeder 4. wird berufsunfähig – das Risiko ist real."",
      "Emotion: „Es geht um die Absicherung Ihrer Familie.""
    ]
  },
  {
    id: "e5",
    einwand: "Versicherungen zahlen sowieso nicht",
    kategorie: "Misstrauen",
    emoji: "😤",
    behandlung: [
      "Verstehen: „Das höre ich öfter – und manchmal stimmt es leider auch."",
      "Aufklärung: „Deswegen ist die richtige Produktwahl so wichtig."",
      "Qualität: „Ich arbeite nur mit Gesellschaften, die eine hohe Leistungsquote haben."",
      "Beispiele: „Die Leistungsquote bei BU liegt bei über 75% – mit guter Beratung noch höher.""
    ]
  },
  {
    id: "e6",
    einwand: "Mein Partner muss mitentscheiden",
    kategorie: "Dritte",
    emoji: "👫",
    behandlung: [
      "Verständnis: „Absolut, so eine Entscheidung trifft man gemeinsam."",
      "Zusammenfassen: „Soll ich Ihnen die wichtigsten Punkte zusammenfassen?"",
      "Einladen: „Gerne lade ich Ihren Partner zum nächsten Termin ein."",
      "Festhalten: „Halten wir fest, was Ihnen gefallen hat – das hilft beim Gespräch.""
    ]
  },
  {
    id: "e7",
    einwand: "Ich bin noch jung, das hat Zeit",
    kategorie: "Alter",
    emoji: "⏰",
    behandlung: [
      "Bestätigen: „Genau deswegen ist JETZT der beste Zeitpunkt!"",
      "Preis: „Je jünger, desto günstiger – der Beitrag steigt mit jedem Jahr."",
      "Gesundheit: „Jetzt sind Sie gesund – eine Vorerkrankung kann alles ändern."",
      "Zinseszins: „Bei der Altersvorsorge zählt jedes Jahr – der Zinseszinseffekt ist enorm.""
    ]
  }
];