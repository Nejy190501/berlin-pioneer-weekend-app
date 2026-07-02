/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DayOfWeek = "Vendredi" | "Samedi" | "Dimanche";

export type EventCategory = "ministry" | "food" | "relaxation" | "spiritual" | "other";

export interface PioneerEvent {
 id: string;
 title: string;
 timeStart: string; // HH:MM
 timeEnd: string; // HH:MM
 day: DayOfWeek;
 locationName: string;
 address: string;
 description: string;
 category: EventCategory;
 directMapUrl?: string; // If set, "S'y rendre" links directly to this URL
 openEnded?: boolean; // If true with timeEnd 23:59, shows "À partir de"; otherwise just shows start time
 notes?: string;
}

export interface AppNote {
 id: string;
 title: string;
 content: string;
 updatedAt: string;
}

export interface AppConfigs {
 startDate: string; // YYYY-MM-DD
 whatsappGroupLink: string;
 congregationName: string;
 kingdomHallAddress: string;
 contactName1: string;
 contactPhone1: string;
 contactName2: string;
 contactPhone2: string;
 contactName3?: string;
 contactPhone3?: string;
 contactName4?: string;
 contactPhone4?: string;
 scaleEstimate: string; // e.g., "15 - 50 personnes"
}

export interface SimulationConfig {
 mode: "real" | "simulate";
 simulatedTime: string; // e.g. "Vendredi 15:00", "Samedi 10:00", etc.
}
