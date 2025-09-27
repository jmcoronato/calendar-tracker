export interface ActivityData {
    [activityIndex: number]: boolean;
}

export interface TrackedActivities {
    [dateKey: string]: ActivityData;
}

export type StatsPeriod = "week" | "month" | "year";

// Constantes globales
export const ACTIVITY_NAME_MAX_LENGTH = 70;

// Usuario autenticado (desde backend)
export interface ApiUser {
    id: number;
    provider: "google";
    provider_id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
}