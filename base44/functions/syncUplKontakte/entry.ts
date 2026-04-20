import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

const UPL_APP_ID = "69c140c42b1fc3201ee09f2a";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Unterstützt sowohl manuellen Aufruf (mit User) als auch Automatisierung (ohne User)
    let beraterEmails = [];
    const user = await base44.auth.me().catch(() => null);

    if (user) {
      // Manueller Aufruf: nur den aktuellen Berater synchronisieren
      beraterEmails = [user.email];
    } else {
      // Automatisierung: alle Berater aus vorhandenen Kontakten ermitteln
      // Alternativ: alle User mit Rolle "admin" oder "user" aus der User-Entität
      const alleUser = await base44.asServiceRole.entities.User.list();
      beraterEmails = alleUser.map((u) => u.email).filter(Boolean);
    }

    const token = Deno.env.get("UPL_APP_SERVICE_TOKEN");
    const uplClient = createClient({ appId: UPL_APP_ID });
    uplClient.auth.setToken(token);

    let totalCreated = 0;
    let totalUpdated = 0;
    const now = new Date().toISOString();

    for (const email of beraterEmails) {
      // UPL-Kontakte für diesen Berater abrufen
      const uplKontakte = await uplClient.entities.Contact.filter({ created_by: email }).catch(() => []);

      if (!uplKontakte || uplKontakte.length === 0) continue;

      // Bestehende lokale Kontakte für diesen Berater laden
      const vorhandene = await base44.asServiceRole.entities.Kontakt.filter({ berater_email: email });
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
      message: `Sync abgeschlossen: ${totalCreated} neu angelegt, ${totalUpdated} aktualisiert`,
      created: totalCreated,
      updated: totalUpdated,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});