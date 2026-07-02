/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { Award, Maximize2, Minimize2, X, MapPin, Navigation } from "lucide-react";

export interface MapLocation {
  id: string;
  name: string;
  category: "rendezvous" | "cafe" | "food" | "visit";
  lat: number;
  lng: number;
  desc: string;
  location: string;
  directionUrl: string;
}

export const MAP_LOCATIONS: MapLocation[] = [
  // --- Rendez-vous du programme ---
  {
    id: "rv-salle",
    name: "Salle du Royaume  ·  Point de Prédication",
    category: "rendezvous",
    lat: 52.4691,
    lng: 13.4566,
    desc: "Lieu de rassemblement principal pour les départs en prédication, le verset du jour et le déjeuner partagé le samedi.",
    location: "Naumburger Str. 37, 12057 Berlin",
    directionUrl: "https://maps.google.com/?q=Naumburger+Str.+37,+12057+Berlin",
  },
  {
    id: "rv-prater",
    name: "Prater Biergarten  ·  Détente Vendredi",
    category: "rendezvous",
    lat: 52.539824,
    lng: 13.411634,
    desc: "Rassemblement détente du vendredi soir pour faire connaissance et partager des récits de prédication.",
    location: "Kastanienallee 7-9, 10435 Berlin",
    directionUrl: "https://maps.google.com/?q=Kastanienallee+7-9,+10435+Berlin",
  },
  {
    id: "rv-tempelhof",
    name: "Parc Tempelhofer Feld  ·  Détente Samedi",
    category: "rendezvous",
    lat: 52.4730,
    lng: 13.4000,
    desc: "Détente collective sur les pistes de l'ancien aéroport de Tempelhof sous le soleil d'après-midi.",
    location: "Tempelhofer Damm, 12101 Berlin",
    directionUrl: "https://maps.google.com/?q=Tempelhofer+Feld+Berlin",
  },
  {
    id: "rv-winslow",
    name: "Maison Winslow  ·  Déjeuner Dimanche",
    category: "rendezvous",
    lat: 52.4883,
    lng: 13.3768,
    desc: "Déjeuner fraternel final convivial, chant de cantiques et photos de souvenirs.",
    location: "Monumentenstraße 25, 10965 Berlin",
    directionUrl: "https://maps.google.com/?q=Monumentenstraße+25,+10965+Berlin",
  },
  {
    id: "rv-brandebourg",
    name: "Porte de Brandebourg  ·  Balade Dimanche",
    category: "rendezvous",
    lat: 52.5163,
    lng: 13.3777,
    desc: "Promenade de clôture, photos souvenirs et adieux fraternels devant le fleuve Spree.",
    location: "Pariser Platz, 10117 Berlin",
    directionUrl: "https://maps.google.com/?q=Pariser+Platz,+10117+Berlin",
  },
  // --- Cafés ---
  {
    id: "cafe-1",
    name: "Zeit für Brot",
    category: "cafe",
    lat: 52.525542,
    lng: 13.407914,
    desc: "Excellentes brioches à la cannelle (Zimtschnecken) et pains artisanaux. Parfait pour une pause café.",
    location: "Alte Schönhauser Str. 4",
    directionUrl: "https://maps.google.com/?q=Zeit+für+Brot+Berlin",
  },
  {
    id: "cafe-2",
    name: "Espresso House",
    category: "cafe",
    lat: 52.5218,
    lng: 13.4124,
    desc: "Café chaleureux suédois avec de superbes pâtisseries et du bon café.",
    location: "Alexanderpl. 2",
    directionUrl: "https://maps.google.com/?q=Espresso+House+Alexanderplatz",
  },
  {
    id: "cafe-3",
    name: "Café am Neuen See",
    category: "cafe",
    lat: 52.5132,
    lng: 13.3444,
    desc: "Café et Biergarten idyllique sous les arbres. Parfait en famille avec possibilité de louer des barques.",
    location: "Lichtensteinallee 2",
    directionUrl: "https://maps.google.com/?q=Cafe+am+Neuen+See+Berlin",
  },
  {
    id: "cafe-4",
    name: "Five Elephant",
    category: "cafe",
    lat: 52.4925,
    lng: 13.4357,
    desc: "Café de spécialité offrant ce que beaucoup considèrent comme le meilleur cheesecake de la ville.",
    location: "Reichenberger Str. 101",
    directionUrl: "https://maps.google.com/?q=Five+Elephant+Berlin",
  },
  // --- Repas & Midi ---
  {
    id: "food-1",
    name: "Mustafas Gemüse Kebap",
    category: "food",
    lat: 52.4939,
    lng: 13.3879,
    desc: "Le kebab le plus célèbre de Berlin. Délicieux kebabs végétariens et au poulet.",
    location: "Mehringdamm 32",
    directionUrl: "https://maps.google.com/?q=Mustafas+Gemüse+Kebap",
  },
  {
    id: "food-2",
    name: "Vöner Kebab",
    category: "food",
    lat: 52.5085,
    lng: 13.4619,
    desc: "Kebab 100% végétalien, réputé pour sa saveur incroyable (pour végétaliens et viandards).",
    location: "Boxhagener Str. 56",
    directionUrl: "https://maps.google.com/?q=Vöner+Kebab+Berlin",
  },
  {
    id: "food-3",
    name: "Burgermeister",
    category: "food",
    lat: 52.5015,
    lng: 13.4421,
    desc: "Burgers emblématiques et abordables situés sous les rails du métro. Ambiance berlinoise authentique.",
    location: "U1 Schlesisches Tor",
    directionUrl: "https://maps.google.com/?q=Burgermeister+Schlesisches+Tor",
  },
  {
    id: "food-4",
    name: "Markthalle Neun",
    category: "food",
    lat: 52.5019,
    lng: 13.4316,
    desc: "Halle historique avec d'incroyables stands de street food. Super pour les groupes et familles.",
    location: "Eisenbahnstraße 42",
    directionUrl: "https://maps.google.com/?q=Markthalle+Neun+Berlin",
  },
  {
    id: "food-5",
    name: "Vapiano",
    category: "food",
    lat: 52.5205,
    lng: 13.4111,
    desc: "Grand espace lumineux avec pizzas et pâtes. Très abordable, rapide et adapté pour les grandes tablées.",
    location: "Alexanderplatz / Rathausstraße 2",
    directionUrl: "https://maps.google.com/?q=Vapiano+Berlin+Alexanderplatz",
  },
  // --- Balades / Visites ---
  {
    id: "visit-1",
    name: "Tempelhofer Feld",
    category: "visit",
    lat: 52.4730,
    lng: 13.4000,
    desc: "Ancien aéroport devenu un immense parc. Idéal pour se promener à vélo, roller, ou courir.",
    location: "Tempelhofer Damm",
    directionUrl: "https://maps.google.com/?q=Tempelhofer+Feld",
  },
  {
    id: "visit-2",
    name: "East Side Gallery",
    category: "visit",
    lat: 52.5014,
    lng: 13.4456,
    desc: "La plus longue galerie d'art à ciel ouvert sur les restes du mur de Berlin.",
    location: "Mühlenstraße 3",
    directionUrl: "https://maps.google.com/?q=East+Side+Gallery",
  },
  {
    id: "visit-3",
    name: "Muséum d'histoire naturelle",
    category: "visit",
    lat: 52.5298,
    lng: 13.3798,
    desc: "Fascinant pour petits et grands, avec une immense collection de dinosaures.",
    location: "Invalidenstraße 43",
    directionUrl: "https://maps.google.com/?q=Museum+für+Naturkunde+Berlin",
  },
  {
    id: "visit-4",
    name: "Mauerpark",
    category: "visit",
    lat: 52.5447,
    lng: 13.4024,
    desc: "Parc très prisé des familles, célèbre pour son grand marché aux puces dominical.",
    location: "Gleimstraße 55",
    directionUrl: "https://maps.google.com/?q=Mauerpark+Berlin",
  },
  {
    id: "visit-5",
    name: "Zoo de Berlin et Aquarium",
    category: "visit",
    lat: 52.5079,
    lng: 13.3378,
    desc: "Le plus ancien zoo d'Allemagne. Une promenade magnifique et relaxante avec les enfants.",
    location: "Hardenbergplatz 8",
    directionUrl: "https://maps.google.com/?q=Zoologischer+Garten+Berlin",
  },
];

interface InteractiveMapProps {
  selectedLocationId: string | null;
  onSelectLocation: (id: string | null) => void;
  filterCategory: "all" | "rendezvous" | "cafe" | "food" | "visit";
}

export default function InteractiveMap({
  selectedLocationId,
  onSelectLocation,
  filterCategory,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [loadingError, setLoadingError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Dynamically Load Leaflet JS & CSS assets if not present
  useEffect(() => {
    const existingScript = document.getElementById("leaflet-js-cdn");
    const existingStyle = document.getElementById("leaflet-css-cdn");

    const onScriptLoad = () => {
      setLeafletReady(true);
    };

    if (existingScript && (window as any).L) {
      setLeafletReady(true);
      return;
    }

    if (!existingStyle) {
      const link = document.createElement("link");
      link.id = "leaflet-css-cdn";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "leaflet-js-cdn";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = onScriptLoad;
      script.onerror = () => setLoadingError(true);
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", onScriptLoad);
    }
  }, []);

  // 2. Initialize Map Instance ONCE when container & leaflet are ready (stable DOM node)
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Remove old instance to prevent initialization collision
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center on Berlin Mitte (approx. Alexanderplatz / Karl-Marx-Allee)
    const map = L.map(mapContainerRef.current, {
      center: [52.513, 13.415],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Use high-contrast, beautiful, clean Voyager tiles matching our neutral aesthetic
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Initial invalidateSize timeout to render beautifully instantly
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletReady]);

  // 3. Update Map Markers incrementally instead of rebuilding the entire map
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // Clear old active markers Layer by Layer to avoid leftovers
    Object.values(markersRef.current).forEach((marker: any) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};

    const getCategoryColors = (category: string) => {
      switch (category) {
        case "rendezvous":
          return { bg: "bg-teal-500", icon: "💎" };
        case "cafe":
          return { bg: "bg-amber-500", icon: "☕" };
        case "food":
          return { bg: "bg-emerald-500", icon: "🍕" };
        case "visit":
          return { bg: "bg-blue-500", icon: "🏛️" };
        default:
          return { bg: "bg-stone-500", icon: "📍" };
      }
    };

    const filtered = MAP_LOCATIONS.filter(
      (loc) => filterCategory === "all" || loc.category === filterCategory
    );

    filtered.forEach((loc) => {
      const colors = getCategoryColors(loc.category);

      // Render custom pins without inline margins that interfere with Leaflet anchors
      const customMarkerHtml = `<div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${colors.bg} text-white border-2 border-white transform transition-transform duration-200 hover:scale-110">
        <span class="text-sm select-none">${colors.icon}</span>
        <div class="absolute -bottom-1 w-2 h-2 ${colors.bg} border-r border-b border-white" style="left: 50%; transform: translateX(-50%) rotate(45deg);"></div>
      </div>`;

      const markerIcon = L.divIcon({
        html: customMarkerHtml,
        className: "custom-div-icon bg-transparent border-none outline-none",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const popupContent = document.createElement("div");
      popupContent.className = "p-2 font-sans space-y-1.5 min-w-[200px]";
      popupContent.innerHTML = `
        <div class="space-y-0.5">
          <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border leading-none inline-block ${
            loc.category === "rendezvous"
              ? "bg-teal-555/10 text-teal-850 border-teal-200"
              : loc.category === "cafe"
              ? "bg-amber-555/10 text-amber-850 border-amber-200"
              : loc.category === "food"
              ? "bg-emerald-555/10 text-emerald-850 border-emerald-200"
              : "bg-blue-555/10 text-blue-800 border-blue-200"
          }">
            ${
              loc.category === "rendezvous"
                ? "Rendez-vous"
                : loc.category === "cafe"
                ? "Café / Boulangerie"
                : loc.category === "food"
                ? "Restauration"
                : "Visite / Balade"
            }
          </span>
          <h4 class="font-bold text-stone-850 text-xs mt-1 leading-snug">${loc.name}</h4>
        </div>
        <p class="text-[11px] text-stone-600 leading-normal font-medium">${loc.desc}</p>
        <div class="text-[10px] text-stone-400 font-mono truncate">${loc.location}</div>
        <a href="${loc.directionUrl}" target="_blank" rel="noopener noreferrer" class="block w-full text-center py-1.5 bg-stone-900 hover:bg-black text-[10px] text-white font-semibold rounded-lg transition-colors no-underline select-none mt-1">
          Ouvrir l'itinéraire GPS →
        </a>
      `;

      const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(popupContent);

      marker.on("click", (e: any) => {
        if (e && e.originalEvent) {
          e.originalEvent.stopPropagation();
        }
        onSelectLocation(loc.id);
      });

      markersRef.current[loc.id] = marker;
    });

    // Auto fit map bounds beautifully with an upper bound limit so it doesn't over-zoom on singles
    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [leafletReady, filterCategory]);

  // 4. Handle smooth panning to selected card item
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current || !selectedLocationId) return;

    const loc = MAP_LOCATIONS.find((l) => l.id === selectedLocationId);
    if (!loc) return;

    mapInstanceRef.current.setView([loc.lat, loc.lng], 15, {
      animate: true,
      duration: 0.85,
    });

    const marker = markersRef.current[selectedLocationId];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedLocationId, leafletReady]);

  // 5. Setup Resize Observer to prevent Leaflet container size issues (grey tiles bug)
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current || !mapContainerRef.current) return;

    const map = mapInstanceRef.current;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (map) {
          map.invalidateSize({ animate: false });
        }
      });
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [leafletReady]);

  // 6. Force recalculate size of map container when toggling fullscreen mode
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    map.invalidateSize({ animate: false });
    
    const timer = setTimeout(() => {
      map.invalidateSize({ animate: true });
      
      // Keep tracking selected marker or bounds
      if (selectedLocationId) {
        const loc = MAP_LOCATIONS.find((l) => l.id === selectedLocationId);
        if (loc) {
          map.setView([loc.lat, loc.lng], 15, { animate: true });
        }
      } else {
        const filtered = MAP_LOCATIONS.filter(
          (loc) => filterCategory === "all" || loc.category === filterCategory
        );
        if (filtered.length > 0) {
          const L = (window as any).L;
          const bounds = L.latLngBounds(filtered.map((l) => [l.lat, l.lng]));
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        }
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [isFullscreen, leafletReady, filterCategory, selectedLocationId]);

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullscreen((prev) => !prev);
  };

  const handleCloseFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullscreen(false);
  };

  return (
    <div className="space-y-3">
      {/* Dynamic CSS override block to erase Leaflet wrapper borders and handle screen body hidden */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
          outline: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 2px !important;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1) !important;
        }
        ${isFullscreen ? `
          body {
            overflow: hidden !important;
            overscroll-behavior: none !important;
          }
        ` : ""}
      `}} />

      {/* Main Map Container Wrapper - Always keep same DOM hierarchy to prevent Leaflet destruction */}
      <div 
        className={isFullscreen ? "fixed inset-0 z-[99999] bg-stone-900/60 backdrop-blur-md flex flex-col p-0 md:p-4 lg:p-6" : "relative"}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className={isFullscreen 
            ? "w-full h-full md:h-[90vh] md:max-h-[850px] md:max-w-6xl md:mx-auto md:rounded-[32px] bg-white flex flex-col overflow-hidden shadow-2xl relative border-none md:border md:border-stone-200"
            : "relative w-full"
          }
        >
          {/* Header ONLY in Fullscreen window mode (Styled using 'hidden' to avoid shifting DOM nodes) */}
          <div className={isFullscreen ? "bg-white border-b border-stone-150 pb-3 pt-4 px-6 flex items-center justify-between shrink-0" : "hidden"}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <span className="text-lg">🗺️</span>
              </div>
              <div className="text-left">
                <h3 className="font-display font-medium text-stone-900 text-sm md:text-base tracking-tight leading-none">
                  Carte Interactive
                </h3>
              </div>
            </div>

            <button 
              onClick={handleCloseFullscreen}
              className="p-1 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-light rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent gap-1.5"
              title="Quitter la vue grand écran"
            >
              <X className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="text-xs font-sans font-light hidden sm:inline">Fermer</span>
            </button>
          </div>

          {/* Map interactive frame */}
          <div className={isFullscreen ? "relative flex-1 w-full h-full flex flex-col min-h-0" : "relative w-full"}>
            <div 
              key="stable-leaflet-node"
              ref={mapContainerRef} 
              className={`w-full overflow-hidden border-stone-250 bg-stone-50 relative ${
                isFullscreen 
                  ? "flex-1 h-full" 
                  : "h-[480px] md:h-[620px] rounded-[28px] border shadow-sm"
              }`}
              id="leaflet-interactive-map"
              style={{ height: isFullscreen ? "100%" : undefined }}
            />

            {/* Floating maximize/minimize control on map */}
            <button
              onClick={handleToggleFullscreen}
              className="absolute top-4 right-4 z-[1000] py-2 px-3 bg-white hover:bg-stone-50 text-stone-900 font-light rounded-full transition-all border border-stone-200/60 cursor-pointer flex items-center gap-1.5 text-xs select-none"
              title={isFullscreen ? "Réduire la carte" : "Agrandir"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  <span>Réduire</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  <span>Agrandir</span>
                </>
              )}
            </button>
            
            {!leafletReady && (
              <div className="absolute inset-0 bg-stone-50 flex flex-col items-center justify-center p-4 z-[1001]">
                {loadingError ? (
                  <p className="text-red-500 font-medium text-xs text-center">
                    Erreur de chargement de la carte interactive. Veuillez réessayer.
                  </p>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mb-3" />
                    <p className="text-stone-505 font-medium text-xs">
                      Chargement de la carte et des adresses...
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Real-time Legend inside grand overlay layout */}
          <div className={isFullscreen ? "bg-stone-50 border-t border-stone-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-stone-400 gap-2 shrink-0" : "hidden"}>
            <span className="flex items-center gap-2 flex-wrap justify-center font-light">
              <span>Légende:</span>
              <span className="text-teal-600">💎 RDV</span>
              <span className="text-amber-600">☕ Cafés</span>
              <span className="text-emerald-600">🍕 Restos</span>
              <span className="text-blue-600 font-sans">🏛️ Visites</span>
            </span>
          </div>
        </div>
      </div>

      {!isFullscreen && (
        <div className="flex justify-between items-center text-[10px] text-stone-400 px-2 font-mono pb-1 font-light">
          <span className="flex items-center gap-2 select-none">
            <span>Légende:</span>
            <span className="text-teal-600">💎 RDV</span>
            <span className="text-amber-600">☕ Cafés</span>
            <span className="text-emerald-600">🍕 Restos</span>
            <span className="text-blue-600 font-sans">🏛️ Visites</span>
          </span>
        </div>
      )}
    </div>
  );
}
