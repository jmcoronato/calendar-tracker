import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db/connection";
import { getActivitiesOrder } from "../utils/activityOrder";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Obtener tracked para un rango opcional de fechas
router.get("/", requireAuth, (req, res) => {
    const db = getDb();
    const userId = (req.user as any).id as number;
    const { idToIndex } = getActivitiesOrder(userId);
    const rows = db
        .prepare(
            `SELECT da.date_key, da.activity_id, da.completed FROM day_activity da JOIN activities a ON a.id = da.activity_id WHERE a.user_id=?`
        )
        .all(userId) as { date_key: string; activity_id: number; completed: number }[];

    const tracked: Record<string, Record<number, boolean>> = {};
    for (const row of rows) {
        const map = tracked[row.date_key] || (tracked[row.date_key] = {});
        const idx = idToIndex.get(row.activity_id);
        if (idx !== undefined) {
            map[idx] = !!row.completed;
        }
    }
    res.json(tracked);
});

// Guardar estado de un día completo: { dateKey, activities: Record<activityId, boolean> }
router.put("/:dateKey", requireAuth, (req, res) => {
    const paramsSchema = z.object({ dateKey: z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/) });
    const bodySchema = z.record(z.string(), z.boolean()); // índiceDeActividad -> boolean
    const p = paramsSchema.safeParse(req.params);
    const b = bodySchema.safeParse(req.body);
    if (!p.success) {
        return res.status(400).json({ error: p.error.flatten() });
    }
    if (!b.success) {
        return res.status(400).json({ error: b.error.flatten() });
    }

    const { dateKey } = p.data;
    const activityMap = b.data;
    const db = getDb();
    const userId = (req.user as any).id as number;
    const { indexToId } = getActivitiesOrder(userId);
    const tx = db.transaction(() => {
        // Borrar marcas anteriores del usuario para ese día
        db.prepare(
            "DELETE FROM day_activity WHERE date_key=? AND activity_id IN (SELECT id FROM activities WHERE user_id=?)"
        ).run(dateKey, userId);

        // Insertar nuevas
        const insert = db.prepare(
            "INSERT INTO day_activity (date_key, activity_id, completed) VALUES (?, ?, ?)"
        );
        for (const [indexStr, completed] of Object.entries(activityMap)) {
            const idx = Number(indexStr);
            const activityId = indexToId.get(idx);
            if (activityId !== undefined) {
                insert.run(dateKey, activityId, completed ? 1 : 0);
            }
        }
    });
    try {
        tx();
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ error: "Failed to save day state" });
    }
});

export default router;


