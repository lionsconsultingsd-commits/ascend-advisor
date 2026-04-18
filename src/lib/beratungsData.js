// ============================================================
// GESPRÄCHSTYPEN
// ============================================================
export const GESPRAECHSTYPEN = [
  {
    id: "erstgespraech",
    label: "Erstgespräch",
    emoji: "👋",
    beschreibung: "Kennenlernen & erste Bedarfsaufnahme",
    farbe: "from-blue-500 to-blue-600",
    upl_pipeline_eingang: "Lead",
    upl_pipeline_ausgang: "Erstgespräch abgeschlossen",
  },
  {
    id: "beratung1",
    label: "Beratung 1",
    emoji: "📋",
    beschreibung: "Tiefe Bedarfsanalyse & Produktpräsentation",
    farbe: "from-violet-500 to-violet-600",
    upl_pipeline_eingang: "Erstgespräch abgeschlossen",
    upl_pipeline_ausgang: "Beratung 1 abgeschlossen",
  },
  {
    id: "beratung2",
    label: "Beratung 2",
    emoji: "🔍",
    beschreibung: "Offene Punkte klären & Angebot finalisieren",
    farbe: "from-indigo-500 to-indigo-600",
    upl_pipeline_eingang: "Beratung 1 abgeschlossen",
    upl_pipeline_ausgang: "Beratung 2 abgeschlossen",
  },
  {
    id: "abschlussgespraech",
    label: "Abschlussgespräch",
    emoji: "✅",
    beschreibung: "Vertrag abschließen & Dokumentation",
    farbe: "from-emerald-500 to-emerald-600",
    upl_pipeline_eingang: "Beratung 2 abgeschlossen",
    upl_pipeline_ausgang: "Abgeschlossen",
  },
  {
    id: "crossselling",
    label: "Crossselling",
    emoji: "⭐",
    beschreibung: "Zusatzprodukte & Erweiterungen platzieren",
    farbe: "from-amber-500 to-amber-600",
    upl_pipeline_eingang: "Abgeschlossen",
    upl_pipeline_ausgang: "Crossselling abgeschlossen",
  },
];

// ============================================================
// PHASEN PRO GESPRÄCHSTYP
// ============================================================

export const PHASEN_BY_TYPE = {
  erstgespraech: [
    { id: 0, titel: "Begrüßung & Vertrauen", kurz: "Begrüßung", beschreibung: "Ersten guten Eindruck hinterlassen", tipps: ["Herzlich willkommen heißen", "Sich vorstellen und Agentur vorstellen", "Getränk anbieten", "Entspannte Atmosphäre schaffen"] },
    { id: 1, titel: "Datenschutz & Einwilligung", kurz: "Datenschutz", beschreibung: "Rechtliche Grundlage schaffen", tipps: ["Datenschutzerklärung vorlegen", "Einwilligung zur Kontaktaufnahme einholen", "Courageously erklären was gespeichert wird"] },
    { id: 2, titel: "Erste Bedarfsaufnahme", kurz: "Bedarf", beschreibung: "Grundlegende Lebenssituation erfassen", tipps: ["Familienstand & Kinder erfragen", "Beruf und Arbeitgeber notieren", "Grobe Einkommenssituation erfassen"] },
    { id: 3, titel: "Interesse wecken", kurz: "Interesse", beschreibung: "Relevanz der Absicherung verdeutlichen", tipps: ["Kurze Situation schildern – ohne zu verkaufen", "Auf einen wichtigsten Punkt fokussieren", "Neugier für Beratung 1 wecken"] },
    { id: 4, titel: "Nächster Termin", kurz: "Termin", beschreibung: "Beratung 1 vereinbaren", tipps: ["Konkreten Termin vorschlagen", "Ort und Format klären (persönlich/online)", "Kunden um Unterlagen bitten (Verträge etc.)"] },
  ],

  beratung1: [
    { id: 0, titel: "Begrüßung & Rückblick", kurz: "Begrüßung", beschreibung: "An Erstgespräch anknüpfen", tipps: ["Kurzes Recap des Erstgesprächs", "Fragen seit letztem Termin klären", "Agenda für heute vorstellen"] },
    { id: 1, titel: "Tiefe Bedarfsanalyse", kurz: "Analyse", beschreibung: "Alle relevanten Lebensbereiche durchgehen", tipps: ["Offene Fragen nutzen", "Prioritäten des Kunden herausarbeiten", "Lücken in bestehenden Verträgen identifizieren"] },
    { id: 2, titel: "Risikoanalyse", kurz: "Risiko", beschreibung: "Persönliche Risikosituation bewerten", tipps: ["Gesundheitsfragen sensibel ansprechen", "Hobbys & Risiken erfassen", "Worst-Case durchdenken"] },
    { id: 3, titel: "Produktpräsentation", kurz: "Lösung", beschreibung: "Passende Lösungen vorstellen", tipps: ["Max. 2-3 Optionen zeigen", "Nutzen statt Features", "Preis-Leistung visualisieren"] },
    { id: 4, titel: "Einwandbehandlung", kurz: "Einwände", beschreibung: "Bedenken professionell entkräften", tipps: ["Einwände wertschätzen", "Nachfragen statt dagegen argumentieren", "Vorlage nutzen"] },
    { id: 5, titel: "Zusammenfassung & Ausblick", kurz: "Ausblick", beschreibung: "Offene Fragen für Beratung 2 festhalten", tipps: ["Was ist noch offen?", "Kunden selbst zusammenfassen lassen", "Termin für Beratung 2 vereinbaren"] },
  ],

  beratung2: [
    { id: 0, titel: "Rückblick Beratung 1", kurz: "Rückblick", beschreibung: "Offene Punkte aus Beratung 1 aufgreifen", tipps: ["Was war noch offen?", "Hat der Kunde Rückfragen?", "Unterlagen geprüft?"] },
    { id: 1, titel: "Offene Fragen klären", kurz: "Klärung", beschreibung: "Alle ungeklärten Punkte abarbeiten", tipps: ["Systematisch alle Notizen durchgehen", "Keine wichtigen Punkte überspringen"] },
    { id: 2, titel: "Angebot verfeinern", kurz: "Angebot", beschreibung: "Konkretes Angebot ausarbeiten", tipps: ["Budget nochmals bestätigen", "Varianten vergleichen", "Konditionen erklären"] },
    { id: 3, titel: "Finale Einwände", kurz: "Einwände", beschreibung: "Letzte Bedenken ausräumen", tipps: ["Aktiv nach Bedenken fragen", "Entscheidungshelfer anbieten", "Keine Drucksituation aufbauen"] },
    { id: 4, titel: "Entscheidung vorbereiten", kurz: "Entscheidung", beschreibung: "Abschlussgespräch vorbereiten", tipps: ["Zusammenfassung geben", "Abschluss-Termin vereinbaren", "Ggf. Partner einladen"] },
  ],

  abschlussgespraech: [
    { id: 0, titel: "Finale Bestätigung", kurz: "Bestätigung", beschreibung: "Entscheidung des Kunden final abholen", tipps: ["Nochmals alle Konditionen zusammenfassen", "Fragen beantworten", "Positive Stimmung aufbauen"] },
    { id: 1, titel: "Vertragsunterzeichnung", kurz: "Vertrag", beschreibung: "Antrag ausfüllen und unterschreiben", tipps: ["Antrag gemeinsam durchgehen", "Gesundheitsfragen korrekt beantworten", "Unterschrift des Kunden einholen"] },
    { id: 2, titel: "Beratungsdokumentation", kurz: "Dokumentation", beschreibung: "Vollständiges Beratungsprotokoll erstellen", tipps: ["Alle Gespräche zusammenfassen", "Unterschrift Berater & Kunde einholen", "Datum dokumentieren"] },
    { id: 3, titel: "Widerrufsrecht & Ausblick", kurz: "Ausblick", beschreibung: "Rechtliches erklären & Empfehlung", tipps: ["Widerrufsrecht 14 Tage erklären", "Empfehlungsfrage stellen", "Nächste Schritte kommunizieren"] },
  ],

  crossselling: [
    { id: 0, titel: "Beziehungscheck", kurz: "Check", beschreibung: "Zufriedenheit & Vertrauen prüfen", tipps: ["Wie läuft der bestehende Vertrag?", "Gibt es Änderungen in der Lebenssituation?", "Positives Feedback einholen"] },
    { id: 1, titel: "Zusatzbedarf identifizieren", kurz: "Bedarf", beschreibung: "Weitere Lücken und Chancen finden", tipps: ["Checkliste Zusatzprodukte durchgehen", "Auf Lebensveränderungen eingehen", "Natur-liche Übergänge nutzen"] },
    { id: 2, titel: "Produkt platzieren", kurz: "Platzierung", beschreibung: "Zusatzprodukt vorstellen & erklären", tipps: ["Kurz & knapp erklären", "Direkten Nutzen aufzeigen", "Bestehende Kundendaten nutzen"] },
    { id: 3, titel: "Einwände Crossselling", kurz: "Einwände", beschreibung: "Spezifische Crossselling-Einwände behandeln", tipps: ["Andere Einwände als beim Erstabschluss", "Vertrauen als Basis nutzen", "Vorlage nutzen"] },
    { id: 4, titel: "Abschluss & Dokumentation", kurz: "Abschluss", beschreibung: "Zusatzprodukt abschließen und dokumentieren", tipps: ["Antrag ausfüllen", "Unterschrift einholen", "Protokoll erstellen"] },
  ],
};

// Legacy-Export für Rückwärtskompatibilität
export const PHASEN = PHASEN_BY_TYPE.beratung1;

// ============================================================
// PFLICHTFRAGEN PRO GESPRÄCHSTYP
// ============================================================
export const PFLICHTFRAGEN_BY_TYPE = {
  erstgespraech: [
    { id: "eg1", phase: 0, frage: "Begrüßung & Vorstellung abgeschlossen?" },
    { id: "eg2", phase: 1, frage: "Datenschutzeinwilligung eingeholt?" },
    { id: "eg3", phase: 1, frage: "Kontaktdaten vollständig erfasst?" },
    { id: "eg4", phase: 2, frage: "Familienstand & Kinder erfasst?" },
    { id: "eg5", phase: 2, frage: "Beruf & Arbeitgeber notiert?" },
    { id: "eg6", phase: 4, frage: "Nächster Termin (Beratung 1) vereinbart?" },
  ],
  beratung1: [
    { id: "b1_1", phase: 1, frage: "Familienstand & Kinder?" },
    { id: "b1_2", phase: 1, frage: "Beruf & Einkommen?" },
    { id: "b1_3", phase: 1, frage: "Bestehende Versicherungen?" },
    { id: "b1_4", phase: 1, frage: "Welche Ziele & Wünsche hat der Kunde?" },
    { id: "b1_5", phase: 2, frage: "Gesundheitszustand & Vorerkrankungen?" },
    { id: "b1_6", phase: 2, frage: "Hobbys mit erhöhtem Risiko?" },
    { id: "b1_7", phase: 2, frage: "Was passiert bei Berufsunfähigkeit?" },
    { id: "b1_8", phase: 2, frage: "Haftpflichtrisiken besprochen?" },
    { id: "b1_9", phase: 3, frage: "Budget des Kunden geklärt?" },
    { id: "b1_10", phase: 3, frage: "Leistungsunterschiede erklärt?" },
    { id: "b1_11", phase: 5, frage: "Offene Punkte für Beratung 2 notiert?" },
    { id: "b1_12", phase: 5, frage: "Termin Beratung 2 vereinbart?" },
  ],
  beratung2: [
    { id: "b2_1", phase: 0, frage: "Alle offenen Fragen aus Beratung 1 besprochen?" },
    { id: "b2_2", phase: 1, frage: "Unterlagen des Kunden geprüft?" },
    { id: "b2_3", phase: 2, frage: "Budget final bestätigt?" },
    { id: "b2_4", phase: 2, frage: "Konkretes Angebot vorgestellt?" },
    { id: "b2_5", phase: 4, frage: "Termin Abschlussgespräch vereinbart?" },
  ],
  abschlussgespraech: [
    { id: "ag1", phase: 0, frage: "Alle Konditionen nochmals zusammengefasst?" },
    { id: "ag2", phase: 1, frage: "Antrag vollständig ausgefüllt?" },
    { id: "ag3", phase: 1, frage: "Gesundheitsfragen korrekt beantwortet?" },
    { id: "ag4", phase: 1, frage: "Unterschrift des Kunden eingeholt?" },
    { id: "ag5", phase: 2, frage: "Beratungsprotokoll vollständig?" },
    { id: "ag6", phase: 2, frage: "Unterschrift Berater & Kunde auf Protokoll?" },
    { id: "ag7", phase: 3, frage: "Widerrufsrecht (14 Tage) erklärt?" },
    { id: "ag8", phase: 3, frage: "Empfehlungsfrage gestellt?" },
  ],
  crossselling: [
    { id: "cs1", phase: 0, frage: "Zufriedenheit mit bestehendem Vertrag geprüft?" },
    { id: "cs2", phase: 1, frage: "Lebenssituation auf Änderungen geprüft?" },
    { id: "cs3", phase: 2, frage: "Zusatzprodukt erklärt & Nutzen dargestellt?" },
    { id: "cs4", phase: 4, frage: "Antrag für Zusatzprodukt ausgefüllt?" },
    { id: "cs5", phase: 4, frage: "Dokumentation erstellt & unterschrieben?" },
  ],
};

export const PFLICHTFRAGEN = PFLICHTFRAGEN_BY_TYPE.beratung1;

// ============================================================
// EINWÄNDE BERATUNG 1 (vollständig)
// ============================================================
export const EINWAENDE_BERATUNG1 = [
  {
    id: "e1", einwand: "Das ist mir zu teuer", kategorie: "Preis", emoji: "💰",
    behandlung: [
      'Ich verstehe Sie vollkommen – Preis ist ein wichtiger Faktor. Darf ich Ihnen kurz zeigen, was dahintersteckt?',
      'Wenn wir den Beitrag auf den Tag herunterrechnen, sind das gerade mal [X] € – das ist weniger als ein Kaffee am Morgen.',
      'Stellen Sie sich kurz vor: Was würde es Sie kosten, wenn Sie morgen nicht mehr arbeiten könnten und keine Absicherung hätten?',
      'Wir können den Schutz auch anpassen – welcher Betrag wäre für Sie monatlich angenehm?',
    ]
  },
  {
    id: "e2", einwand: "Ich muss noch darüber nachdenken", kategorie: "Aufschieben", emoji: "🤔",
    behandlung: [
      'Das ist absolut verständlich – es ist eine wichtige Entscheidung. Was genau möchten Sie noch bedenken? Vielleicht kann ich Ihnen dabei helfen.',
      'Gibt es etwas, das Ihnen noch nicht ganz klar ist, oder einen Punkt, bei dem Sie sich unsicher fühlen?',
      'Ich möchte Sie nur darauf hinweisen: Ihr Gesundheitszustand ist heute optimal. Das kann sich jederzeit ändern – und dann wird eine Absicherung deutlich teurer oder sogar unmöglich.',
      'Wann in etwa würden Sie sich eine Entscheidung vorstellen? Soll ich Ihnen die Unterlagen mitgeben und wir telefonieren in drei Tagen kurz nach?',
    ]
  },
  {
    id: "e3", einwand: "Ich habe schon einen Berater", kategorie: "Wettbewerb", emoji: "🤝",
    behandlung: [
      'Das ist sehr gut – zeigt, dass Sie das Thema ernst nehmen. Darf ich fragen, wann Sie zuletzt eine unabhängige Überprüfung hatten?',
      'Eine Zweitmeinung kostet Sie nichts und verpflichtet zu nichts. Viele meiner Kunden haben durch einen kurzen Vergleich bares Geld gespart.',
      'Gerade weil ich als unabhängiger Makler tätig bin, kann ich Angebote von über 200 Gesellschaften vergleichen – das kann kaum ein gebundener Vertreter.',
      'Wenn Sie am Ende sagen: Mein bisheriger Schutz ist top – perfekt. Aber falls wir etwas Besseres finden, wäre das doch gut zu wissen, oder?',
    ]
  },
  {
    id: "e4", einwand: "Das brauche ich nicht", kategorie: "Kein Bedarf", emoji: "🚫",
    behandlung: [
      'Ich höre Sie – darf ich kurz nachfragen: Meinen Sie, dass Sie grundsätzlich gut abgesichert sind, oder dass dieses spezifische Produkt nicht zu Ihnen passt?',
      'Stellen Sie sich vor: Sie werden morgen krank und können sechs Monate nicht arbeiten. Wie würden Sie in dieser Zeit Ihre Miete, Ihren Kredit, Ihren Lebensunterhalt finanzieren?',
      'Statistisch wird jeder vierte Arbeitnehmer in Deutschland mindestens einmal in seinem Leben berufsunfähig – das ist keine Seltenheit, das ist Realität.',
      'Es geht letztlich nicht um mich oder eine Versicherung – es geht darum, dass Ihre Familie und Sie im Ernstfall abgesichert sind. Das ist Ihre Entscheidung, und ich respektiere sie.',
    ]
  },
  {
    id: "e5", einwand: "Versicherungen zahlen sowieso nicht", kategorie: "Misstrauen", emoji: "😤",
    behandlung: [
      'Das höre ich öfter – und ich verstehe, warum viele das denken. Leider gibt es schwarze Schafe in der Branche. Genau deswegen ist die Wahl des richtigen Produkts und Anbieters so entscheidend.',
      'Ich arbeite ausschließlich mit Gesellschaften, die nachweislich hohe Leistungsquoten haben. Die kann ich Ihnen schwarz auf weiß zeigen.',
      'Bei Berufsunfähigkeitsversicherungen beispielsweise liegt die Leistungsquote bei seriösen Anbietern über 80 %. Das bedeutet: In 8 von 10 Fällen wird gezahlt.',
      'Meine Aufgabe ist es, den Antrag von Anfang an so sauber zu stellen, dass es im Leistungsfall keine Diskussion gibt. Dafür bin ich dann auch Ihr Ansprechpartner – nicht nur beim Abschluss.',
    ]
  },
  {
    id: "e6", einwand: "Mein Partner muss mitentscheiden", kategorie: "Dritte", emoji: "👫",
    behandlung: [
      'Das ist absolut richtig und zeigt, dass Sie als Team entscheiden – das finde ich sehr gut.',
      'Soll ich Ihnen eine kurze Zusammenfassung mitgeben, die Sie Ihrem Partner zeigen können? So hat er oder sie alle wichtigen Punkte auf einen Blick.',
      'Noch besser: Wie wäre es, wenn wir einen gemeinsamen Termin machen – gerne auch kurz per Video? So kann Ihr Partner direkt Fragen stellen.',
      'Was hat Ihnen persönlich heute am besten gefallen? Das können wir als Ausgangspunkt für das Gespräch mit Ihrem Partner nehmen.',
    ]
  },
  {
    id: "e7", einwand: "Ich bin noch jung, das hat Zeit", kategorie: "Alter", emoji: "⏰",
    behandlung: [
      'Genau das ist der Punkt – Sie sind jung! Und das ist der beste Vorteil, den Sie gerade haben. Nutzen wir ihn.',
      'Je früher Sie einsteigen, desto günstiger ist Ihr Beitrag. Mit jedem Jahr, das vergeht, zahlen Sie mehr – manchmal 10–15 % mehr pro Jahr.',
      'Und Ihre Gesundheit ist heute wahrscheinlich besser als in zehn Jahren. Vorerkrankungen, die später kommen, können Sie dann unter Umständen gar nicht mehr absichern.',
      'Bei der Altersvorsorge gilt: Jedes Jahr zählt doppelt. Wer mit 25 anfängt statt mit 35, zahlt oft die Hälfte für dasselbe Ergebnis – das ist Mathematik, kein Verkaufsgespräch.',
    ]
  },
  {
    id: "e8", einwand: "Ich muss erst meine Schulden abbezahlen", kategorie: "Finanzen", emoji: "💳",
    behandlung: [
      'Das ist ein verständlicher Gedanke. Aber bedenken Sie: Gerade wenn Sie Schulden haben, ist es umso wichtiger, abgesichert zu sein – denn wenn Sie ausfallen, wer zahlt die Schulden dann?',
      'Wir können einen Schutz finden, der zu Ihrer aktuellen Situation passt – vielleicht erst einmal ein kleiner Einstieg, den Sie später ausbauen.',
      'Manchmal ist eine Absicherung sogar günstiger als gedacht. Sollen wir kurz schauen, was mit Ihrem jetzigen Budget möglich wäre?',
    ]
  },
  {
    id: "e9", einwand: "Ich will keinen langen Vertrag", kategorie: "Flexibilität", emoji: "📅",
    behandlung: [
      'Das verstehe ich gut – Flexibilität ist wichtig. Gute Nachrichten: Die meisten Verträge sind mit einer Monatsfrist kündbar.',
      'Gerade bei der Berufsunfähigkeit gilt jedoch: Je länger die Laufzeit, desto günstiger und sicherer. Mit kurzen Laufzeiten geben Sie Schutz auf, wenn Sie ihn am meisten brauchen könnten.',
      'Soll ich Ihnen zeigen, wie Sie maximale Flexibilität mit optimalem Schutz kombinieren können?',
    ]
  },
  {
    id: "e10", einwand: "Ich habe schlechte Erfahrungen mit Versicherungen gemacht", kategorie: "Negative Erfahrung", emoji: "😞",
    behandlung: [
      'Das tut mir leid zu hören – und ich nehme das sehr ernst. Darf ich fragen, was genau passiert ist? Ich möchte verstehen, womit Sie schlechte Erfahrungen gemacht haben.',
      'Ich bin hier nicht, um Ihnen irgendetwas zu verkaufen. Mein Ziel ist es, eine Lösung zu finden, die wirklich zu Ihnen passt – und bei der Sie im Ernstfall nicht im Stich gelassen werden.',
      'Genau deswegen erkläre ich Ihnen alles ganz transparent und helfe Ihnen, das Kleingedruckte zu verstehen – bevor Sie unterschreiben.',
    ]
  },
];

// ============================================================
// EINWÄNDE CROSSSELLING
// ============================================================
export const EINWAENDE_CROSSSELLING = [
  {
    id: "cs_e1", einwand: "Ich habe doch schon genug Versicherungen", kategorie: "Sättigung", emoji: "📦",
    behandlung: [
      'Das ist ein gutes Zeichen – Sie haben bereits vorgesorgt! Die Frage ist nur: Deckt Ihr bestehender Schutz auch [spezifisches Risiko] ab?',
      'Ich frage nicht, weil ich mehr verkaufen will – sondern weil ich bei Ihren Daten gesehen habe, dass genau dieser Bereich noch offen ist.',
      'Sollen wir kurz gemeinsam schauen, ob Ihre aktuellen Verträge diesen Punkt abdecken? Das dauert fünf Minuten.',
    ]
  },
  {
    id: "cs_e2", einwand: "Das kann ich mir momentan nicht leisten", kategorie: "Budget", emoji: "💸",
    behandlung: [
      'Das respektiere ich. Soll ich Ihnen zeigen, welche Mindest-Absicherung möglich wäre – auch für kleines Budget?',
      'Oft gibt es Einstiegsvarianten, die später flexibel aufgestockt werden können. Würde das helfen?',
    ]
  },
  {
    id: "cs_e3", einwand: "Ich muss erst mit meinem bisherigen Berater reden", kategorie: "Dritte", emoji: "📞",
    behandlung: [
      'Absolut – sprechen Sie mit ihm! Ich würde mich über eine ehrliche Vergleichsmöglichkeit freuen.',
      'Ich kann Ihnen eine kurze schriftliche Zusammenfassung mitgeben, die Sie Ihrem Berater zeigen können. So hat er alle Fakten auf einen Blick.',
    ]
  },
  {
    id: "cs_e4", einwand: "Ich will erst abwarten, wie der erste Vertrag läuft", kategorie: "Aufschieben", emoji: "⏳",
    behandlung: [
      'Das ist ein verständlicher Gedanke. Aber bedenken Sie: Ihr Gesundheitszustand heute ist Ihr bestes Kapital. Was heute möglich ist, ist morgen vielleicht nicht mehr möglich.',
      'Wir müssen heute keine finale Entscheidung treffen – aber ich würde Ihnen gerne zeigen, was möglich wäre, damit Sie informiert sind.',
    ]
  },
];

// Legacy
export const EINWAENDE = EINWAENDE_BERATUNG1;

// ============================================================
// CROSSSELLING PRODUKTE GUIDE
// ============================================================
export const CROSSSELLING_PRODUKTE = [
  {
    id: "cs_p1",
    produkt: "Krankenzusatzversicherung",
    emoji: "🏥",
    trigger: "Kunde hat gesetzliche Krankenversicherung",
    nutzen: "Privatpatientenstatus, Chefarzt, Einzelzimmer, schnellere Termine",
    einstieg: 'Sie haben ja eine gesetzliche Krankenversicherung. Darf ich Sie etwas fragen: Haben Sie sich schon mal überlegt, wie es wäre, im Krankenfall die Vorteile eines Privatpatienten zu genießen – ohne den vollen Preis zu zahlen?',
    tipps: ["Besonders attraktiv für Familien mit Kindern", "Zahnzusatz separat erwähnbar", "Aktuelle Wartezeiten als Aufhänger nutzen"],
  },
  {
    id: "cs_p2",
    produkt: "Unfallversicherung",
    emoji: "🦽",
    trigger: "Handwerk, Sport, Kinder im Haushalt",
    nutzen: "Einmalzahlung bei dauerhafter Invalidität durch Unfall",
    einstieg: 'Sie haben mir erzählt, dass Sie [Sport / handwerklich tätig / Kinder haben]. Das Unfallrisiko ist dort statistisch erhöht. Eine Unfallversicherung zahlt eine Einmalsumme – für Umbauten, Ausfall, Pflege. Haben Sie da schon etwas?',
    tipps: ["Günstiger Einstiegspreis – gutes Preis-Leistungs-Argument", "Gut kombinierbar mit BU", "Für Kinder besonders sinnvoll"],
  },
  {
    id: "cs_p3",
    produkt: "Pflegeversicherung",
    emoji: "👴",
    trigger: "Kunde Ü40 oder Eltern pflegebedürftig",
    nutzen: "Absicherung bei Pflegebedürftigkeit im Alter",
    einstieg: 'Haben Sie schon mal darüber nachgedacht, was passiert, wenn Sie selbst eines Tages Pflege benötigen? Die gesetzliche Pflegeversicherung deckt im Schnitt nur 40 % der Kosten. Die Lücke muss jemand schließen – entweder Sie, oder Ihre Kinder.',
    tipps: ["Emotionale Komponente: Kinder nicht belasten", "Früher Einstieg = günstiger Beitrag", "Staatliche Förderung erwähnen"],
  },
  {
    id: "cs_p4",
    produkt: "Altersvorsorge / bAV",
    emoji: "🏦",
    trigger: "Kunde hat keine oder wenig private Altersvorsorge",
    nutzen: "Steuervorteile, Arbeitgeberzuschuss (bAV), inflationsgeschützter Aufbau",
    einstieg: 'Wir haben heute viel über Absicherung gesprochen. Genauso wichtig ist aber die Frage: Was haben Sie für Ihr Alter aufgebaut? Die Rentenlücke in Deutschland wächst. Nutzen Sie bereits die Möglichkeit, über Ihren Arbeitgeber steuerbegünstigt einzuzahlen?',
    tipps: ["Arbeitgeberzuschuss als starkes Argument", "Riester / Rürup je nach Situation", "Steuerersparnis konkret ausrechnen"],
  },
  {
    id: "cs_p5",
    produkt: "Risikolebensversicherung",
    emoji: "❤️",
    trigger: "Kunde hat Familie, Kredit oder Immobilie",
    nutzen: "Absicherung der Familie / Kreditrückzahlung im Todesfall",
    einstieg: 'Sie haben eine Familie / einen Kredit. Darf ich fragen: Wenn Sie morgen nicht mehr da wären – wie wäre Ihre Familie finanziell abgesichert? Eine Risikolebensversicherung kostet oft weniger als 20 € im Monat und schützt, was Ihnen am wichtigsten ist.',
    tipps: ["Sehr günstiger Beitrag = leicht zu platzieren", "Kombinierbar mit BU", "Kreditgeber fordert sie oft ohnehin"],
  },
];