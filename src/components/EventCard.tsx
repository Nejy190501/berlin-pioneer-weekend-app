/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PioneerEvent } from "../types";
import {
  Clock,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Coffee,
  Compass,
  Trees,
  BookOpen,
  HelpCircle,
  Download,
  AlertCircle,
  Heart,
} from "lucide-react";
import { 
  downloadEventICS, 
  getGoogleCalendarUrl, 
  getOutlookCalendarUrl, 
  getYahooCalendarUrl 
} from "../utils/calendar";
import { t, Language } from "../utils/i18n";

interface EventCardProps {
  key?: string;
  event: PioneerEvent;
  startDate: string;
  state: "past" | "active" | "future";
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isHighlighted?: boolean;
}

export default function EventCard({ event, startDate, state, isFavorite, onToggleFavorite, isHighlighted }: EventCardProps) {
  const [mapDropdownOpen, setMapDropdownOpen] = useState(false);
  const [calDropdownOpen, setCalDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const language = (localStorage.getItem("PIONEER_LANG") as Language) || "fr";


  // Helper to parse duration
  const getDurationString = (start: string, end: string) => {
    if (end === "23:59") return "";
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const totalMin = eh * 60 + em - (sh * 60 + sm);
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, "0")}`;
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(event.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Maps coordinates helpers
  const encodedAddress = encodeURIComponent(event.address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const appleMapsUrl = `maps://?q=${encodedAddress}`;
  const wazeUrl = `https://waze.com/ul?ll=&navigate=yes&q=${encodedAddress}`;


  // Category visual themes
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case "ministry":
        return {
          icon: <Compass className="w-3.5 h-3.5" />,
          textColor: "text-stone-900",
          badgeLabel: t("catMinistry", language),
        };
      case "food":
        return {
          icon: <Coffee className="w-3.5 h-3.5" />,
          textColor: "text-stone-900",
          badgeLabel: t("catFood", language),
        };
      case "relaxation":
        return {
          icon: <Trees className="w-3.5 h-3.5" />,
          textColor: "text-stone-900",
          badgeLabel: t("catRelaxation", language),
        };
      case "spiritual":
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          textColor: "text-stone-900",
          badgeLabel: t("catSpiritual", language),
        };
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          textColor: "text-stone-900",
          badgeLabel: t("catActivity", language) || "Activité",
        };
    }
  };

  const styleConfig = getCategoryStyles(event.category);

  // Define background & border decorations depending on state:
  let borderStyle = "border-transparent";
  let bgStyle = "bg-white hover:bg-stone-50/50";
  let stateBadge = null;

  if (state === "past") {
    borderStyle = "border-transparent opacity-50";
    bgStyle = "bg-stone-50 select-none";
    stateBadge = (
      <span className="px-2 py-0.5 text-[10px] font-medium text-stone-400 bg-stone-100 rounded-md select-none">
        {t("statusPast", language)}
      </span>
    );
  } else if (state === "active") {
    borderStyle = "border-stone-900";
    bgStyle = "bg-white border-stone-900 ring-1 ring-stone-900";
    stateBadge = (
      <span className="relative flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium text-white bg-stone-900 rounded-md select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"></span>
        {t("statusOngoing", language)}
      </span>
    );
  } else {
    // future
    borderStyle = "border-stone-200 hover:border-stone-300";
    stateBadge = (
      <span className="px-2 py-0.5 text-[10px] font-medium text-stone-500 bg-stone-50 border border-stone-200 rounded-md select-none">
        {t("statusFuture", language)}
      </span>
    );
  }

  if (isHighlighted) {
    borderStyle = "border-amber-500 ring-2 ring-amber-400 scale-[1.02] shadow-md shadow-amber-100/50";
    bgStyle = "bg-amber-50/20";
  }


  return (
    <motion.div
      layout
      initial={{ opacity: 0, filter: "blur(4px)", scale: 0.98, y: 10 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
      exit={{ opacity: 0, filter: "blur(4px)", scale: 0.98, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`p-6 rounded-2xl border ${borderStyle} ${bgStyle} transition-all duration-300 relative flex flex-col justify-between`}
      id={`event-card-${event.id}`}
    >
      {/* Upper row: Badge label and status */}
      <div className="flex items-center justify-between gap-2 mb-6 w-full">
        <div
          className={`flex items-center gap-2 text-xs font-light tracking-wide ${styleConfig.textColor}`}
        >
          {styleConfig.icon}
          <span>{styleConfig.badgeLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          {stateBadge}
          <button 
            onClick={onToggleFavorite}
            className="flex items-center justify-center transition-colors outline-none cursor-pointer"
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-red-500 text-red-500 stroke-red-500" : "text-stone-300 hover:text-red-400"}`} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 space-y-3 mb-6">
        {/* Time and Duration */}
        <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
          <span>
            {event.timeEnd === "23:59"
              ? (event.openEnded ? `${t("fromTime", language)} ${event.timeStart}` : event.timeStart)
              : `${event.timeStart} — ${event.timeEnd}`}
          </span>
          {event.timeEnd !== "23:59" && (
            <>
              <span className="text-stone-300">·</span>
              <span className="text-stone-400">
                {getDurationString(event.timeStart, event.timeEnd)}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-light text-stone-900 text-xl md:text-2xl leading-tight">
          {event.title}
        </h3>

        {/* Description text */}
        <p className="text-stone-500 text-sm leading-relaxed font-light mt-2 -mb-1 whitespace-pre-line">
          {event.description}
        </p>

        {/* Location Spot info */}
        <div className="pt-4 flex items-start gap-3 mt-4 border-t border-transparent">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-stone-300" />
          <div>
            <span className="block text-stone-800 font-light text-sm">
              {event.locationName}
            </span>
            <p className="text-stone-400 text-[13px] font-light mt-0.5">
              {event.address}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-stone-200/60 flex flex-wrap gap-2 justify-between items-center -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
        {/* Calendar Add Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCalDropdownOpen(!calDropdownOpen)}
            className="text-xs font-light text-stone-400 hover:text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer p-1"
            title={t("addToCalendar", language)}
            id={`event-${event.id}-cal-btn`}
          >
            <Calendar className="w-3.5 h-3.5" /> {t("add", language) || "Ajouter"}
          </button>

          <AnimatePresence>
            {calDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 block"
                  style={{ display: "block" }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCalDropdownOpen(false); }}
                ></div>
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 bottom-full mb-2 z-40 w-52 bg-white border border-stone-200/60 shadow-lg p-1 space-y-0.5 text-[13px] font-light rounded-xl overflow-hidden"
                  id={`event-${event.id}-cal-choices`}
                >
                  <a
                    href={getGoogleCalendarUrl(event, startDate)}
                    target="_blank"
                    rel="noreferrer referrer"
                    onClick={() => setCalDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <span>Google Agenda <span className="text-[10px] text-stone-400">(1-clic)</span></span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  <a
                    href={getOutlookCalendarUrl(event, startDate)}
                    target="_blank"
                    rel="noreferrer referrer"
                    onClick={() => setCalDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <span>Outlook Web <span className="text-[10px] text-stone-400">(1-clic)</span></span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  <a
                    href={getYahooCalendarUrl(event, startDate)}
                    target="_blank"
                    rel="noreferrer referrer"
                    onClick={() => setCalDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <span>Yahoo Calendar <span className="text-[10px] text-stone-400">(1-clic)</span></span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      downloadEventICS(event, startDate);
                      setCalDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-left transition-colors cursor-pointer"
                  >
                    <span>Fichier de l'appareil (.ics)</span>
                    <Download className="w-3 h-3 text-stone-400" />
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Map Action */}
        <div className="relative">
          {event.directMapUrl ? (
            <a
              href={event.directMapUrl}
              target="_blank"
              rel="noreferrer referrer"
              className="text-xs font-light text-stone-600 hover:text-stone-900 flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-stone-200/60 hover:border-stone-300 transition-colors cursor-pointer"
              id={`event-${event.id}-map-btn`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {t("navigate", language)}
            </a>
          ) : (
          <>
          <button
            onClick={() => setMapDropdownOpen(!mapDropdownOpen)}
            className="text-xs font-light text-stone-600 hover:text-stone-900 flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-stone-200/60 hover:border-stone-300 transition-colors cursor-pointer"
            id={`event-${event.id}-map-btn`}
          >
            <MapPin className="w-3.5 h-3.5" />
            {t("navigate", language)}
          </button>

          {/* Micro-Dropdown menu for maps choices */}
          <AnimatePresence>
            {mapDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 block"
                  style={{ display: "block" }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMapDropdownOpen(false); }}
                ></div>
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-2 z-40 w-48 bg-white border border-stone-200/60 shadow-lg p-1 space-y-0.5 text-[13px] font-light rounded-xl overflow-hidden"
                  id={`event-${event.id}-map-choices`}
                >
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer referrer"
                    onClick={() => setMapDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  <a
                    href={appleMapsUrl}
                    onClick={() => setMapDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <span>Apple Plans</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noreferrer referrer"
                    onClick={() => setMapDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <span>Waze Navigation</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      handleCopyAddress();
                      setMapDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-left transition-colors cursor-pointer"
                  >
                    <span>{t("copyAddress", language) || "Copier l'adresse"}</span>
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-stone-400" />
                    )}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

