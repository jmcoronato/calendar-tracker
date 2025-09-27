import passport, { DoneCallback } from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as GoogleStrategy, Profile, StrategyOptions, VerifyCallback } from "passport-google-oauth20";
import { getDb } from "../db/connection";
import type { User } from "../types/models";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw new Error("Faltan variables de entorno de Google OAuth (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL)");
}

passport.serializeUser((user: any, done: DoneCallback) => {
    done(null, user.id);
});

passport.deserializeUser((id: number, done: DoneCallback) => {
    try {
        const db = getDb();
        const user = db.prepare("SELECT * FROM users WHERE id=?").get(id) as User | undefined;
        done(null, user || null);
    } catch (e) {
        done(e as any);
    }
});

const googleOptions: StrategyOptions = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
};

passport.use(new GoogleStrategy(
    googleOptions,
    (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const db = getDb();
            const provider = "google";
            const provider_id = profile.id;
            const email = Array.isArray(profile.emails) && profile.emails[0] ? profile.emails[0].value : undefined;
            const name = profile.displayName || undefined;
            const avatar_url = Array.isArray(profile.photos) && profile.photos[0] ? profile.photos[0].value : undefined;

            const existing = db.prepare("SELECT * FROM users WHERE provider=? AND provider_id=?").get(provider, provider_id) as User | undefined;
            if (existing) {
                db.prepare(
                    "UPDATE users SET email=?, name=?, avatar_url=?, updated_at = datetime('now') WHERE id=?"
                ).run(email, name, avatar_url, existing.id);
                const updated = db.prepare("SELECT * FROM users WHERE id=?").get(existing.id) as User;
                return done(null, updated);
            }

            const info = db.prepare(
                "INSERT INTO users (provider, provider_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)"
            ).run(provider, provider_id, email, name, avatar_url);
            const user = db.prepare("SELECT * FROM users WHERE id=?").get(Number(info.lastInsertRowid)) as User;
            return done(null, user);
        } catch (e) {
            return done(e as any);
        }
    }
));

export default passport;


