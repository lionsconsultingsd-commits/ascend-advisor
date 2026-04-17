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
      'Ich verstehe Sie vollkommen – Preis ist ein wichtiger Faktor. Darf ich Ihnen kurz zeigen, was dahintersteckt?',
      'Wenn wir den Beitrag auf den Tag herunterrechnen, sind das gerade mal [X] € – das ist weniger als ein Kaffee am Morgen.',
      'Stellen Sie sich kurz vor: Was würde es Sie kosten, wenn Sie morgen nicht mehr arbeiten könnten und keine Absicherung hätten?',
      'Wir können den Schutz auch anpassen – welcher Betrag wäre für Sie monatlich angenehm?',
    ]
  },
  {
    id: "e2",
    einwand: "Ich muss noch darüber nachdenken",
    kategorie: "Aufschieben",
    emoji: "🤔",
    behandlung: [
      'Das ist absolut verständlich – es ist eine wichtige Entscheidung. Was genau möchten Sie noch bedenken? Vielleicht kann ich Ihnen dabei helfen.',
      'Gibt es etwas, das Ihnen noch nicht ganz klar ist, oder einen Punkt, bei dem Sie sich unsicher fühlen?',
      'Ich möchte Sie nur darauf hinweisen: Ihr Gesundheitszustand ist heute optimal. Das kann sich jederzeit ändern – und dann wird eine Absicherung deutlich teurer oder sogar unmöglich.',
      'Wann in etwa würden Sie sich eine Entscheidung vorstellen? Soll ich Ihnen die Unterlagen mitgeben und wir telefonieren in drei Tagen kurz nach?',
    ]
  },
  {
    id: "e3",
    einwand: "Ich habe schon einen Berater",
    kategorie: "Wettbewerb",
    emoji: "🤝",
    behandlung: [
      'Das ist sehr gut – zeigt, dass Sie das Thema ernst nehmen. Darf ich fragen, wann Sie zuletzt eine unabhängige Überprüfung hatten?',
      'Eine Zweitmeinung kostet Sie nichts und verpflichtet zu nichts. Viele meiner Kunden haben durch einen kurzen Vergleich bares Geld gespart.',
      'Gerade weil ich als unabhängiger Makler tätig bin, kann ich Angebote von über 200 Gesellschaften vergleichen – das kann kaum ein gebundener Vertreter.',
      'Wenn Sie am Ende sagen: Mein bisheriger Schutz ist top – perfekt. Aber falls wir etwas Besseres finden, wäre das doch gut zu wissen, oder?',
    ]
  },
  {
    id: "e4",
    einwand: "Das brauche ich nicht",
    kategorie: "Kein Bedarf",
    emoji: "🚫",
    behandlung: [
      'Ich höre Sie – darf ich kurz nachfragen: Meinen Sie, dass Sie grundsätzlich gut abgesichert sind, oder dass dieses spezifische Produkt nicht zu Ihnen passt?',
      'Stellen Sie sich vor: Sie werden morgen krank und können sechs Monate nicht arbeiten. Wie würden Sie in dieser Zeit Ihre Miete, Ihren Kredit, Ihren Lebensunterhalt finanzieren?',
      'Statistisch wird jeder vierte Arbeitnehmer in Deutschland mindestens einmal in seinem Leben berufsunfähig – das ist keine Seltenheit, das ist Realität.',
      'Es geht letztlich nicht um mich oder eine Versicherung – es geht darum, dass Ihre Familie und Sie im Ernstfall abgesichert sind. Das ist Ihre Entscheidung, und ich respektiere sie.',
    ]
  },
  {
    id: "e5",
    einwand: "Versicherungen zahlen sowieso nicht",
    kategorie: "Misstrauen",
    emoji: "😤",
    behandlung: [
      'Das höre ich öfter – und ich verstehe, warum viele das denken. Leider gibt es schwarze Schafe in der Branche. Genau deswegen ist die Wahl des richtigen Produkts und Anbieters so entscheidend.',
      'Ich arbeite ausschließlich mit Gesellschaften, die nachweislich hohe Leistungsquoten haben. Die kann ich Ihnen schwarz auf weiß zeigen.',
      'Bei Berufsunfähigkeitsversicherungen beispielsweise liegt die Leistungsquote bei seriösen Anbietern über 80 %. Das bedeutet: In 8 von 10 Fällen wird gezahlt.',
      'Meine Aufgabe ist es, den Antrag von Anfang an so sauber zu stellen, dass es im Leistungsfall keine Diskussion gibt. Dafür bin ich dann auch Ihr Ansprechpartner – nicht nur beim Abschluss.',
    ]
  },
  {
    id: "e6",
    einwand: "Mein Partner muss mitentscheiden",
    kategorie: "Dritte",
    emoji: "👫",
    behandlung: [
      'Das ist absolut richtig und zeigt, dass Sie als Team entscheiden – das finde ich sehr gut.',
      'Soll ich Ihnen eine kurze Zusammenfassung mitgeben, die Sie Ihrem Partner zeigen können? So hat er oder sie alle wichtigen Punkte auf einen Blick.',
      'Noch besser: Wie wäre es, wenn wir einen gemeinsamen Termin machen – gerne auch kurz per Video? So kann Ihr Partner direkt Fragen stellen.',
      'Was hat Ihnen persönlich heute am besten gefallen? Das können wir als Ausgangspunkt für das Gespräch mit Ihrem Partner nehmen.',
    ]
  },
  {
    id: "e7",
    einwand: "Ich bin noch jung, das hat Zeit",
    kategorie: "Alter",
    emoji: "⏰",
    behandlung: [
      'Genau das ist der Punkt – Sie sind jung! Und das ist der beste Vorteil, den Sie gerade haben. Nutzen wir ihn.',
      'Je früher Sie einsteigen, desto günstiger ist Ihr Beitrag. Mit jedem Jahr, das vergeht, zahlen Sie mehr – manchmal 10–15 % mehr pro Jahr.',
      'Und Ihre Gesundheit ist heute wahrscheinlich besser als in zehn Jahren. Vorerkrankungen, die später kommen, können Sie dann unter Umständen gar nicht mehr absichern.',
      'Bei der Altersvorsorge gilt: Jedes Jahr zählt doppelt. Wer mit 25 anfängt statt mit 35, zahlt oft die Hälfte für dasselbe Ergebnis – das ist Mathematik, kein Verkaufsgespräch.',
    ]
  }
];