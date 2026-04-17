import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { protokoll_text, unterschrift_url, kunde_name, datum } = await req.json();

    if (!protokoll_text) {
      return Response.json({ error: 'protokoll_text ist erforderlich' }, { status: 400 });
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Beratungsprotokoll', margin, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Kunde: ${kunde_name || '–'}`, margin, 30);
    doc.text(`Datum: ${datum || new Date().toLocaleDateString('de-DE')}`, margin, 36);

    // Trennlinie
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 41, pageWidth - margin, 41);

    // Protokoll-Text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);

    let y = 50;
    const lines = doc.splitTextToSize(protokoll_text, maxWidth);

    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      // Markdown Überschriften erkennen
      if (line.startsWith('### ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(line.replace('### ', ''), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      } else if (line.startsWith('## ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(line.replace('## ', ''), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      } else if (line.startsWith('# ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text(line.replace('# ', ''), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      } else {
        doc.text(line, margin, y);
      }
      y += 6;
    }

    // Unterschrift
    if (unterschrift_url) {
      try {
        const imgRes = await fetch(unterschrift_url);
        const imgBuffer = await imgRes.arrayBuffer();
        const imgBytes = new Uint8Array(imgBuffer);
        let binary = '';
        for (let i = 0; i < imgBytes.byteLength; i++) {
          binary += String.fromCharCode(imgBytes[i]);
        }
        const base64 = btoa(binary);

        if (y + 45 > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y + 5, pageWidth - margin, y + 5);
        y += 10;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Unterschrift des Kunden:', margin, y);
        y += 6;
        doc.addImage(`data:image/png;base64,${base64}`, 'PNG', margin, y, 80, 30);
        y += 35;
      } catch {
        // Unterschrift nicht verfügbar – überspringen
      }
    }

    // Zeitstempel am Ende
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const timestamp = `Erstellt am ${new Date().toLocaleString('de-DE')}`;
    doc.text(timestamp, margin, doc.internal.pageSize.getHeight() - 10);

    const pdfBase64 = doc.output('datauristring');

    return Response.json({ pdf_base64: pdfBase64 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});