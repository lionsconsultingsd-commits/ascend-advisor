import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// POST /updateBeratungRecord
// Headers: X-API-KEY: <ASCEND_API_KEY>
// Body: { id, ...fields to update }
// Updates an existing Beratung record in Ascend from an external system (e.g. UPL)
// Supports partial updates – only the fields provided will be updated

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const apiKey = req.headers.get("X-API-KEY");
        if (!apiKey || apiKey !== Deno.env.get("ASCEND_API_KEY")) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.id) {
            return Response.json({ error: "id ist erforderlich" }, { status: 400 });
        }

        const { id, ...updateData } = body;

        const updatedRecord = await base44.asServiceRole.entities.Beratung.update(id, updateData);

        return Response.json({ success: true, record: updatedRecord });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});