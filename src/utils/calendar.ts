/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayOfWeek, PioneerEvent } from "../types";

/**
 * Calculates start and end Date objects for an event based on the starting Friday of the event.
 */
export function getEventDates(
 startDateStr: string, // YYYY-MM-DD (e.g. "2026-08-14" which is Friday)
 day: DayOfWeek,
 startTime: string, // HH:MM (e.g. "14:00")
 endTime: string // HH:MM (e.g. "17:30")
): { start: Date; end: Date } {
 const baseDate = new Date(`${startDateStr}T12:00:00`); // parse safe local
 
 // Day offset from Friday (Friday = 0, Saturday = 1, Sunday = 2)
 let dayOffset = 0;
 if (day === "Samedi") {
 dayOffset = 1;
 } else if (day === "Dimanche") {
 dayOffset = 2;
 }

 const targetDateObj = new Date(baseDate);
 targetDateObj.setDate(baseDate.getDate() + dayOffset);

 const formattedDateStr = targetDateObj.toISOString().split("T")[0];

 const start = new Date(`${formattedDateStr}T${startTime}:00`);
 const end = new Date(`${formattedDateStr}T${endTime}:00`);

 return { start, end };
}

/**
 * Formats a Date object into the exact standard iCal format YYYYMMDDTHHMMSS
 */
function formatICalDate(date: Date): string {
 const pad = (n: number) => n.toString().padStart(2, "0");
 
 const yyyy = date.getFullYear();
 const mm = pad(date.getMonth() + 1);
 const dd = pad(date.getDate());
 const hh = pad(date.getHours());
 const min = pad(date.getMinutes());
 const ss = pad(date.getSeconds());

 return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
}

/**
 * Generates and downloads a single event .ics file
 */
export function downloadEventICS(
 event: PioneerEvent,
 startDateStr: string
): void {
 const { start, end } = getEventDates(startDateStr, event.day, event.timeStart, event.timeEnd);
 
 const duration = `Détail : ${event.description}\nLieu : ${event.locationName}`;

 const icsLines = [
 "BEGIN:VCALENDAR",
 "VERSION:2.0",
 "PRODID:-//Pioneer Weekend App//NONSGML Event Companion//FR",
 "CALSCALE:GREGORIAN",
 "BEGIN:VEVENT",
 `UID:${event.id}-${Date.now()}@pioneer.berlin`,
 `DTSTAMP:${formatICalDate(new Date())}`,
 `DTSTART:${formatICalDate(start)}`,
 `DTEND:${formatICalDate(end)}`,
 `SUMMARY:Pionniers : ${event.title}`,
 `DESCRIPTION:${duration.replace(/\n/g, "\\n")}`,
 `LOCATION:${event.address}`,
 "END:VEVENT",
 "END:VCALENDAR",
 ];

 const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
 const url = URL.createObjectURL(blob);
 
 const link = document.createElement("a");
 link.href = url;
 link.setAttribute("download", `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 URL.revokeObjectURL(url);
}

/**
 * Generates and downloads an .ics file containing the entire weekend's schedule
 */
export function downloadFullScheduleICS(
 events: PioneerEvent[],
 startDateStr: string
): void {
 const timestamp = formatICalDate(new Date());
 
 const icsLines = [
 "BEGIN:VCALENDAR",
 "VERSION:2.0",
 "PRODID:-//Pioneer Weekend App//NONSGML Full Event Companion//FR",
 "CALSCALE:GREGORIAN",
 ];

 events.forEach((event) => {
 const { start, end } = getEventDates(startDateStr, event.day, event.timeStart, event.timeEnd);
 const descriptionClean = `Activite: ${event.title}\nCategorie: ${event.category}\nLieu: ${event.locationName}\nDescription: ${event.description}`;
 
 icsLines.push(
 "BEGIN:VEVENT",
 `UID:${event.id}-${Date.now()}@pioneer.berlin`,
 `DTSTAMP:${timestamp}`,
 `DTSTART:${formatICalDate(start)}`,
 `DTEND:${formatICalDate(end)}`,
 `SUMMARY:Pionniers - ${event.title}`,
 `DESCRIPTION:${descriptionClean.replace(/\n/g, "\\n")}`,
 `LOCATION:${event.address}`,
 "END:VEVENT"
 );
 });

 icsLines.push("END:VCALENDAR");

  const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Programme_Week_End_Pionnier.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates Google Calendar Web URL for a single event
 */
export function getGoogleCalendarUrl(
  event: PioneerEvent,
  startDateStr: string
): string {
  const { start, end } = getEventDates(startDateStr, event.day, event.timeStart, event.timeEnd);
  
  // Format to UTC string expected by Google Calendar: YYYYMMDDTHHMMSSZ
  const formatUTC = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  const text = encodeURIComponent(`Pionniers : ${event.title}`);
  const dates = `${formatUTC(start)}/${formatUTC(end)}`;
  const details = encodeURIComponent(`Lieu : ${event.locationName}\nDescription : ${event.description}`);
  const location = encodeURIComponent(event.address);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generates Outlook Live Mail Calendar URL for a single event
 */
export function getOutlookCalendarUrl(
  event: PioneerEvent,
  startDateStr: string
): string {
  const { start, end } = getEventDates(startDateStr, event.day, event.timeStart, event.timeEnd);
  
  const text = encodeURIComponent(`Pionniers : ${event.title}`);
  const startStr = encodeURIComponent(start.toISOString());
  const endStr = encodeURIComponent(end.toISOString());
  const details = encodeURIComponent(`Lieu : ${event.locationName}\nDescription : ${event.description}`);
  const location = encodeURIComponent(event.address);
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${text}&startdt=${startStr}&enddt=${endStr}&body=${details}&location=${location}`;
}

/**
 * Generates Yahoo Calendar Web URL for a single event
 */
export function getYahooCalendarUrl(
  event: PioneerEvent,
  startDateStr: string
): string {
  const { start, end } = getEventDates(startDateStr, event.day, event.timeStart, event.timeEnd);
  
  // Format to UTC string expected by Yahoo: YYYYMMDDTHHMMSS
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatYahooLocal = (d: Date) => {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };
  
  const text = encodeURIComponent(`Pionniers : ${event.title}`);
  const desc = encodeURIComponent(`Lieu : ${event.locationName}\nDescription : ${event.description}`);
  const loc = encodeURIComponent(event.address);
  
  return `https://calendar.yahoo.com/?v=60&title=${text}&st=${formatYahooLocal(start)}&et=${formatYahooLocal(end)}&desc=${desc}&in_loc=${loc}`;
}

