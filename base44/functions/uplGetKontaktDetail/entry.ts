import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

const UPL_APP_ID = "69c140c42b1fc3201ee09f2a";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { kontakt_id } = await req.json();
    if (!kontakt_id) return Response.json({ error: 'kontakt_id fehlt' }, { status: 400 });

    const token = Deno.env.get("UPL_APP_SERVICE_TOKEN");
    const uplClient = createClient({ appId: UPL_APP_ID });
    uplClient.auth.setToken(token);

    const kontakte = await uplClient.entities.Contact.filter({ id: kontakt_id });
    const kontakt = kontakte?.[0] || null;

    return Response.json({ kontakt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});