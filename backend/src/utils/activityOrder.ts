import { getDb } from "../db/connection";
import type { Activity } from "../types/models";

export function getActivitiesOrder(userId: number): {
    rows: Activity[];
    names: string[];
    idToIndex: Map<number, number>;
    indexToId: Map<number, number>;
} {
    const db = getDb();
    const rows = db
        .prepare("SELECT id, name FROM activities WHERE user_id=? ORDER BY id ASC")
        .all(userId) as Activity[];

    const names = rows.map((r) => r.name);
    const idToIndex = new Map<number, number>();
    const indexToId = new Map<number, number>();
    rows.forEach((r, idx) => {
        idToIndex.set(r.id, idx);
        indexToId.set(idx, r.id);
    });

    return { rows, names, idToIndex, indexToId };
}


