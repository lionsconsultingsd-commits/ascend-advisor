import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// POST /createBeratungRecord
// Headers: X-API-KEY: <ASCEND_API_KEY>
// Body: { kunde_name, upl_kontakt_id, gespraechstyp, datum, notizen, ... }
// Creates a new Beratung record in Ascend from an external system (e.g. UPL)

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const apiKey = req.headers.get("X-API-KEY");
        if (!apiKey || apiKey !== Deno.env.get("ASCEND_API_KEY")) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.kunde_name) {
            return Response.json({ error: "kunde_name ist erforderlich" }, { status: 400 });
        }

        const newRecord = await base44.asServiceRole.entities.Beratung.create({
            kunde_name: body.kunde_name,
            upl_kontakt_id: body.upl_kontakt_id || null,
            gespraechstyp: body.gespraechstyp || "beratung1",
            datum: body.datum || new Date().toISOString().split("T")[0],
            aktuelle_phase: body.aktuelle_phase || 0,
            abgeschlossene_fragen: body.abgeschlossene_fragen || [],
            notizen: body.notizen || "",
            status: body.status || "aktiv",
            upl_synced: body.upl_synced || false,
            protokoll_text: body.protokoll_text || "",
        });

        return Response.json({ success: true, record: newRecord });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});