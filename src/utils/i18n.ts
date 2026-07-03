export type Language = "fr" | "de";

type TranslationDictionary = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const translations: TranslationDictionary = {
  fr: {
    // Splash screen
    greetingDay: "Bonjour",
    greetingNight: "Bonsoir",
    welcomeText: "et bienvenue pour ce magnifique week-end parmi nous.",
    enterBtn: "Entrer",
    selectLanguage: "Choisissez votre langue",

    // Tabs & Headers
    tabOverview: "Aperçu",
    tabFri: "Vendredi",
    tabSat: "Samedi",
    tabSun: "Dimanche",
    tabInfos: "Infos & Logistique",
    goodAddresses: "Bonnes Adresses",
    
    // Categories
    catAll: "Tous",
    catMinistry: "Prédication",
    catRelaxation: "Détente",
    catFood: "Repas fraternel",
    catSpiritual: "Rassemblement",
    catActivity: "Activité",
    catFavorites: "Favoris",
    catProgram: "Programme",
    catCafe: "Cafés",
    catVisit: "Balades",

    // Event states
    stateActive: "EN COURS",
    statePast: "Terminé",
    stateFuturePrefix: "Dans",
    stateUpcoming: "À venir",
    stateStartsAt: "À partir de",
    statusPast: "Terminé",
    statusOngoing: "En Cours",
    statusFuture: "À Venir",
    fromTime: "À partir de",
    
    // UI Elements
    searchPlaceholder: "Rechercher une activité...",
    installApp: "Installer l'App",
    offlineMode: "Mode hors-ligne",
    shareApp: "Partager l'App",
    linkCopied: "Lien copié !",
    addToCalendar: "Ajouter à un calendrier",
    add: "Ajouter",
    getDirections: "S'y rendre",
    navigate: "S'y rendre",
    copyAddress: "Copier l'adresse",
    noEvents: "Aucun événement prévu.",
    matchingPlaces: "Lieux correspondants",
    resetSelection: "Réinitialiser",
    
    // Overview tab
    liveNow: "En direct",
    upcoming: "À suivre",
    weekendCountdown: "Le week-end commence dans :",
    weekendOver: "Le week-end est terminé. Merci de votre présence !",
    days: "J",
    hours: "H",
    mins: "M",
    secs: "S",

    // Infos Pratiques
    practicalInfoTitle: "Informations Pratiques",
    mainLocation: "Lieu Principal",
    transportTitle: "Transport & Déplacements",
    checklistTitle: "Ce qu'il faut apporter",
    contactsTitle: "Contacts & Aide",
    myPrep: "Ma Préparation",
    resetChecklist: "Réinitialiser la liste",
    practicalContacts: "Contacts Pratiques",
    whereToGo: "Où aller ?",
    whereToGoDesc: "Explorez tous les lieux de rassemblements et adresses utiles.",
    
    // Settings
    settingsTitle: "Personnaliser l'événement",
    displayPrefs: "Préférences d'affichage",
    darkMode: "Mode Sombre",
    language: "Langue / Sprache",
    close: "Fermer",
    tabConfig: "Logistique Générale",
    tabEvents: "Activités du Programme",
    configDesc: "Ajustez les informations clés de l'assemblée, les adresses, les organisateurs locaux et la date de démarrage globale. Tout est sauvegardé localement sur cet appareil.",
  },
  de: {
    // Splash screen
    greetingDay: "Guten Tag",
    greetingNight: "Guten Abend",
    welcomeText: "und willkommen zu diesem wunderbaren Wochenende mit uns.",
    enterBtn: "Eintreten",
    selectLanguage: "Wählen Sie Ihre Sprache",

    // Tabs & Headers
    tabOverview: "Übersicht",
    tabFri: "Freitag",
    tabSat: "Samstag",
    tabSun: "Sonntag",
    tabInfos: "Infos & Logistik",
    goodAddresses: "Gute Adressen",
    
    // Categories
    catAll: "Alle",
    catMinistry: "Predigtdienst",
    catRelaxation: "Entspannung",
    catFood: "Gemeinsames Essen",
    catSpiritual: "Zusammenkunft",
    catActivity: "Aktivität",
    catFavorites: "Favoriten",
    catProgram: "Programm",
    catCafe: "Cafés",
    catVisit: "Spaziergänge",

    // Event states
    stateActive: "LÄUFT",
    statePast: "Beendet",
    stateFuturePrefix: "In",
    stateUpcoming: "Bevorstehend",
    stateStartsAt: "Ab",
    statusPast: "Beendet",
    statusOngoing: "Läuft gerade",
    statusFuture: "Anstehend",
    fromTime: "Ab",
    
    // UI Elements
    searchPlaceholder: "Aktivität suchen...",
    installApp: "App installieren",
    offlineMode: "Offline-Modus",
    shareApp: "App teilen",
    linkCopied: "Link kopiert!",
    addToCalendar: "Zum Kalender hinzufügen",
    add: "Hinzufügen",
    getDirections: "Wegbeschreibung",
    navigate: "Dorthin navigieren",
    copyAddress: "Adresse kopieren",
    noEvents: "Keine Aktivitäten geplant.",
    matchingPlaces: "Passende Orte",
    resetSelection: "Zurücksetzen",
    
    // Overview tab
    liveNow: "Jetzt live",
    upcoming: "Als Nächstes",
    weekendCountdown: "Das Wochenende beginnt in:",
    weekendOver: "Das Wochenende ist vorbei. Danke für eure Teilnahme!",
    days: "T",
    hours: "Std",
    mins: "Min",
    secs: "Sek",

    // Infos Pratiques
    practicalInfoTitle: "Praktische Infos",
    mainLocation: "Hauptort",
    transportTitle: "Transport & Anreise",
    checklistTitle: "Checkliste",
    contactsTitle: "Kontakte & Hilfe",
    myPrep: "Meine Vorbereitung",
    resetChecklist: "Liste zurücksetzen",
    practicalContacts: "Praktische Kontakte",
    whereToGo: "Wohin gehen?",
    whereToGoDesc: "Entdecken Sie alle Versammlungsorte und nützlichen Adressen.",
    
    // Settings
    settingsTitle: "Veranstaltung anpassen",
    displayPrefs: "Anzeigeeinstellungen",
    darkMode: "Dunkelmodus",
    language: "Langue / Sprache",
    close: "Schließen",
    tabConfig: "Allgemeine Logistik",
    tabEvents: "Programmaktivitäten",
    configDesc: "Passen Sie die wichtigsten Informationen zur Versammlung, Adressen, lokale Organisatoren und das globale Startdatum an. Alles wird lokal auf diesem Gerät gespeichert.",
  }
};

export const t = (key: string, lang: Language): string => {
  return translations[lang]?.[key] || key;
};
