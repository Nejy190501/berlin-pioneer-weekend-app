/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppConfigs, PioneerEvent, DayOfWeek } from "../types";
import { getEventDates } from "./calendar";

// Host coordinates/addresses for standard Berlin spots
export const DEFAULT_CONFIGS: AppConfigs = {
  startDate: "2026-08-28", // Friday, August 28, 2026
  whatsappGroupLink: "https://chat.whatsapp.com/ExamplePioneerBerlin2026",
  congregationName: "Berlin Französisch",
  kingdomHallAddress: "Naumburger Str. 37, 12057 Berlin",
  contactName1: "Florian (Resp. Prédication)",
  contactPhone1: "+49 176 24363318",
  contactName2: "Jean Yves",
  contactPhone2: "+49 1521 3974072",
  contactName3: "David",
  contactPhone3: "+49 176 10864392",
  contactName4: "Liverance",
  contactPhone4: "+49 1590 6403244",
  scaleEstimate: "15 - 50 personnes",
};

export const DEFAULT_EVENTS: PioneerEvent[] = [
  // --- VENDREDI ---
  {
    id: "fri-rendezvous-pred",
    title: "Réunion pour la prédication",
    timeStart: "17:30",
    timeEnd: "23:59",
    day: "Vendredi",
    locationName: "Salle du Royaume",
    address: "Naumburger Str. 37, 12057 Berlin",
    description: "Rendez-vous à la Salle du Royaume pour la réunion de prédication (témoignage public, présentoirs, etc.).",
    category: "ministry",
  },
  {
    id: "fri-restaurant",
    title: "Moment de détente",
    timeStart: "20:00",
    timeEnd: "23:59",
    day: "Vendredi",
    locationName: "Lieux à définir",
    address: "Lieux à définir",
    description: "En fonction de la soirée, on pourrait se faire un resto tous ensemble ou passer du temps ensemble autour d'un verre ou dans un espace vert.",
    category: "food",
    openEnded: true,
  },
  // --- SAMEDI ---
  {
    id: "sat-rendezvous",
    title: "Réunion pour la prédication",
    timeStart: "09:30",
    timeEnd: "23:59",
    day: "Samedi",
    locationName: "Salle du Royaume",
    address: "Naumburger Str. 37, 12057 Berlin",
    description: "Réunion pour la prédication à la Salle du Royaume.",
    category: "ministry",
  },
  {
    id: "sat-pred-depart",
    title: "Prédication dans les territoires",
    timeStart: "10:00",
    timeEnd: "12:00",
    day: "Samedi",
    locationName: "Territoires",
    address: "Territoires",
    description: "Prédication dans les territoires (porte-à-porte et témoignage public). Ceux qui voudraient bien prêcher un peu plus, c'est possible de continuer jusqu'à 13h.",
    category: "ministry",
  },
  {
    id: "sat-repas",
    title: "Casse-croûte tous ensemble",
    timeStart: "12:30",
    timeEnd: "13:30",
    day: "Samedi",
    locationName: "Salle du Royaume",
    address: "Naumburger Str. 37, 12057 Berlin",
    description: "Casse-croûte tous ensemble à la Salle du Royaume.",
    category: "food",
  },
  {
    id: "sat-reunion",
    title: "Réunion du week-end",
    timeStart: "14:00",
    timeEnd: "15:45",
    day: "Samedi",
    locationName: "Salle du Royaume",
    address: "Naumburger Str. 37, 12057 Berlin",
    description: "Réunion du week-end à la Salle du Royaume.",
    category: "spiritual",
  },
  {
    id: "sat-brevereunion",
    title: "Brève réunion pour la prédication",
    timeStart: "16:15",
    timeEnd: "16:30",
    day: "Samedi",
    locationName: "Salle du Royaume",
    address: "Naumburger Str. 37, 12057 Berlin",
    description: "Brève réunion pour la prédication pour ceux qui aimeraient encore prêcher un peu (à la Salle du Royaume avec la réunion du week-end).",
    category: "ministry",
  },
  {
    id: "sat-organisation-pique-nique",
    title: "Départ pour le pique-nique",
    timeStart: "16:15",
    timeEnd: "23:59",
    day: "Samedi",
    locationName: "Tempelhofer Feld",
    address: "Tempelhofer Feld, Berlin",
    description: "Départ pour le pique-nique au Tempelhofer Feld pour toute l'assemblée locale.\nSous le grand arbre à côté de la piste « 27-droite ».",
    category: "relaxation",
    directMapUrl: "https://maps.app.goo.gl/zJR6yc8ZvKBtC13y6?g_st=ic",
    openEnded: true,
  },
  // --- DIMANCHE ---
  {
    id: "sun-pred",
    title: "Réunion pour la prédication",
    timeStart: "09:30",
    timeEnd: "23:59",
    day: "Dimanche",
    locationName: "Dans les groupes / Territoires (à définir)",
    address: "Dans les groupes / Territoires (à définir)",
    description: "Prédication (en groupes séparés ou tous ensemble selon l'organisation décidée).",
    category: "ministry",
  },
  {
    id: "sun-convivial",
    title: "Moment de partage et repas convivial",
    timeStart: "14:00",
    timeEnd: "23:59",
    day: "Dimanche",
    locationName: "Chez des frères et sœurs",
    address: "Berlin",
    description: "À partir de 13:45 - 14:00 :\nMoment de partage et repas convivial chez des frères et sœurs de l'assemblée (à définir)\n\nSuivi d'une fin d'après-midi libre pour visiter la ville et/ou retourner à domicile.",
    category: "food",
    openEnded: true,
  },
];

export interface PracticalChecklist {
  id: string;
  item: string;
  category: "ministry" | "personal" | "spiritual";
  checkedByDefault?: boolean;
}

export const PRACTICAL_CHECKLISTS: PracticalChecklist[] = [
  { id: "chk-bible", item: "Bible (papier ou application JW Library)", category: "spiritual" },
  { id: "chk-vday", item: "Lecture du texte quotidien", category: "spiritual" },
  { id: "chk-sac", item: "Sac de prédication complet (invitations, tracts)", category: "ministry" },
  { id: "chk-stylo", item: "Stylos et bloc-notes", category: "ministry" },
  { id: "chk-chauss", item: "Chaussures de marche confortables", category: "personal" },
  { id: "chk-bouteille", item: "Gourde ou bouteille d'eau", category: "personal" },
  { id: "chk-parapluie", item: "Parapluie ou vêtement de pluie", category: "personal" },
];

export const BERLIN_TRANSPORT_GUIDE = {};

/**
 * Calculates current time relative to our schedule to decide past, active or future states.
 * Returns: "past" | "active" | "future"
 */
export function getEventState(
  event: PioneerEvent,
  startDateStr: string,
  simulationMode: "real" | "simulate",
  simulatedTimeStr: string // e.g. "Vendredi 15:00", "Samedi 10:00", etc. Or "Avant le week-end", "Après le week-end"
): "past" | "active" | "future" {
  
  if (simulationMode === "simulate") {
    // Check standard simulated states:
    if (simulatedTimeStr === "Avant le week-end") {
      return "future";
    }
    if (simulatedTimeStr === "Après le week-end") {
      return "past";
    }

    // Example parsed string: "Vendredi 15:00"
    const parts = simulatedTimeStr.split(" ");
    if (parts.length === 2) {
      const simulatedDay = parts[0] as DayOfWeek;
      const [simulatedHour, simulatedMinutes] = parts[1].split(":").map(Number);
      
      const eventStartParts = event.timeStart.split(":").map(Number);
      const eventEndParts = event.timeEnd.split(":").map(Number);

      const simDayOrder = simulatedDay === "Vendredi" ? 0 : simulatedDay === "Samedi" ? 1 : 2;
      const eventDayOrder = event.day === "Vendredi" ? 0 : event.day === "Samedi" ? 1 : 2;

      // Classify based on day ordering
      if (eventDayOrder < simDayOrder) {
        return "past";
      }
      if (eventDayOrder > simDayOrder) {
        return "future";
      }

      // Same day comparisons:
      const simMinutesTotal = simulatedHour * 60 + simulatedMinutes;
      const eventStartMinutesTotal = eventStartParts[0] * 60 + eventStartParts[1];
      const eventEndMinutesTotal = eventEndParts[0] * 60 + eventEndParts[1];

      if (simMinutesTotal >= eventEndMinutesTotal) {
        return "past";
      }
      if (simMinutesTotal < eventStartMinutesTotal) {
        return "future";
      }
      return "active"; // Sim total is within event window
    }
  }

  // Real-time calculation mode:
  const now = new Date();
  const { start, end } = getEventDates(startDateStr, event.day, event.timeStart, event.timeEnd);

  if (now.getTime() < start.getTime()) {
    return "future";
  }
  if (now.getTime() > end.getTime()) {
    return "past";
  }
  return "active";
}
