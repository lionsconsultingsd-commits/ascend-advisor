import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

const UPL_APP_ID = "69c140c42b1fc3201ee09f2a";

// Diese Funktion wird von der Automation alle 5 Minuten aufgerufen
// Sie synchronisiert Kontakte ALLER Berater aus UPL
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const token = Deno.env.get("UPL_APP_SERVICE_TOKEN");

    // UPL-Client (Service-Token für UPL-App)
    const uplClient = createClient({ appId: UPL_APP_ID });
    uplClient.auth.setToken(token);

    // Alle User dieser App über Service-Role laden
    const alleUser = await base44.asServiceRole.entities.User.list().catch(() => []);
    if (!alleUser || alleUser.length === 0) {
      return Response.json({ message: 'Keine User gefunden' });
    }

    let totalCreated = 0;
    let totalUpdated = 0;
    const now = new Date().toISOString();

    for (const user of alleUser) {
      const email = user.email;
      if (!email) continue;

      // UPL-Kontakte für diesen Berater
      const uplKontakte = await uplClient.entities.Contact.filter({ created_by: email }).catch(() => []);
      if (!uplKontakte || uplKontakte.length === 0) continue;

      // Bestehende lokale Kontakte
      const vorhandene = await base44.asServiceRole.entities.Kontakt.filter({ berater_email: email }).catch(() => []);
      const vorhandeneMap = {};
      for (const k of vorhandene) {
        vorhandeneMap[k.upl_kontakt_id] = k;
      }

      for (const k of uplKontakte) {
        const payload = {
          upl_kontakt_id: k.id,
          first_name: k.first_name || "",
          last_name: k.last_name || "",
          phone: k.phone || null,
          email: k.email || null,
          status: k.status || null,
          notes: k.notes || null,
          tags: k.tags || [],
          berater_email: email,
          last_synced: now,
        };

        if (vorhandeneMap[k.id]) {
          await base44.asServiceRole.entities.Kontakt.update(vorhandeneMap[k.id].id, payload);
          totalUpdated++;
        } else {
          await base44.asServiceRole.entities.Kontakt.create(payload);
          totalCreated++;
        }
      }
    }

    return Response.json({
      message: `Auto-Sync: ${totalCreated} neu, ${totalUpdated} aktualisiert`,
      created: totalCreated,
      updated: totalUpdated,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});