import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      beratung_id,
      kunde_name,
      upl_kontakt_id,
      aktion,
      details,
      vorheriger_status,
      neuer_status,
      phase,
      gespraechstyp,
    } = body;

    const eintrag = await base44.asServiceRole.entities.AuditTrail.create({
      beratung_id,
      kunde_name,
      upl_kontakt_id: upl_kontakt_id || null,
      aktion,
      details: details || "",
      vorheriger_status: vorheriger_status || null,
      neuer_status: neuer_status || null,
      phase: phase ?? null,
      gespraechstyp: gespraechstyp || null,
      berater_email: user.email,
    });

    return Response.json({ success: true, id: eintrag.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});