import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const UPL_APP_ID = "67ebb7ef5f49f4b941c55f60";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { kontakt_id } = await req.json();
    if (!kontakt_id) return Response.json({ error: 'kontakt_id fehlt' }, { status: 400 });

    const uplClient = createClientFromRequest(req);
    uplClient.configure({
      appId: UPL_APP_ID,
      serviceToken: Deno.env.get("UPL_APP_SERVICE_TOKEN"),
    });

    const kontakte = await uplClient.asServiceRole.entities.Kontakt.filter({ id: kontakt_id });
    const kontakt = kontakte?.[0] || null;

    return Response.json({ kontakt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});