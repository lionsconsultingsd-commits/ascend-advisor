import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import OpenAI from 'npm:openai';

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { audio_base64, beratung_id, kunde_name, phase, notizen } = await req.json();

    if (!audio_base64) {
      return Response.json({ error: 'audio_base64 ist erforderlich' }, { status: 400 });
    }

    // Base64 → ArrayBuffer → Blob für Whisper
    const binaryStr = atob(audio_base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: 'audio/webm' });
    const audioFile = new File([audioBlob], 'aufnahme.webm', { type: 'audio/webm' });

    // Schritt 1: Transkription mit Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'de',
    });

    const transkript = transcription.text;

    // Schritt 2: Protokoll mit GPT-4o-mini generieren
    const prompt = `Du bist ein erfahrener Versicherungsmakler in Deutschland mit fundierten Kenntnissen der gesetzlichen Anforderungen an Beratungsdokumentationen (§ 61 VVG).

Deine Aufgabe:
Erstelle aus dem folgenden Gesprächsprotokoll/Transcript ein vollständiges, strukturiertes und rechtssicher formuliertes Beratungsprotokoll.

WICHTIG:
- Erfinde keine Inhalte.
- Wenn Informationen fehlen, kennzeichne diese klar als „nicht besprochen" oder „nicht angegeben".
- Formuliere sachlich, neutral und nachvollziehbar.
- Schreibe so, dass das Protokoll im Streitfall nachvollziehbar ist.

---

## STRUKTUR DES BERATUNGSPROTOKOLLS

### 1. Allgemeine Angaben
- Datum des Gesprächs: ${new Date().toLocaleDateString('de-DE')}
- Ort / Art des Gesprächs (z. B. telefonisch, Zoom, vor Ort): Aus dem Transkript ableiten, sonst „nicht besprochen"
- Name des Kunden: ${kunde_name || 'nicht angegeben'}
- Geburtsdatum (falls vorhanden): Aus dem Transkript ableiten, sonst „nicht besprochen"
- Name des Beraters: ${user.full_name || 'nicht angegeben'}
- Status des Beraters (Makler, Vertreter, Mehrfachagent): Aus dem Transkript ableiten, sonst „nicht besprochen"

---

### 2. Anlass der Beratung
- Warum hat der Kunde die Beratung in Anspruch genommen?
- Wer hat den Kontakt initiiert?

---

### 3. Kundensituation (Ist-Analyse)
- Beruf / Tätigkeit:
- Einkommen / finanzielle Situation (falls erwähnt):
- Familienstand / Absicherungssituation:
- Bestehende Versicherungen (falls genannt):
- Risikosituation:

---

### 4. Wünsche und Ziele des Kunden
- Welche Ziele verfolgt der Kunde?
- Welche Prioritäten wurden genannt?
- Gibt es konkrete Vorstellungen oder Einschränkungen?

---

### 5. Bedarfsermittlung
- Welche Risiken wurden identifiziert?
- Welche Versorgungslücken bestehen?
- Welche Absicherung ist grundsätzlich sinnvoll?

---

### 6. Besprochene Lösung / Empfehlung
- Welche Produkte oder Lösungen wurden besprochen?
- Welche Empfehlung wurde ausgesprochen?
- Begründung der Empfehlung (z. B. Preis-Leistung, Bedarf, Situation):

---

### 7. Hinweise und Aufklärung
- Wurde auf Risiken hingewiesen?
- Wurde auf Alternativen hingewiesen?
- Wurde auf Einschränkungen oder Ausschlüsse hingewiesen?

---

### 8. Entscheidung des Kunden
- Hat sich der Kunde entschieden?
- Wenn ja: wofür?
- Wenn nein: warum nicht / was ist offen?

---

### 9. Abweichungen von der Empfehlung
- Hat der Kunde von der Empfehlung abgewichen?
- Wenn ja: dokumentiere ausdrücklich die Abweichung und dass diese auf Wunsch des Kunden erfolgt ist.

---

### 10. Sonstige Vereinbarungen
- Weitere Schritte:
- Rückfragen:
- Termine:

---

### 11. Abschlussvermerk
„Das vorliegende Beratungsprotokoll gibt den wesentlichen Inhalt des Beratungsgesprächs wieder. Es wurde nach bestem Wissen und Gewissen erstellt."

---

## FORMAT
- Schreibe klar strukturiert mit Überschriften
- Keine Stichworte, sondern vollständige Sätze
- Professioneller, sachlicher Ton
- Fehlende Informationen immer mit „nicht besprochen" oder „nicht angegeben" kennzeichnen

---

## INPUT
Gesprächstranskript:
${transkript}

Vorherige Notizen des Beraters: ${notizen || 'Keine'}
Beratungsphase: ${phase || 'nicht angegeben'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Du bist ein erfahrener Versicherungsmakler in Deutschland mit fundierten Kenntnissen der gesetzlichen Anforderungen an Beratungsdokumentationen gemäß § 61 VVG. Erstelle ausschließlich sachliche, rechtssichere und vollständige Beratungsprotokolle.' },
        { role: 'user', content: prompt }
      ],
    });

    const protokoll = completion.choices[0].message.content;

    return Response.json({ 
      success: true, 
      transkript,
      protokoll 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});