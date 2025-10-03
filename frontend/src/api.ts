export interface ApiActivity {
    id: number;
    name: string;
}

// tipos para mejor claridad en los datos de seguimiento
export type DayActivities = Record<number, boolean>;
export type TrackedData = Record<string, DayActivities>;

export interface ApiStateResponse {
    activities: string[];
    tracked: TrackedData;
}

async function handleJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with ${res.status}`);
    }
    return res.json() as Promise<T>;
}

const base = ""; // Usaremos proxy de Vite para /api

export const api = {
    // Healthcheck
    async health(): Promise<{ ok: boolean }> {
        const res = await fetch(`${base}/api/health`, { credentials: "include" });
        return handleJson(res);
    },

    // Auth
    async me(): Promise<{ user: import("./types").ApiUser | null }> {
        const res = await fetch(`${base}/api/auth/me`, { credentials: "include" });
        return handleJson(res);
    },
    async logout(): Promise<void> {
        const res = await fetch(`${base}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok && res.status !== 204) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Request failed with ${res.status}`);
        }
    },

    // Activities
    async listActivities(): Promise<ApiActivity[]> {
        const res = await fetch(`${base}/api/activities`, { credentials: "include" });
        return handleJson(res);
    },
    async createActivity(name: string): Promise<ApiActivity> {
        const res = await fetch(`${base}/api/activities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
            credentials: "include",
        });
        return handleJson(res);
    },
    async renameActivity(id: number, name: string): Promise<ApiActivity> {
        const res = await fetch(`${base}/api/activities/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
            credentials: "include",
        });
        return handleJson(res);
    },
    async deleteActivity(id: number): Promise<void> {
        const res = await fetch(`${base}/api/activities/${id}`, { method: "DELETE", credentials: "include" });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Request failed with ${res.status}`);
        }
    },

    // Tracked
    async getTracked(): Promise<TrackedData> {
        const res = await fetch(`${base}/api/tracked`, { credentials: "include" });
        return handleJson(res);
    },
    async saveDay(
        dateKey: string,
        activitiesMap: DayActivities
    ): Promise<void> {
        const res = await fetch(`${base}/api/tracked/${encodeURIComponent(dateKey)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(activitiesMap),
            credentials: "include",
        });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Request failed with ${res.status}`);
        }
    },

    // Combined state
    async getState(): Promise<ApiStateResponse> {
        const res = await fetch(`${base}/api/state`, { credentials: "include" });
        return handleJson(res);
    },
};


