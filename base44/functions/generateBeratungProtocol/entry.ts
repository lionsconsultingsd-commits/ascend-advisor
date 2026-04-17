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
    const prompt = `Du bist ein professioneller Assistent für Versicherungsberater. 
Erstelle aus dem folgenden Gesprächstranskript ein strukturiertes Beratungsprotokoll auf Deutsch.

Kundenname: ${kunde_name || 'Unbekannt'}
Beratungsphase: ${phase || 'Unbekannt'}
Vorherige Notizen: ${notizen || 'Keine'}

Gesprächstranskript:
${transkript}

Erstelle ein übersichtliches Protokoll mit diesen Abschnitten:
1. **Zusammenfassung** - Kurze Übersicht des Gesprächs
2. **Besprochene Themen** - Wichtige Punkte aus dem Gespräch
3. **Kundenwünsche & Bedürfnisse** - Was der Kunde möchte oder braucht
4. **Vereinbarungen & nächste Schritte** - Was wurde vereinbart
5. **Offene Punkte** - Was noch geklärt werden muss

Schreibe professionell und präzise.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Du bist ein professioneller Assistent für Versicherungsberater in Deutschland.' },
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