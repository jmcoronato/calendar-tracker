export interface Activity {
    id: number;
    name: string;
}

export interface DayActivity {
    date_key: string; // `${year}-${month}-${day}` donde month es 0-11
    activity_id: number;
    completed: boolean;
}

export interface StateResponse {
    activities: string[]; // nombres en orden estable (id ASC)
    tracked: Record<string, Record<number, boolean>>; // índices según orden actual
}

export interface User {
    id: number;
    provider: string; // 'google'
    provider_id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}


