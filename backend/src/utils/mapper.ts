import { Activity } from "../types/models";

export function mapActivitiesToNames(activities: Activity[]): string[] {
    return activities.map((a) => a.name);
}


