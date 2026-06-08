export const de = {
  language: { label: "Sprache" },

  header: {
    searchPlaceholder: "Suchen…",
    signIn: "Anmelden",
  },

  nav: {
    notifications: "Benachrichtigungen",
    favorites: "Favoriten",
    submit: "Ressource vorschlagen",
    signOut: "Abmelden",
    account: "Konto",
  },

  home: {
    badge: "{{count}}+ handverlesene kostenlose Ressourcen",
    titleLead: "Finde deine nächste",
    titleHighlight: "Ressource.",
    subtitle:
      "Durchsuche und filtere die besten kostenlosen Tools, Bibliotheken, Kurse und Assets für Entwickler und Designer.",
  },

  browse: {
    heading: "Ressourcen durchsuchen",
    summary: "{{resources}} Ressourcen in {{categories}} Kategorien.",
    searchPlaceholder: "Nach Name, Tag, Beschreibung suchen…",
    filters: "Filter",
    sort: { featured: "Empfohlen", popular: "Beliebteste", name: "Name A→Z", recent: "Zuletzt hinzugefügt" },
    facet: { category: "Kategorie", pricing: "Preis", language: "Sprache", tags: "Tags" },
    results: "{{count}} Ergebnisse",
    clear: "Zurücksetzen",
    empty: "Keine Ressourcen entsprechen deinen Filtern.",
    prev: "Zurück",
    next: "Weiter",
    page: "Seite {{page}} von {{total}}",
  },

  pricing: { free: "Kostenlos", freemium: "Kostenlose Option", paid: "Kostenpflichtig" },
  languages: { en: "Englisch", tr: "Türkisch" },

  card: {
    by: "von {{author}}",
    broken: "defekt",
    addFavorite: "Zu Favoriten",
    removeFavorite: "Aus Favoriten entfernen",
    signInToSave: "Zum Speichern anmelden",
  },

  command: {
    title: "Ressourcen durchsuchen",
    description: "Durchsuche alle Ressourcen, Kategorien und Tags.",
    placeholder: "Ressourcen, Tags, Kategorien suchen…",
    empty: "Keine passenden Ressourcen.",
    featured: "Empfohlen",
    results: "Ergebnisse",
    goTo: "Gehe zu",
    browseAll: "Alle Ressourcen durchsuchen",
  },

  category: { home: "Startseite", resources: "{{count}} Ressourcen" },
  tag: { home: "Startseite", resources: "{{count}} Ressourcen" },

  favorites: {
    title: "Deine Favoriten",
    empty: "Du hast noch keine Ressourcen gespeichert.",
    browse: "Ressourcen durchsuchen",
  },

  notifications: {
    title: "Benachrichtigungen",
    empty: "Noch keine Benachrichtigungen.",
    signInPrompt: "Melde dich an, um deine Benachrichtigungen zu sehen.",
    back: "Zurück zur Startseite",
  },

  submit: {
    title: "Ressource vorschlagen",
    subtitle:
      "Kennst du eine großartige kostenlose Ressource, die fehlt? Schlage sie vor — wir prüfen jeden Vorschlag, bevor er live geht.",
    name: "Name",
    url: "URL",
    category: "Kategorie",
    selectCategory: "Kategorie auswählen…",
    note: "Notiz",
    notePlaceholder: "Warum ist diese Ressource großartig?",
    email: "Deine E-Mail (optional)",
    submit: "Ressource einreichen",
    success: "Danke! Dein Vorschlag ist in der Prüfung.",
    error: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },

  auth: {
    title: "Willkommen bei Resource Base",
    subtitle: "Melde dich an, um Favoriten zu speichern und Ressourcen einzureichen.",
    google: "Mit Google fortfahren",
    github: "Mit GitHub fortfahren",
    or: "oder",
    signIn: "Anmelden",
    signUp: "Registrieren",
    createAccount: "Konto erstellen",
    emailPlaceholder: "du@beispiel.com",
    passwordPlaceholder: "Passwort",
    confirmEmail: "Prüfe deine E-Mails, um dein Konto zu bestätigen.",
    welcomeBack: "Willkommen zurück!",
    failed: "Authentifizierung fehlgeschlagen",
  },

  banner: {
    title: "Resource Base wird erneuert 🚧",
    body:
      "Wir bauen die Seite aktiv um und verbessern sie — dabei kann sich etwas ändern oder nicht funktionieren. Danke für deine Geduld 💜",
  },

  footer: {
    tagline:
      "Ein kuratiertes, durchsuchbares Verzeichnis der besten kostenlosen Ressourcen für Entwickler und Designer.",
    source: "Quellcode",
    reportIssue: "Problem melden",
    sponsor: "Sponsor werden",
  },
} as const;
