import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.25';

const UPL_APP_ID = "69c140c42b1fc3201ee09f2a";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { kontakt_id, notizen, pipeline_status } = await req.json();

    if (!kontakt_id) {
      return Response.json({ error: 'kontakt_id is required' }, { status: 400 });
    }

    const token = Deno.env.get("UPL_APP_SERVICE_TOKEN");
    const uplClient = createClient({ appId: UPL_APP_ID });
    uplClient.auth.setToken(token);

    const updateData = {};
    if (notizen !== undefined) updateData.notes = notizen;
    if (pipeline_status !== undefined) updateData.pipeline_status = pipeline_status;

    const updated = await uplClient.entities.Contact.update(kontakt_id, updateData);

    return Response.json({ success: true, kontakt: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});