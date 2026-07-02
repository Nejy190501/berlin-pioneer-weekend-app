/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppConfigs, PioneerEvent, DayOfWeek, EventCategory } from "../types";
import { 
  Sliders, 
  X, 
  RotateCcw, 
  Check, 
  Info, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Compass, 
  Coffee, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Calendar 
} from "lucide-react";
import { DEFAULT_CONFIGS, DEFAULT_EVENTS } from "../utils/defaults";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  configs: AppConfigs;
  onSave: (newConfigs: AppConfigs) => void;
  events: PioneerEvent[];
  onSaveEvents: (newEvents: PioneerEvent[]) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  configs,
  onSave,
  events,
  onSaveEvents,
}: SettingsModalProps) {
  // Tabs: "config" (logistics) | "events" (program scheduling)
  const [activeSubTab, setActiveSubTab] = useState<"config" | "events">("config");

  // Local configurations state
  const [formState, setFormState] = useState<AppConfigs>({ ...configs });
  // Local events state
  const [formEvents, setFormEvents] = useState<PioneerEvent[]>([]);

  // Sub-state for editing/creating an event
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<PioneerEvent>>({});

  const [successMsg, setSuccessMsg] = useState(false);

  // Synchronize when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormState({ ...configs });
      setFormEvents([...events]);
      setEditingEventId(null);
      setActiveSubTab("config");
    }
  }, [isOpen, configs, events]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleGlobalSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onSaveEvents(formEvents);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  const handleResetConfigs = () => {
    if (
      window.confirm("Voulez-vous restaurer les paramètres logistiques d'origine ?")
    ) {
      setFormState({ ...DEFAULT_CONFIGS });
    }
  };

  const handleResetEvents = () => {
    if (
      window.confirm("Voulez-vous restaurer tout le programme d'activités de Berlin par défaut ?")
    ) {
      setFormEvents([...DEFAULT_EVENTS]);
      setEditingEventId(null);
    }
  };

  // --- ACTIONS FOR EVENT EDITOR ---

  const handleStartEdit = (event: PioneerEvent) => {
    setEditingEventId(event.id);
    setEditingEvent({ ...event });
  };

  const handleStartCreate = () => {
    setEditingEventId("new");
    setEditingEvent({
      id: "evt-" + Math.random().toString(36).substr(2, 9),
      title: "",
      timeStart: "09:30",
      timeEnd: "11:30",
      day: "Samedi",
      locationName: "",
      address: "",
      description: "",
      category: "ministry",
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Supprimer définitivement cette activité du programme ?")) {
      setFormEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleSaveEventSubform = () => {
    if (!editingEvent.title || !editingEvent.timeStart || !editingEvent.timeEnd || !editingEvent.locationName || !editingEvent.address) {
      alert("Veuillez remplir tous les champs obligatoires (Titre, Horaires, Lieu, Adresse).");
      return;
    }

    // Basic HH:MM regex checks
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(editingEvent.timeStart) || !timeRegex.test(editingEvent.timeEnd)) {
      alert("Veuillez saisir les horaires au format HH:MM (ex: 09:30).");
      return;
    }

    const updatedEvent = editingEvent as PioneerEvent;

    setFormEvents((prev) => {
      const exists = prev.some((e) => e.id === updatedEvent.id);
      if (exists) {
        return prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
      } else {
        return [...prev, updatedEvent];
      }
    });

    setEditingEventId(null);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "ministry":
        return <Compass className="w-3.5 h-3.5 text-stone-500" />;
      case "food":
        return <Coffee className="w-3.5 h-3.5 text-stone-500" />;
      case "relaxation":
        return <Sparkles className="w-3.5 h-3.5 text-stone-500" />;
      case "spiritual":
        return <BookOpen className="w-3.5 h-3.5 text-stone-500" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs select-text">
      <div
        id="settings-container-modal"
        className="w-full max-w-xl bg-[#faf9f6] rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/60 bg-stone-50/50">
          <div className="flex items-center gap-2.5 text-stone-800">
            <Sliders className="w-5 h-5 text-stone-500" />
            <h2 className="font-display font-light text-lg tracking-tight text-stone-900">
              Personnaliser l'événement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
            id="close-settings-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher - ONLY when not in focused event editing mode */}
        {editingEventId === null && (
          <div className="flex border-b border-stone-200/50 bg-stone-50/30 text-stone-500 text-xs font-medium">
            <button
              onClick={() => setActiveSubTab("config")}
              className={`flex-1 py-3 border-b-2 text-center transition-all cursor-pointer ${
                activeSubTab === "config"
                  ? "text-stone-900 border-stone-900 font-medium"
                  : "border-transparent hover:text-stone-850"
              }`}
            >
              Logistique Générale
            </button>
            <button
              onClick={() => setActiveSubTab("events")}
              className={`flex-1 py-3 border-b-2 text-center transition-all cursor-pointer ${
                activeSubTab === "events"
                  ? "text-stone-900 border-stone-900 font-medium"
                  : "border-transparent hover:text-stone-850"
              }`}
            >
              Activités du Programme ({formEvents.length})
            </button>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* 1. VIEW CONFIGS TAB */}
            {editingEventId === null && activeSubTab === "config" && (
              <motion.div
                key="config-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-2xl flex gap-3 text-stone-600 text-[13px] leading-relaxed font-light">
                  <Info className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                  <p>
                    Ajustez les informations clés de l'assemblée, les adresses, les organisateurs locaux et la date de démarrage globale. Tout est sauvegardé localement sur cet appareil.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Congregation Name */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Nom de l'assemblée
                    </label>
                    <input
                      type="text"
                      name="congregationName"
                      value={formState.congregationName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  {/* Scale Estimate */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Estimation Participants
                    </label>
                    <input
                      type="text"
                      name="scaleEstimate"
                      value={formState.scaleEstimate}
                      onChange={handleChange}
                      placeholder="Ex. 15 - 50 personnes"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Date de début (Vendredi)
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formState.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  {/* WhatsApp Group Link */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Lien du Groupe WhatsApp
                    </label>
                    <input
                      type="url"
                      name="whatsappGroupLink"
                      value={formState.whatsappGroupLink}
                      onChange={handleChange}
                      placeholder="https://chat.whatsapp.com/..."
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Kingdom Hall Address */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                    Adresse de la Salle du Royaume
                  </label>
                  <input
                    type="text"
                    name="kingdomHallAddress"
                    value={formState.kingdomHallAddress}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                  />
                </div>

                {/* Contact 1 */}
                <div className="border-t border-stone-200/60 pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Nom Coordinateur 1
                    </label>
                    <input
                      type="text"
                      name="contactName1"
                      value={formState.contactName1 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Téléphone Coordinateur 1
                    </label>
                    <input
                      type="text"
                      name="contactPhone1"
                      value={formState.contactPhone1 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Contact 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Nom Coordinateur 2
                    </label>
                    <input
                      type="text"
                      name="contactName2"
                      value={formState.contactName2 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Téléphone Coordinateur 2
                    </label>
                    <input
                      type="text"
                      name="contactPhone2"
                      value={formState.contactPhone2 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Contact 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Nom Coordinateur 3
                    </label>
                    <input
                      type="text"
                      name="contactName3"
                      value={formState.contactName3 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Téléphone Coordinateur 3
                    </label>
                    <input
                      type="text"
                      name="contactPhone3"
                      value={formState.contactPhone3 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Contact 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Nom Coordinateur 4
                    </label>
                    <input
                      type="text"
                      name="contactName4"
                      value={formState.contactName4 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-stone-400">
                      Téléphone Coordinateur 4
                    </label>
                    <input
                      type="text"
                      name="contactPhone4"
                      value={formState.contactPhone4 || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-250 flex justify-end">
                  <button
                    type="button"
                    onClick={handleResetConfigs}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-500 hover:text-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Réinitialiser les infos d'origine
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. PROGRAM ACTIVITIES MASTER TAB */}
            {editingEventId === null && activeSubTab === "events" && (
              <motion.div
                key="events-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/50">
                  <p className="text-[13px] font-light text-stone-500">
                    Modifiez ou créez des activités sur mesure.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-950 text-white rounded-full text-xs font-medium hover:bg-stone-850 transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter une activité
                  </button>
                </div>

                {/* Events List grouped by day */}
                <div className="space-y-5 max-h-[350px] overflow-y-auto pr-1">
                  {(["Vendredi", "Samedi", "Dimanche"] as DayOfWeek[]).map((day) => {
                    const dayEvents = formEvents.filter((e) => e.day === day);
                    return (
                      <div key={day} className="space-y-2">
                        <h4 className="text-xs font-medium font-mono text-stone-400 uppercase tracking-widest pl-1">{day}</h4>
                        {dayEvents.length === 0 ? (
                          <p className="text-xs font-light text-stone-400 italic pl-3">Aucune activité prévue.</p>
                        ) : (
                          <div className="space-y-2">
                            {dayEvents.map((evt) => (
                              <div
                                key={evt.id}
                                className="p-3 bg-white border border-stone-150 rounded-xl flex items-center justify-between gap-4 group"
                              >
                                <div className="min-w-0 flex items-center gap-3">
                                  <div className="p-2 bg-stone-50 rounded-lg shrink-0">
                                    {getCategoryIcon(evt.category)}
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-[13px] font-medium text-stone-800 truncate">{evt.title}</h5>
                                    <p className="text-[11px] text-stone-400 font-light truncate">
                                      {evt.timeEnd === "23:59" ? `À partir de ${evt.timeStart}` : `${evt.timeStart} — ${evt.timeEnd}`} · {evt.locationName}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0 opacity-80 md:opacity-0 group-hover:opacity-105 transition-all">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(evt)}
                                    className="p-1 px-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                                    title="Modifier"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteEvent(evt.id)}
                                    className="p-1 px-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-stone-250 flex justify-end">
                  <button
                    type="button"
                    onClick={handleResetEvents}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-500 hover:text-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurer le programme d'origine
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. NESTED EVENT EDITING / CREATING FORM OVERLAY */}
            {editingEventId !== null && (
              <motion.div
                key="event-subform"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {/* Back Link */}
                <button
                  type="button"
                  onClick={() => setEditingEventId(null)}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer mb-2 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Retour à la liste d'activités
                </button>

                <h3 className="font-display font-light text-stone-850 text-xl border-b border-stone-200/50 pb-2">
                  {editingEventId === "new" ? "Ajouter une activité" : `Modifier l'activité`}
                </h3>

                {/* Form fields */}
                <div className="space-y-4">
                  {/* Event Title */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                      Titre de l'activité *
                    </label>
                    <input
                      type="text"
                      value={editingEvent.title || ""}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      required
                      placeholder="Ex: Prédication en groupe, Buffet, etc."
                      className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  {/* Day, StartHour, EndHour */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                        Jour de l'événement
                      </label>
                      <select
                        value={editingEvent.day || "Samedi"}
                        onChange={(e) => setEditingEvent({ ...editingEvent, day: e.target.value as DayOfWeek })}
                        className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                      >
                        <option value="Vendredi">Vendredi</option>
                        <option value="Samedi">Samedi</option>
                        <option value="Dimanche">Dimanche</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                        Heure de Début *
                      </label>
                      <input
                        type="text"
                        value={editingEvent.timeStart || "09:30"}
                        onChange={(e) => setEditingEvent({ ...editingEvent, timeStart: e.target.value })}
                        required
                        placeholder="HH:MM (ex: 09:30)"
                        className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                        Heure de Fin *
                      </label>
                      <input
                        type="text"
                        value={editingEvent.timeEnd || "11:30"}
                        onChange={(e) => setEditingEvent({ ...editingEvent, timeEnd: e.target.value })}
                        required
                        placeholder="HH:MM (ex: 11:30)"
                        className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                        Catégorie
                      </label>
                      <select
                        value={editingEvent.category || "ministry"}
                        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as EventCategory })}
                        className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                      >
                        <option value="ministry">Prédication (ministry)</option>
                        <option value="food">Repas fraternel (food)</option>
                        <option value="relaxation">Détente (relaxation)</option>
                        <option value="spiritual">Rassemblement (spiritual)</option>
                        <option value="other">Autre (other)</option>
                      </select>
                    </div>

                    {/* Location Name */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                        Nom du Lieu *
                      </label>
                      <input
                        type="text"
                        value={editingEvent.locationName || ""}
                        onChange={(e) => setEditingEvent({ ...editingEvent, locationName: e.target.value })}
                        required
                        placeholder="Ex: Salle du Royaume, Buffet Royal, etc."
                        className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                      Adresse Physique *
                    </label>
                    <input
                      type="text"
                      value={editingEvent.address || ""}
                      onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                      required
                      placeholder="Ex: Naumburger Str. 37, 12057 Berlin"
                      className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                      Description de l'activité
                    </label>
                    <textarea
                      value={editingEvent.description || ""}
                      rows={3}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      maxLength={1000}
                      placeholder="Résumez l'activité et donnez des détails utiles..."
                      className="w-full px-3 py-2 bg-white border border-stone-200/80 rounded-2xl text-sm font-light text-stone-800 focus:outline-none focus:border-stone-900 leading-relaxed resize-none"
                    />
                  </div>
                </div>

                {/* Subform actions */}
                <div className="pt-4 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingEventId(null)}
                    className="px-4 py-2 hover:bg-stone-200 rounded-xl text-xs font-semibold text-stone-600 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEventSubform}
                    className="px-5 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Enregistrer l'activité
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions for the overarching modal */}
        {editingEventId === null && (
          <div className="p-4 bg-stone-50 border-t border-stone-200/60 flex items-center justify-between">
            <div></div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleGlobalSave}
                className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                id="save-settings-btn"
              >
                {successMsg ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    Enregistré !
                  </>
                ) : (
                  "Tout sauvegarder"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
