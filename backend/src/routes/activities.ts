import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db/connection";
import { Activity } from "../types/models";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// Listar actividades en orden por id
router.get("/", requireAuth, (req, res) => {
    const db = getDb();
    const userId = (req.user as any).id as number;
    const rows = db
        .prepare("SELECT id, name FROM activities WHERE user_id=? ORDER BY id ASC")
        .all(userId) as Activity[];
    res.json(rows);
});

// Crear actividad
router.post("/", requireAuth, (req, res) => {
    const schema = z.object({ name: z.string().trim().min(1).max(70) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { name } = parsed.data;
    try {
        const db = getDb();
        const userId = (req.user as any).id as number;
        const info = db.prepare("INSERT INTO activities (name, user_id) VALUES (?, ?)").run(name, userId);
        const activity: Activity = { id: Number(info.lastInsertRowid), name };
        res.status(201).json(activity);
    } catch (e: any) {
        if (e && typeof e.code === "string" && e.code.includes("SQLITE_CONSTRAINT")) {
            return res.status(409).json({ error: "Activity name must be unique" });
        }
        res.status(500).json({ error: "Failed to create activity" });
    }
});

// Renombrar actividad
router.put("/:id", requireAuth, (req, res) => {
    const paramsSchema = z.object({ id: z.coerce.number().int().positive() });
    const bodySchema = z.object({ name: z.string().trim().min(1).max(70) });
    const p = paramsSchema.safeParse(req.params);
    const b = bodySchema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: p.error.flatten() });
    if (!b.success) return res.status(400).json({ error: b.error.flatten() });

    const { id } = p.data;
    const { name } = b.data;
    try {
        const db = getDb();
        const userId = (req.user as any).id as number;
        const info = db.prepare("UPDATE activities SET name=? WHERE id=? AND user_id=?").run(name, id, userId);
        if (info.changes === 0) return res.status(404).json({ error: "Activity not found" });
        const updated = db
            .prepare("SELECT id, name FROM activities WHERE id=? AND user_id=?")
            .get(id, userId) as Activity | undefined;
        res.json(updated);
    } catch (e: any) {
        if (e && typeof e.code === "string" && e.code.includes("SQLITE_CONSTRAINT")) {
            return res.status(409).json({ error: "Activity name must be unique" });
        }
        res.status(500).json({ error: "Failed to update activity" });
    }
});

// Eliminar actividad y sus marcas de día (ON DELETE CASCADE)
router.delete("/:id", requireAuth, (req, res) => {
    const paramsSchema = z.object({ id: z.coerce.number().int().positive() });
    const p = paramsSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ error: p.error.flatten() });

    const { id } = p.data;
    const db = getDb();
    const userId = (req.user as any).id as number;
    const info = db.prepare("DELETE FROM activities WHERE id=? AND user_id=?").run(id, userId);
    if (info.changes === 0) return res.status(404).json({ error: "Activity not found" });
    res.status(204).send();
});

export default router;


