import { Router } from "express";
import { getDb } from "../db/connection";
import type { StateResponse } from "../types/models";
import { getActivitiesOrder } from "../utils/activityOrder";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, (req, res) => {
    const db = getDb();
    const userId = (req.user as any).id as number;
    const { names, idToIndex } = getActivitiesOrder(userId);
    const dayRows = db
        .prepare(
            "SELECT da.date_key, da.activity_id, da.completed FROM day_activity da JOIN activities a ON a.id = da.activity_id WHERE a.user_id=?"
        )
        .all(userId) as { date_key: string; activity_id: number; completed: number }[];

    const tracked: Record<string, Record<number, boolean>> = {};
    for (const row of dayRows) {
        const map = tracked[row.date_key] || (tracked[row.date_key] = {});
        const idx = idToIndex.get(row.activity_id);
        if (idx !== undefined) {
            map[idx] = !!row.completed;
        }
    }

    const response: StateResponse = { activities: names, tracked };
    res.json(response);
});

export default router;


