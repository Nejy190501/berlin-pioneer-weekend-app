/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppConfigs, PioneerEvent, DayOfWeek } from "./types";
import {
  DEFAULT_CONFIGS,
  getDefaultEvents,
  getEventState,
} from "./utils/defaults";
import { t, Language } from "./utils/i18n";
import { downloadFullScheduleICS } from "./utils/calendar";
import EventCard from "./components/EventCard";
import InfosPratiquesTab from "./components/InfosPratiquesTab";
import SettingsModal from "./components/SettingsModal";
import {
  Calendar,
  Compass,
  Info,
  Sliders,
  Share2,
  ExternalLink,
  Check,
  Users,
  AlertTriangle,
  Clock,
  Heart,
  CalendarCheck,
  ChevronRight,
  Filter,
  MessageSquare,
  Coffee,
  Sparkles,
  BookOpen,
  LayoutGrid,
  BellRing,
  Hourglass,
  AlertCircle,
  ArrowUp,
  Search,
  X,
} from "lucide-react";

export default function App() {
  // Force clean up of dark mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("PIONEER_THEME");
  }, []);

  // Configs state
  const [configs, setConfigs] = useState<AppConfigs>(DEFAULT_CONFIGS);
  
  // Language State
  const [language, setLanguage] = useState<Language | null>(() => {
    return (localStorage.getItem("PIONEER_LANG") as Language) || null;
  });

  // Events state
  const [events, setEvents] = useState<PioneerEvent[]>(getDefaultEvents(language || "fr"));
  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);
  // Active Tab
  const [activeTab, setActiveTab] = useState<string>("overview");
  // Client-side quick filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // Client-side search state
  const [searchTerm, setSearchTerm] = useState("");
  // Real-time calculation mode (simulation removed)
  const simMode = "real";
  const simTime = "";
  // Setting Modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Share copy confirmation
  const [copiedApp, setCopiedApp] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Offline detection states
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  // PWA install states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Weather state with elegant fallback
  const [weather, setWeather] = useState({
    temp: 18,
    condition: "Ciel dégagé",
    emoji: "🌤️"
  });

  // Focus highliter state
  const [highlightEventId, setHighlightEventId] = useState<string | null>(null);

  // Online monitoring effect
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // PWA trigger setup
  useEffect(() => {
    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforePrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  // Weather fetcher effect for Berlin free open meteo forecast API (no keys needed!)
  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current_weather=true");
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.current_weather && isMounted) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          
          let condition = "Partiellement ensoleillé";
          let emoji = "🌤️";
          
          if (code === 0) { condition = "Ensoleillé"; emoji = "☀️"; }
          else if ([1, 2, 3].includes(code)) { condition = "Partiellement nuageux"; emoji = "🌤️"; }
          else if ([45, 48].includes(code)) { condition = "Brouillard"; emoji = "🌫️"; }
          else if ([51, 53, 55].includes(code)) { condition = "Bruine légère"; emoji = "🌦️"; }
          else if ([61, 63, 65].includes(code)) { condition = "Pluie"; emoji = "🌧️"; }
          else if ([71, 73, 75].includes(code)) { condition = "Chutes de neige"; emoji = "🌨️"; }
          else if ([80, 81, 82].includes(code)) { condition = "Averses de pluie"; emoji = "🌦️"; }
          else if ([95, 96, 99].includes(code)) { condition = "Orageux"; emoji = "⛈️"; }
          
          setWeather({ temp, condition, emoji });
        }
      } catch (e) {
        // Safe failover
      }
    };
    
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Ticks weather every 10 min
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Quick focus scroll handler
  const handleFocusEvent = (eventId: string, day: string) => {
    let tab = "overview";
    if (day === "Vendredi") tab = "fri";
    else if (day === "Samedi") tab = "sat";
    else if (day === "Dimanche") tab = "sun";
    
    setActiveTab(tab);
    
    setTimeout(() => {
      const card = document.getElementById(`event-card-${eventId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightEventId(eventId);
        setTimeout(() => setHighlightEventId(null), 3500); // 3.5s elegant highlight
      }
    }, 250);
  };

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Onboarding Intro Splash Screen
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [introCountdown, setIntroCountdown] = useState<number>(4);

  useEffect(() => {
    if (!showIntro) return;

    const interval = setInterval(() => {
      setIntroCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSkipIntro();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showIntro]);

  const handleSkipIntro = () => {
    setShowIntro(false);
  };

  // Tick clock to update live countdown widget in real-time
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 15000); // Ticks every 15 seconds to ensure fluid on-screen countdowns
    return () => clearInterval(timerId);
  }, []);

  const currentHour = now.getHours();
  let timeGreeting = "Bonjour";
  if (currentHour >= 18 || currentHour < 5) timeGreeting = "Bonsoir";

  // Convert configs & events from storage
  useEffect(() => {
    const overrideDefaultsMode = true; // force refresh for this prompt
    
    const savedConfigs = localStorage.getItem("PIONEER_CONFIGS");
    if (savedConfigs && !overrideDefaultsMode) {
      try {
        const parsed = JSON.parse(savedConfigs);
        if (parsed && parsed.congregationName === "Assemblée de Berlin-Mitte") {
          parsed.congregationName = "Berlin Französisch";
          localStorage.setItem("PIONEER_CONFIGS", JSON.stringify(parsed));
        }
        setConfigs(parsed);
      } catch (e) {
        setConfigs(DEFAULT_CONFIGS);
      }
    } else {
       setConfigs(DEFAULT_CONFIGS);
       localStorage.setItem("PIONEER_CONFIGS", JSON.stringify(DEFAULT_CONFIGS));
    }

    const savedEvents = localStorage.getItem("PIONEER_EVENTS");
    if (savedEvents && !overrideDefaultsMode) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        setEvents(getDefaultEvents(language || "fr"));
      }
    } else {
       setEvents(getDefaultEvents(language || "fr"));
       localStorage.setItem("PIONEER_EVENTS", JSON.stringify(getDefaultEvents(language || "fr")));
    }

    const savedFavs = localStorage.getItem("PIONEER_FAVORITES");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (eventId: string) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      localStorage.setItem("PIONEER_FAVORITES", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleSaveConfigs = (newConfigs: AppConfigs) => {
    setConfigs(newConfigs);
    localStorage.setItem("PIONEER_CONFIGS", JSON.stringify(newConfigs));
  };

  const handleSaveEvents = (newEvents: PioneerEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem("PIONEER_EVENTS", JSON.stringify(newEvents));
  };

  const handleShareApp = () => {
    const appUrl = window.location.href;
    const shareMessage = `Bonjour ! Voici le programme interactif et pratique pour notre Week-end Pionnier à Berlin :\n\n📍 Assemblée : ${configs.congregationName}\n📅 Début : ${formatDisplayDate(configs.startDate)}\n\n👉 Suis les horaires, consulte les adresses de prédication GPS, et télécharge les événements dans ton calendrier mobile directement sur le lien ici :\n${appUrl}\n\nFraternellement ! 🌟`;

    navigator.clipboard.writeText(shareMessage);
    setCopiedApp(true);
    setTimeout(() => setCopiedApp(false), 2500);
  };

  // Convert Date String YYYY-MM-DD into French beautiful dates
  const formatDisplayDate = (dateStr: string, offsetDays: number = 0) => {
    try {
      const d = new Date(`${dateStr}T12:00:00`);
      if (offsetDays > 0) {
        d.setDate(d.getDate() + offsetDays);
      }
      return d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const fryDayString = formatDisplayDate(configs.startDate, 0);
  const satDayString = formatDisplayDate(configs.startDate, 1);
  const sunDayString = formatDisplayDate(configs.startDate, 2);

  // Helper date object calculators
  const getEventDatesObj = (e: PioneerEvent) => {
    let dayOffset = 0;
    if (e.day === "Samedi") dayOffset = 1;
    if (e.day === "Dimanche") dayOffset = 2;

    const baseDate = new Date(`${configs.startDate}T12:00:00`);
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + dayOffset);
    const datStr = targetDate.toISOString().split("T")[0];

    return {
      start: new Date(`${datStr}T${e.timeStart}:00`),
      end: new Date(`${datStr}T${e.timeEnd}:00`),
    };
  };

  // Pre-calculate count states and realtime positions
  const parsedEvents = events.map((e) => {
    const { start, end } = getEventDatesObj(e);
    return { event: e, start, end };
  });

  // Calculate dynamic countdowns & trackers
  const activeEventData = parsedEvents.find(
    ({ start, end }) => now >= start && now <= end,
  );
  const upcomingEvents = parsedEvents
    .filter(({ start }) => start > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  const nextEventData = upcomingEvents[0];

  const firstEventStart =
    parsedEvents.length > 0
      ? parsedEvents.reduce(
          (min, cur) => (cur.start < min ? cur.start : min),
          parsedEvents[0].start,
        )
      : null;
  const isWeekendUpcoming = firstEventStart ? now < firstEventStart : false;

  const lastEventEnd =
    parsedEvents.length > 0
      ? parsedEvents.reduce(
          (max, cur) => (cur.end > max ? cur.end : max),
          parsedEvents[0].end,
        )
      : null;
  const isWeekendOver = lastEventEnd ? now > lastEventEnd : false;

  const getFriendlyDurationLeft = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const totalMins = Math.floor(totalSecs / 60);
    if (totalMins < 60) {
      return `${totalMins} min`;
    }
    const hrs = Math.floor(totalMins / 60);
    const remainingMins = totalMins % 60;
    return remainingMins > 0 ? `${hrs} h ${remainingMins} min` : `${hrs} h`;
  };

  const getWeekendCountdown = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const totalMins = Math.floor(totalSecs / 60);
    const totalHrs = Math.floor(totalMins / 60);
    return {
      days: Math.floor(totalHrs / 24),
      hrs: totalHrs % 24,
      mins: totalMins % 60,
      secs: totalSecs % 60,
    };
  };

  // Group events by Day
  const getEventsByDay = (day: DayOfWeek) => {
    return events.filter((e) => e.day === day);
  };

  // Category filter resolver
  const getFilteredEvents = (day: DayOfWeek) => {
    let dayEvents = getEventsByDay(day);
    
    // Apply category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "favorites") {
        dayEvents = dayEvents.filter((e) => favorites.includes(e.id));
      } else {
        dayEvents = dayEvents.filter((e) => e.category === selectedCategory);
      }
    }

    // Apply keyword search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      dayEvents = dayEvents.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term) ||
          e.locationName.toLowerCase().includes(term) ||
          e.address.toLowerCase().includes(term)
      );
    }
    
    return dayEvents;
  };

  // Pre-calculate counts based on all states
  const totalEventsCount = events.length;
  const eventStates = events.map((e) =>
    getEventState(e, configs.startDate, simMode, simTime),
  );
  const activeEventsCount = eventStates.filter((s) => s === "active").length;
  const pastEventsCount = eventStates.filter((s) => s === "past").length;
  const futureEventsCount = eventStates.filter((s) => s === "future").length;

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="min-h-screen flex flex-col items-center justify-center p-8 select-none cursor-pointer"
          onClick={language ? handleSkipIntro : undefined}
        >
          {!language ? (
            <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-xl md:text-2xl text-stone-600 font-light mb-8">
                Choisissez votre langue<br/><span className="text-sm mt-2 block">Wählen Sie Ihre Sprache</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => { setLanguage("fr"); localStorage.setItem("PIONEER_LANG", "fr"); setEvents(getDefaultEvents("fr")); }} className="px-8 py-3 bg-stone-900 hover:bg-stone-800 transition-colors text-white rounded-full text-sm font-medium">🇫🇷 Français</button>
                <button onClick={() => { setLanguage("de"); localStorage.setItem("PIONEER_LANG", "de"); setEvents(getDefaultEvents("de")); }} className="px-8 py-3 bg-stone-900 hover:bg-stone-800 transition-colors text-white rounded-full text-sm font-medium">🇩🇪 Deutsch</button>
              </div>
            </div>
          ) : (
            <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center justify-center">
              <div className="space-y-4">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-lg md:text-xl text-stone-600 font-light max-w-xs mx-auto px-4 leading-relaxed"
                >
                  {language === "fr" ? timeGreeting : (currentHour >= 18 || currentHour < 5 ? "Guten Abend" : "Guten Tag")} {t("welcomeText", language)}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-4 pt-6"
              >
                <div className="w-12 h-px bg-stone-200 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 w-1/3 bg-stone-400 rounded-full"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="pt-2"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkipIntro();
                  }}
                  className="text-[10px] font-mono tracking-widest text-stone-400 hover:text-stone-900 transition-colors uppercase px-4 py-2 cursor-pointer select-none"
                >
                  {t("enterBtn", language)}
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="app-main-layout"
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "none" }}
          transition={{ duration: 0.4 }}
          className="min-h-screen pb-16 flex flex-col justify-between selection:bg-stone-200 transition-colors duration-300 select-text"
        >
          {/* Main Container Content */}
          <div className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-8 pt-12 md:pt-16">
        {/* Elegant Minimalist Header Row */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-stone-200/60"
          id="app-executive-header"
        >
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-medium text-stone-400 tracking-widest font-mono flex items-center gap-2">
              <Compass className="w-3 h-3" />
              {configs.congregationName || DEFAULT_CONFIGS.congregationName}
            </span>
            <h1 className="font-display font-light text-stone-900 text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
              Week-end Pionnier
            </h1>
            <div className="flex flex-wrap items-center gap-3">
               <button onClick={handleShareApp} className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full text-[13px] font-medium hover:bg-stone-800 transition-colors cursor-pointer select-none shadow-sm">
                  {copiedApp ? <Check className="w-3.5 h-3.5"/> : <Share2 className="w-3.5 h-3.5"/>}
                  {copiedApp ? t("linkCopied", language || "fr") : t("shareApp", language || "fr")}
               </button>
               <button onClick={() => downloadFullScheduleICS(events, configs.startDate)} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200/80 text-stone-700 rounded-full text-[13px] font-medium hover:bg-stone-50 transition-colors cursor-pointer select-none shadow-sm">
                  <Calendar className="w-3.5 h-3.5"/> 
                  {t("addToCalendar", language || "fr")}
               </button>

            </div>
          </div>
          
          {/* Weather & Location Miniature Widget */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
             {/* Offline Badge */}
             {isOffline && (
               <div className="flex bg-stone-100 border border-stone-200 rounded-2xl p-4 gap-3 items-center text-stone-600 select-none">
                 <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                 <div className="text-left">
                   <p className="text-xs font-medium">{t("offlineMode", language || "fr")}</p>
                   <p className="text-[10px] font-light">Données locales actives</p>
                 </div>
               </div>
             )}

             {/* PWA Install Button */}
             {showInstallBtn && (
               <button 
                 onClick={handleInstallPWA} 
                 className="flex bg-stone-900 border border-stone-900 text-white rounded-2xl p-4 gap-3 items-center transition-all hover:bg-stone-800 select-none text-left cursor-pointer shadow-sm"
               >
                 <CalendarCheck className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
                 <div>
                   <p className="text-xs font-semibold">{t("installApp", language || "fr")}</p>
                   <p className="text-[10px] text-stone-300 font-light">{t("addToHomeScreen", language || "fr")}</p>
                 </div>
               </button>
             )}

             <div className="flex bg-stone-50 border border-stone-200/50 rounded-2xl p-4 gap-4 items-center shrink-0">
               <div className="text-3xl">{weather.emoji}</div>
               <div className="text-left">
                  <p className="text-sm font-medium text-stone-800">Berlin, DE</p>
                  <p className="text-xs font-light text-stone-500">{weather.temp}°C  ·  {weather.condition}</p>
               </div>
             </div>
          </div>

        </div>

        {/* Minimalist En Direct Widget */}
        <div className="mb-16 animate-fade-in" id="live-tracker-widget">
          {isWeekendUpcoming &&
            firstEventStart &&
            parsedEvents.length > 0 &&
            (() => {
              const cd = getWeekendCountdown(
                firstEventStart.getTime() - now.getTime(),
              );
              return (
                <div className="py-8 border-b border-stone-200/60 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <h3 className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-3">
                      Plus que {cd.days} jour{cd.days > 1 ? "s" : ""}, {cd.hrs} heure{cd.hrs > 1 ? "s" : ""} avant Berlin !
                    </h3>
                    <p className="text-2xl md:text-3xl font-display font-light text-stone-900 mb-2 leading-tight">
                      {parsedEvents[0].event.title}
                    </p>
                    <p className="text-[13px] font-light text-stone-500 mb-4">
                      {parsedEvents[0].event.day} à {parsedEvents[0].event.timeStart} {parsedEvents[0].event.timeEnd !== "23:59" && ` — ${parsedEvents[0].event.timeEnd}`} · {parsedEvents[0].event.locationName}
                    </p>
                    <button
                      onClick={() => handleFocusEvent(parsedEvents[0].event.id, parsedEvents[0].event.day)}
                      className="text-xs font-light text-stone-600 hover:text-stone-950 border border-stone-200/70 hover:border-stone-300 rounded-full py-1.5 px-3 flex items-center gap-1.5 hover:bg-stone-50 transition-all cursor-pointer w-fit select-none"
                    >
                      <span>Afficher dans l'agenda</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 font-display">
                    <div className="text-center w-14">
                      <span className="text-4xl font-light text-stone-900 block leading-none mb-2">{cd.days}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Jour{cd.days > 1 ? "s": ""}</span>
                    </div>
                    <span className="text-3xl font-light text-stone-200 mb-4">:</span>
                    <div className="text-center w-14">
                      <span className="text-4xl font-light text-stone-900 block leading-none mb-2">{String(cd.hrs).padStart(2, "0")}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Hr{cd.hrs > 1 ? "s": ""}</span>
                    </div>
                    <span className="text-3xl font-light text-stone-200 mb-4">:</span>
                    <div className="text-center w-14">
                      <span className="text-4xl font-light text-stone-900 block leading-none mb-2">{String(cd.mins).padStart(2, "0")}</span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Min</span>
                    </div>
                  </div>
                </div>
              );
            })()}

          {activeEventData && (
            <div className="py-8 border-b border-stone-200/60">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-block text-[10px] font-medium text-stone-800 uppercase tracking-widest mb-3">
                    En cours
                  </span>
                  <h4 className="text-2xl md:text-3xl font-display font-light text-stone-900 mb-2">
                    {activeEventData.event.title}
                  </h4>
                  <p className="text-[13px] font-light text-stone-500 mb-4">
                    Reste {getFriendlyDurationLeft(activeEventData.end.getTime() - now.getTime())}
                  </p>
                  <button
                    onClick={() => handleFocusEvent(activeEventData.event.id, activeEventData.event.day)}
                    className="text-xs font-light text-stone-600 hover:text-stone-950 border border-stone-200/70 hover:border-stone-300 rounded-full py-1.5 px-3 flex items-center gap-1.5 hover:bg-stone-50 transition-all cursor-pointer w-fit select-none animate-pulse"
                  >
                    <span>Focaliser sur l'activité active</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {nextEventData && (
                  <div className="md:text-right flex flex-col md:items-end">
                    <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-2 block">
                      Suivi de
                    </span>
                    <button
                      onClick={() => handleFocusEvent(nextEventData.event.id, nextEventData.event.day)}
                      className="text-lg font-light text-stone-800 hover:text-stone-950 text-left md:text-right hover:underline"
                    >
                      {nextEventData.event.title}
                    </button>
                    <p className="text-[13px] font-light text-stone-500 mt-1">
                      Dans {getFriendlyDurationLeft(nextEventData.start.getTime() - now.getTime())}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!activeEventData &&
            !isWeekendUpcoming &&
            !isWeekendOver &&
            nextEventData && (
              <div className="py-8 border-b border-stone-200/60">
                <div className="p-6 md:p-8 rounded-3xl border border-dashed border-stone-300 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-lg font-light text-stone-800 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full border border-stone-400"></span> Temps libre
                    </h4>
                    <p className="text-[13px] font-light text-stone-500">
                      En attendant la prochaine courte activité.
                    </p>
                  </div>

                  <div className="sm:text-right flex flex-col sm:items-end">
                    <span className="text-[10px] text-stone-400 block uppercase tracking-widest mb-2">
                      Prochain rendez-vous
                    </span>
                    <button
                      onClick={() => handleFocusEvent(nextEventData.event.id, nextEventData.event.day)}
                      className="text-lg font-light text-stone-900 hover:text-stone-950 text-left sm:text-right hover:underline mb-1"
                    >
                      {nextEventData.event.title}
                    </button>
                    <p className="text-[13px] font-light text-stone-500">
                      Débute à {nextEventData.event.timeStart} (dans {getFriendlyDurationLeft(nextEventData.start.getTime() - now.getTime())})
                    </p>
                  </div>
                </div>
              </div>
            )}

          {isWeekendOver && (
            <div className="py-12 border-b border-stone-200/60 text-stone-500 text-center">
              <div className="max-w-md mx-auto">
                <h4 className="text-lg font-light text-stone-900 mb-2">
                   Le programme est terminé
                </h4>
                <p className="text-[13px] font-light">Merci pour ce magnifique week-end.</p>
              </div>
            </div>
          )}
        </div>


        {/* Minimalist Horizontal Navigation Tabs */}
        <div
          className="flex flex-wrap items-center gap-8 mb-12 border-b border-stone-200/60 overflow-x-auto scrollbar-none font-display"
          id="app-navigation-segmented-tabs"
        >
          {/* Vue Générale */}
          <button
            onClick={() => {
              setActiveTab("overview");
              setSelectedCategory("all");
            }}
            className={`pb-4 text-[15px] transition-colors cursor-pointer select-none whitespace-nowrap relative ${
              activeTab === "overview"
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {t("tabOverview", language || "fr")}
            {activeTab === "overview" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-stone-900"
              />
            )}
          </button>

          {/* Vendredi */}
          <button
            onClick={() => setActiveTab("fri")}
            className={`pb-4 text-[15px] transition-colors cursor-pointer select-none whitespace-nowrap relative ${
              activeTab === "fri"
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {t("tabFri", language || "fr")}
            {activeTab === "fri" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-stone-900"
              />
            )}
          </button>

          {/* Samedi */}
          <button
            onClick={() => setActiveTab("sat")}
            className={`pb-4 text-[15px] transition-colors cursor-pointer select-none whitespace-nowrap relative ${
              activeTab === "sat"
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {t("tabSat", language || "fr")}
            {activeTab === "sat" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-stone-900"
              />
            )}
          </button>

          {/* Dimanche */}
          <button
            onClick={() => setActiveTab("sun")}
            className={`pb-4 text-[15px] transition-colors cursor-pointer select-none whitespace-nowrap relative ${
              activeTab === "sun"
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {t("tabSun", language || "fr")}
            {activeTab === "sun" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-stone-900"
              />
            )}
          </button>

          {/* Info */}
          <button
            onClick={() => setActiveTab("info")}
            className={`pb-4 text-[15px] transition-colors cursor-pointer select-none whitespace-nowrap relative ${
              activeTab === "info"
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {t("tabInfos", language || "fr")}
            {activeTab === "info" && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-stone-900"
              />
            )}
          </button>
        </div>

        {/* Minimalist Filters */}
        {activeTab !== "info" && (
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/40 pb-4">
            <div
              className="flex flex-wrap items-center gap-4"
              id="category-filters-container"
            >
              {/* Tous */}
              <button
                onClick={() => setSelectedCategory("favorites")}
                className={`text-[13px] font-light transition-colors cursor-pointer select-none relative pb-1 flex items-center gap-1.5 ${
                  selectedCategory === "favorites"
                    ? "text-red-500 font-medium"
                    : "text-stone-400 hover:text-red-400"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${selectedCategory === "favorites" ? "fill-red-500" : ""}`} />
                {t("catFavorites", language || "fr")}
                {selectedCategory === "favorites" && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-red-500"
                  />
                )}
              </button>
              <span className="text-stone-250">|</span>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-[13px] font-light transition-colors cursor-pointer select-none relative pb-1 flex items-center gap-1.5 ${
                  selectedCategory === "all"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                {t("catAll", language || "fr")}
                {selectedCategory === "all" && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-stone-900"
                  />
                )}
              </button>

              {/* Prédication */}
              <button
                onClick={() => setSelectedCategory("ministry")}
                className={`text-[13px] font-light transition-colors cursor-pointer select-none relative pb-1 flex items-center gap-1.5 ${
                  selectedCategory === "ministry"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                {t("catMinistry", language || "fr")}
                {selectedCategory === "ministry" && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-stone-900"
                  />
                )}
              </button>

              {/* Repas */}
              <button
                onClick={() => setSelectedCategory("food")}
                className={`text-[13px] font-light transition-colors cursor-pointer select-none relative pb-1 flex items-center gap-1.5 ${
                  selectedCategory === "food"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                {t("catFood", language || "fr")}
                {selectedCategory === "food" && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-stone-900"
                  />
                )}
              </button>

              {/* Détente */}
              <button
                onClick={() => setSelectedCategory("relaxation")}
                className={`text-[13px] font-light transition-colors cursor-pointer select-none relative pb-1 flex items-center gap-1.5 ${
                  selectedCategory === "relaxation"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                 <Sparkles className="w-3.5 h-3.5" />
                 {t("catRelaxation", language || "fr")}
                {selectedCategory === "relaxation" && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-stone-900"
                  />
                )}
              </button>

              {/* Spirituel */}
              <button
                onClick={() => setSelectedCategory("spiritual")}
                className={`text-[13px] font-light transition-colors cursor-pointer select-none relative pb-1 flex items-center gap-1.5 ${
                  selectedCategory === "spiritual"
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                 <BookOpen className="w-3.5 h-3.5" />
                 {t("catSpiritual", language || "fr")}
                {selectedCategory === "spiritual" && (
                  <motion.div
                    layoutId="activeFilterIndicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-stone-900"
                  />
                )}
              </button>
            </div>

            {/* Keyword search bar */}
            <div className="relative w-full md:w-64 shrink-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-3.5 h-3.5 text-stone-400 font-light" />
              </span>
              <input
                type="text"
                placeholder={t("searchPlaceholder", language || "fr")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-white border border-stone-200/80 rounded-full text-xs font-light text-stone-700 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                  title="Effacer la recherche"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Renderers */}
        <main className="space-y-6">
          {/* 1. OVERVIEW TABS */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="py-4 border-b border-stone-200/60 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <p className="text-stone-500 font-light text-[13px] max-w-xl">
                  {t("overviewDesc", language || "fr")}
                </p>
                <div className="flex gap-4 text-xs font-light text-stone-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-800 animate-pulse"></span>
                    <span>{t("statusOngoing", language || "fr")} ({activeEventsCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                    <span>{t("statusPast", language || "fr")} ({pastEventsCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full border border-stone-500"></span>
                    <span>{t("statusFuture", language || "fr")} ({futureEventsCount})</span>
                  </div>
                </div>
              </div>

              {/* Three Column Grid (Large Screen) or Stacked (Small Screen) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* VENDREDI COLUMN */}
                <div className="space-y-8">
                  <div className="pb-3 border-b border-stone-200/60">
                    <h2 className="font-display font-light text-stone-900 text-lg">
                      {t("friday", language || "fr")}
                    </h2>
                    <p className="text-stone-400 text-[13px] font-light mt-0.5">
                      {fryDayString}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {getFilteredEvents("Vendredi").length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="py-8 text-stone-400 text-sm text-center font-light"
                        >
                          {t("noEvents", language || "fr")}
                        </motion.div>
                      ) : (
                        getFilteredEvents("Vendredi").map((event) => {
                          const state = getEventState(
                            event,
                            configs.startDate,
                            simMode,
                            simTime,
                          );
                          return (
                            <EventCard
                              key={event.id}
                              event={event}
                              startDate={configs.startDate}
                              state={state}
                              isFavorite={favorites.includes(event.id)}
                              onToggleFavorite={() => toggleFavorite(event.id)}
                              isHighlighted={highlightEventId === event.id}
                            />
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* SAMEDI COLUMN */}
                <div className="space-y-8">
                  <div className="pb-3 border-b border-stone-200/60">
                    <h2 className="font-display font-light text-stone-900 text-lg">
                      {t("saturday", language || "fr")}
                    </h2>
                    <p className="text-stone-400 text-[13px] font-light mt-0.5">
                      {satDayString}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {getFilteredEvents("Samedi").length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="py-8 text-stone-400 text-sm text-center font-light"
                        >
                          {t("noEvents", language || "fr")}
                        </motion.div>
                      ) : (
                        getFilteredEvents("Samedi").map((event) => {
                          const state = getEventState(
                            event,
                            configs.startDate,
                            simMode,
                            simTime,
                          );
                          return (
                            <EventCard
                              key={event.id}
                              event={event}
                              startDate={configs.startDate}
                              state={state}
                              isFavorite={favorites.includes(event.id)}
                              onToggleFavorite={() => toggleFavorite(event.id)}
                              isHighlighted={highlightEventId === event.id}
                            />
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* DIMANCHE COLUMN */}
                <div className="space-y-8">
                  <div className="pb-3 border-b border-stone-200/60">
                    <h2 className="font-display font-light text-stone-900 text-lg">
                      {t("sunday", language || "fr")}
                    </h2>
                    <p className="text-stone-400 text-[13px] font-light mt-0.5">
                      {sunDayString}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {getFilteredEvents("Dimanche").length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="py-8 text-stone-400 text-sm text-center font-light"
                        >
                          {t("noEvents", language || "fr")}
                        </motion.div>
                      ) : (
                        getFilteredEvents("Dimanche").map((event) => {
                          const state = getEventState(
                            event,
                            configs.startDate,
                            simMode,
                            simTime,
                          );
                          return (
                            <EventCard
                              key={event.id}
                              event={event}
                              startDate={configs.startDate}
                              state={state}
                              isFavorite={favorites.includes(event.id)}
                              onToggleFavorite={() => toggleFavorite(event.id)}
                              isHighlighted={highlightEventId === event.id}
                            />
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. VENDREDI TAB FOCUS */}
          {activeTab === "fri" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              <div className="pb-4 border-b border-stone-200/60">
                <h2 className="font-display font-light text-stone-900 text-3xl">
                  {t("friday", language || "fr")}
                </h2>
                <p className="text-stone-400 font-light mt-1">
                  {fryDayString}
                </p>
                <p className="text-stone-500 leading-relaxed mt-4 font-light text-[15px]">
                  {t("fridayDesc", language || "fr")}
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {getFilteredEvents("Vendredi").length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 bg-white/60 border border-stone-200 rounded-2xl text-stone-500 text-sm text-center"
                    >
                      {t("noEventsCategory", language || "fr")}
                    </motion.div>
                  ) : (
                    getFilteredEvents("Vendredi").map((event) => {
                      const state = getEventState(
                        event,
                        configs.startDate,
                        simMode,
                        simTime,
                      );
                      return (
                        <EventCard
                          key={event.id}
                          event={event}
                          startDate={configs.startDate}
                          state={state}
                          isFavorite={favorites.includes(event.id)}
                          onToggleFavorite={() => toggleFavorite(event.id)}
                          isHighlighted={highlightEventId === event.id}
                        />
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* 3. SAMEDI TAB FOCUS */}
          {activeTab === "sat" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              <div className="pb-4 border-b border-stone-200/60">
                <h2 className="font-display font-light text-stone-900 text-3xl">
                  {t("saturday", language || "fr")}
                </h2>
                <p className="text-stone-400 font-light mt-1">
                  {satDayString}
                </p>
                <p className="text-stone-500 leading-relaxed mt-4 font-light text-[15px]">
                  {t("saturdayDesc", language || "fr")}
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {getFilteredEvents("Samedi").length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 bg-white/60 border border-stone-200 rounded-2xl text-stone-500 text-sm text-center"
                    >
                      {t("noEventsCategory", language || "fr")}
                    </motion.div>
                  ) : (
                    getFilteredEvents("Samedi").map((event) => {
                      const state = getEventState(
                        event,
                        configs.startDate,
                        simMode,
                        simTime,
                      );
                      return (
                        <EventCard
                          key={event.id}
                          event={event}
                          startDate={configs.startDate}
                          state={state}
                          isFavorite={favorites.includes(event.id)}
                          onToggleFavorite={() => toggleFavorite(event.id)}
                          isHighlighted={highlightEventId === event.id}
                        />
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* 4. DIMANCHE TAB FOCUS */}
          {activeTab === "sun" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              <div className="pb-4 border-b border-stone-200/60">
                <h2 className="font-display font-light text-stone-900 text-3xl">
                  {t("sunday", language || "fr")}
                </h2>
                <p className="text-stone-400 font-light mt-1">
                  {sunDayString}
                </p>
                <p className="text-stone-500 leading-relaxed mt-4 font-light text-[15px]">
                  {t("sundayDesc", language || "fr")}
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {getFilteredEvents("Dimanche").length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 bg-white/60 border border-stone-200 rounded-2xl text-stone-500 text-sm text-center"
                    >
                      {t("noEventsCategory", language || "fr")}
                    </motion.div>
                  ) : (
                    getFilteredEvents("Dimanche").map((event) => {
                      const state = getEventState(
                        event,
                        configs.startDate,
                        simMode,
                        simTime,
                      );
                      return (
                        <EventCard
                          key={event.id}
                          event={event}
                          startDate={configs.startDate}
                          state={state}
                          isFavorite={favorites.includes(event.id)}
                          onToggleFavorite={() => toggleFavorite(event.id)}
                          isHighlighted={highlightEventId === event.id}
                        />
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* 6. INFOS PRATIQUES */}
          {activeTab === "info" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <InfosPratiquesTab configs={configs} language={language} />
            </motion.div>
          )}

        </main>
      </div>

      {/* Persistent Footer */}
      <footer className="mt-20 py-12 text-stone-400 text-xs text-center border-t border-stone-200/60">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="space-y-1.5 flex flex-col items-center">
            <p className="font-display font-light text-stone-600 text-sm flex items-center gap-1.5">
              <span>{t("footerTitle", language || "fr")}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </p>
            <p className="text-[11px] font-light tracking-wide text-stone-400">
              {t("footerSubtitle", language || "fr")}
            </p>
          </div>
        </div>
      </footer>

      {/* Configuration Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        configs={configs}
        onSave={handleSaveConfigs}
        events={events}
        onSaveEvents={handleSaveEvents}
        language={language}
        onLanguageChange={(lang: Language) => {
          setLanguage(lang);
          localStorage.setItem("PIONEER_LANG", lang);
        }}
      />

      {/* Floating Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3 bg-stone-900 text-white rounded-full shadow-xl hover:bg-stone-800 transition-colors"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
