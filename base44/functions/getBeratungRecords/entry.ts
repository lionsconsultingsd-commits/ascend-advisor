import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// GET /getBeratungRecords
// Headers: X-API-KEY: <ASCEND_API_KEY>
// Body (optional): { upl_kontakt_id, status, gespraechstyp }
// Returns all Beratung records (filterable), including all phase data, notes, protocol, etc.

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const apiKey = req.headers.get("X-API-KEY");
        if (!apiKey || apiKey !== Deno.env.get("ASCEND_API_KEY")) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { upl_kontakt_id, status, gespraechstyp, created_by } = body;

        const filter = {};
        if (upl_kontakt_id) filter.upl_kontakt_id = upl_kontakt_id;
        if (status) filter.status = status;
        if (gespraechstyp) filter.gespraechstyp = gespraechstyp;
        if (created_by) filter.created_by = created_by;

        const records = await base44.asServiceRole.entities.Beratung.filter(filter, "-created_date", 100);

        return Response.json({ records, count: records.length });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});