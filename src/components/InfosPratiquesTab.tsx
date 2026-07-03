/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppConfigs } from "../types";
import { 
  CheckCircle, 
  Phone, 
  MapPin, 
  Compass, 
  Info, 
  User, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Coffee,
  Navigation,
  Heart,
  MessageCircle
} from "lucide-react";
import { getPracticalChecklists } from "../utils/defaults";
import { t, Language } from "../utils/i18n";
import InteractiveMap, { MAP_LOCATIONS } from "./InteractiveMap";

interface InfosPratiquesTabProps {
  configs: AppConfigs;
  language: Language | null;
}

export default function InfosPratiquesTab({ configs, language }: InfosPratiquesTabProps) {
  // Main sub tab navigation
  const [currentSubTab, setCurrentSubTab] = useState<"general" | "places">("general");

  // Checklist local states
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("PIONEER_CHECKLIST");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getPracticalChecklists(language || "fr");
      }
    }
    return getPracticalChecklists(language || "fr");
  });

  useEffect(() => {
    setChecklist(getPracticalChecklists(language || "fr"));
  }, [language]);

  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    const savedStates = localStorage.getItem("PIONEER_CHECKLIST_STATES");
    if (savedStates) {
      try {
        return JSON.parse(savedStates);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Filter for places
  const [placesFilter, setPlacesFilter] = useState<"all" | "rendezvous" | "cafe" | "food" | "visit">("all");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Save states
  useEffect(() => {
    localStorage.setItem("PIONEER_CHECKLIST_STATES", JSON.stringify(checkedIds));
  }, [checkedIds]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetChecklist = () => {
    setCheckedIds({});
  };

  const completedCount = Object.values(checkedIds).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100) || 0;

  return (
    <div className="space-y-6">
      
      {/* Sub menu controls */}
      <div className="flex border-b border-stone-200/60 mb-6 font-medium">
        <button
          onClick={() => setCurrentSubTab("general")}
          className={`px-4 pb-3 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 ${
            currentSubTab === "general"
              ? "text-stone-900 border-stone-900"
              : "text-stone-400 border-transparent hover:text-stone-600"
          }`}
          id="subtab-general-btn"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">{t("tabInfos", language || "fr")}</span>
        </button>

        <button
          onClick={() => setCurrentSubTab("places")}
          className={`px-4 pb-3 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 ${
            currentSubTab === "places"
              ? "text-stone-900 border-stone-900"
              : "text-stone-400 border-transparent hover:text-stone-600"
          }`}
          id="subtab-places-btn"
        >
          <Coffee className="w-4 h-4" />
          <span className="text-sm">{t("goodAddresses", language || "fr")}</span>
        </button>
      </div>

      {/* RENDER CURRENT SUB-TAB CONTENT */}

      {/* SUB-TAB 1: LOGISTIQUE GENERAL */}
      {currentSubTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" id="practical-info-general-layout">
          
          {/* Column 1: Backing Checklist & Progress */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-stone-200/60 lg:pr-8 pb-8 lg:pb-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4">
                <h3 className="font-display font-light text-stone-900 text-2xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  {t("myPrep", language || "fr")}
                </h3>
                <span className="text-[10px] font-medium text-stone-500 bg-stone-50 px-2 rounded-full border border-stone-200/60">
                  {completedCount} / {checklist.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-6 space-y-1.5">
                <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute top-0 bottom-0 left-0 bg-stone-900 rounded-full"
                  />
                </div>
              </div>

              {/* List items */}
              <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                {checklist.map((item: any) => {
                  const isChecked = !!checkedIds[item.id];
                  return (
                    <label 
                      key={item.id}
                      className="flex items-start gap-3 p-2 rounded-xl transition-all cursor-pointer hover:bg-stone-50"
                      id={`checklist-lbl-${item.id}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                        className="mt-1 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                        id={`checklist-input-${item.id}`}
                      />
                      <span className={`text-sm select-none leading-relaxed ${
                        isChecked ? "text-stone-400 line-through font-light" : "text-stone-700 font-light"
                      }`}>
                        {item.item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-4 mt-2">
              <button
                onClick={handleResetChecklist}
                className="w-full py-2 text-xs text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 font-medium rounded-xl transition-colors cursor-pointer"
                id="reset-checklist-btn"
              >
                {t("resetChecklist", language || "fr")}
              </button>
            </div>
          </div>

          {/* Column 2: Coordinate contacts / Emergency */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:pl-8 pb-8 lg:pb-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4">
                <h3 className="font-display font-light text-stone-900 text-2xl flex items-center gap-2">
                  <User className="w-5 h-5 text-stone-400" />
                  {t("practicalContacts", language || "fr")}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Contact 1 */}
                <div className="p-4 bg-stone-50 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-medium text-stone-900">{configs.contactName1 || "Organisation"}</h4>
                      <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-0.5">Contact</p>
                    </div>
                  </div>
                  {configs.contactPhone1 && (
                    <div className="flex gap-2 mt-1">
                      <a
                        href={`tel:${configs.contactPhone1}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-call-1-btn"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Appeler
                      </a>
                      <a
                        href={`sms:${configs.contactPhone1}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-sms-1-btn"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact 2 */}
                {(configs.contactName2 || configs.contactPhone2) && (
                <div className="p-4 bg-stone-50 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-medium text-stone-900">{configs.contactName2}</h4>
                      <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-0.5">Contact</p>
                    </div>
                  </div>
                  {configs.contactPhone2 && (
                    <div className="flex gap-2 mt-1">
                      <a
                        href={`tel:${configs.contactPhone2}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-call-2-btn"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Appeler
                      </a>
                      <a
                        href={`sms:${configs.contactPhone2}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-sms-2-btn"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message
                      </a>
                    </div>
                  )}
                </div>
                )}
                
                {/* Contact 3 */}
                {(configs.contactName3 || configs.contactPhone3) && (
                <div className="p-4 bg-stone-50 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-medium text-stone-900">{configs.contactName3}</h4>
                      <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-0.5">Contact</p>
                    </div>
                  </div>
                  {configs.contactPhone3 && (
                    <div className="flex gap-2 mt-1">
                      <a
                        href={`tel:${configs.contactPhone3}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-call-3-btn"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Appeler
                      </a>
                      <a
                        href={`sms:${configs.contactPhone3}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-sms-3-btn"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message
                      </a>
                    </div>
                  )}
                </div>
                )}

                {/* Contact 4 */}
                {(configs.contactName4 || configs.contactPhone4) && (
                <div className="p-4 bg-stone-50 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-medium text-stone-900">{configs.contactName4}</h4>
                      <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-0.5">Contact</p>
                    </div>
                  </div>
                  {configs.contactPhone4 && (
                    <div className="flex gap-2 mt-1">
                      <a
                        href={`tel:${configs.contactPhone4}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-call-4-btn"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Appeler
                      </a>
                      <a
                        href={`sms:${configs.contactPhone4}`}
                        className="flex-1 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700 transition-colors shadow-sm"
                        id="contact-sms-4-btn"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message
                      </a>
                    </div>
                  )}
                </div>
                )}
              </div>
            </div>

            {/* Emergencies Info */}
            <div className="pt-4 border-t border-stone-100 mt-4 space-y-1.5 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-stone-800">Urgence Européenne : 112</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: BONNES ADRESSES BERLIN */}
      {currentSubTab === "places" && (
        <div className="animate-fade-in space-y-8">
          
          {/* Header and Filter Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200/60 pb-6 gap-4">
            <div>
              <h3 className="font-display font-light text-stone-900 text-3xl tracking-tight mb-2">
                {t("whereToGo", language || "fr")}
              </h3>
              <p className="text-[13px] font-light text-stone-500">
                {t("whereToGoDesc", language || "fr")}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-4 self-start">
              <button
                onClick={() => { setPlacesFilter("all"); setSelectedLocationId(null); }}
                className={`text-[13px] font-light transition-colors cursor-pointer relative pb-1 ${
                  placesFilter === "all"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {t("catAll", language || "fr")}
                {placesFilter === "all" && (
                  <motion.div layoutId="placesFilterInd" className="absolute bottom-0 left-0 right-0 h-px bg-stone-900" />
                )}
              </button>
              <button
                onClick={() => { setPlacesFilter("rendezvous"); setSelectedLocationId(null); }}
                className={`text-[13px] font-light transition-colors cursor-pointer relative pb-1 ${
                  placesFilter === "rendezvous"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {t("catProgram", language || "fr")}
                {placesFilter === "rendezvous" && (
                  <motion.div layoutId="placesFilterInd" className="absolute bottom-0 left-0 right-0 h-px bg-stone-900" />
                )}
              </button>
              <button
                onClick={() => { setPlacesFilter("cafe"); setSelectedLocationId(null); }}
                className={`text-[13px] font-light transition-colors cursor-pointer relative pb-1 ${
                  placesFilter === "cafe"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {t("catCafe", language || "fr")}
                {placesFilter === "cafe" && (
                  <motion.div layoutId="placesFilterInd" className="absolute bottom-0 left-0 right-0 h-px bg-stone-900" />
                )}
              </button>
              <button
                onClick={() => { setPlacesFilter("food"); setSelectedLocationId(null); }}
                className={`text-[13px] font-light transition-colors cursor-pointer relative pb-1 ${
                  placesFilter === "food"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {t("catFood", language || "fr")}
                {placesFilter === "food" && (
                  <motion.div layoutId="placesFilterInd" className="absolute bottom-0 left-0 right-0 h-px bg-stone-900" />
                )}
              </button>
              <button
                onClick={() => { setPlacesFilter("visit"); setSelectedLocationId(null); }}
                className={`text-[13px] font-light transition-colors cursor-pointer relative pb-1 ${
                  placesFilter === "visit"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {t("catVisit", language || "fr")}
                {placesFilter === "visit" && (
                  <motion.div layoutId="placesFilterInd" className="absolute bottom-0 left-0 right-0 h-px bg-stone-900" />
                )}
              </button>
            </div>
          </div>

          {/* Interactive Map Block */}
          <div>
            <InteractiveMap
              selectedLocationId={selectedLocationId}
              onSelectLocation={setSelectedLocationId}
              filterCategory={placesFilter}
            />
          </div>

          {/* Grid display of cards */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-medium font-mono text-stone-400 uppercase tracking-widest">
                {t("matchingPlaces", language || "fr")} ({MAP_LOCATIONS.filter((loc) => placesFilter === "all" || loc.category === placesFilter).length})
              </h4>
              {selectedLocationId && (
                <button
                  onClick={() => setSelectedLocationId(null)}
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  {t("resetSelection", language || "fr")}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {MAP_LOCATIONS.filter((loc) => placesFilter === "all" || loc.category === placesFilter).map((loc) => {
                  const isSelected = selectedLocationId === loc.id;
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      key={loc.id} 
                      className={`p-6 border rounded-2xl flex flex-col justify-between transition-all ${
                        isSelected
                          ? "bg-stone-50 border-stone-300"
                          : "bg-white border-stone-200/60 hover:border-stone-300"
                      }`}
                      id={`place-card-${loc.id}`}
                    >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-stone-400">
                          {loc.category === "rendezvous"
                            ? "Rendez-vous"
                            : loc.category === "cafe" 
                            ? "Café" 
                            : loc.category === "food" 
                            ? "Restauration" 
                            : "Visite"}
                        </span>
                      </div>

                      <h4 className="font-display font-light text-stone-900 text-xl">{loc.name}</h4>
                      <p className="text-[13px] font-light text-stone-500 leading-relaxed pt-1">{loc.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-light text-stone-400 min-w-0">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{loc.location}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedLocationId(loc.id);
                            document.getElementById("leaflet-interactive-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
                          }}
                          className={`py-1 px-3 text-[11px] font-light rounded-full transition-colors cursor-pointer border ${
                            isSelected ? "bg-stone-800 text-white border-stone-800" : "bg-transparent hover:bg-stone-50 text-stone-500 border-stone-200"
                          }`}
                          id={`btn-focus-${loc.id}`}
                        >
                          {isSelected ? "Centré" : "Voir"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
