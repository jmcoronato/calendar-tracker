import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface DbContext {
    db: Database.Database;
}

let cachedDb: Database.Database | null = null;

export function getDb(): Database.Database {
    if (cachedDb) return cachedDb;

    const dbFile = path.resolve(__dirname, "../../data.sqlite");

    // Ensure directory exists
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const db = new Database(dbFile);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    cachedDb = db;
    return db;
}


