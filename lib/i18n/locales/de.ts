export const de = {

  profile: {
    editTitle: "Profil bearbeiten",
    signInPrompt: "Melde dich an, um dein Profil zu bearbeiten.",
    username: "Benutzername",
    fullName: "Vollständiger Name",
    bio: "Bio",
    portfolio: "Portfolio",
    save: "Profil speichern",
    saved: "Profil gespeichert.",
    saveError: "Speichern fehlgeschlagen. Bitte erneut versuchen.",
    usernameTaken: "Dieser Benutzername ist vergeben.",
    contributions: "Beiträge ({{count}})",
    noContributions: "Noch keine Beiträge.",
  },

  categories: {
    title: "Kategorien",
    subtitle: "Durchstöbere das gesamte Verzeichnis nach Kategorie — Ressourcen für alles.",
    count: "{{count}} Ressourcen",
    domain: { developer: "Entwicklung", designer: "Design", general: "Allgemein" },
  },
  language: { label: "Sprache" },

  header: {
    searchPlaceholder: "Suchen…",
    signIn: "Anmelden",
  },

  nav: {
    profile: "Profil",
    categories: "Kategorien",
    notifications: "Benachrichtigungen",
    favorites: "Favoriten",
    submit: "Ressource vorschlagen",
    signOut: "Abmelden",
    account: "Konto",
  },

  home: {
    badge: "{{count}}+ handverlesene Ressourcen",
    titleLead: "Finde deine nächste",
    titleHighlight: "Ressource.",
    subtitle:
      "Jede Ressource, die du je brauchst — für alles, an einem Ort!",
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
    first: "Erste Seite",
    prev: "Zurück",
    next: "Weiter",
    page: "Seite {{page}} von {{total}}",
  },

  pricing: { free: "Kostenlos", freemium: "Kostenlose Option", paid: "Kostenpflichtig" },
  languages: { en: "Englisch", tr: "Türkisch" },

  card: {
    addedBy: "hinzugefügt von @{{username}}",
    by: "von {{author}}",
    broken: "defekt",
    addFavorite: "Zu Favoriten",
    removeFavorite: "Aus Favoriten entfernen",
    signInToSave: "Zum Speichern anmelden",
  },

  modal: {
    close: "Schließen",
    open: "Ressource öffnen",
    viewDetails: "Details anzeigen",
    noDescription: "Keine Beschreibung verfügbar.",
    categories: "Kategorien",
    tags: "Tags",
    addedOn: "Hinzugefügt am {{date}}",
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
    signInPrompt: "Melde dich an, um deine Favoriten zu sehen.",
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
      "Kennst du eine großartige Ressource, die fehlt? Schlage sie vor — wir prüfen jeden Vorschlag, bevor er live geht.",
    name: "Name",
    url: "URL",
    category: "Kategorie",
    selectCategory: "Kategorie auswählen…",
    otherCategory: "Andere…",
    customCategoryPlaceholder: "Kategorie eingeben",
    note: "Notiz",
    notePlaceholder: "Warum ist diese Ressource großartig?",
    email: "Deine E-Mail (optional)",
    submit: "Ressource einreichen",
    success: "Danke! Dein Vorschlag ist in der Prüfung.",
    error: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },

  auth: {
    title: "Willkommen 👋",
    requiredTitle: "Anmeldung erforderlich",
    requiredBody: "Du musst angemeldet sein, um diese Seite zu sehen.",
    subtitle: "Melde dich an, um Favoriten zu speichern und Ressourcen einzureichen.",
    google: "Mit Google fortfahren",
    github: "Mit GitHub fortfahren",
    or: "oder",
    signIn: "Anmelden",
    signUp: "Registrieren",
    createAccount: "Konto erstellen",
    emailPlaceholder: "du@beispiel.com",
    usernamePlaceholder: "Benutzername",
    usernameInvalid: "Benutzername muss 3-20 Zeichen sein: a-z, 0-9, - oder _",
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
      "Ressourcen für alles — alles an einem Ort!",
    source: "Auf GitHub bewerten",
    reportIssue: "Problem melden",
    sponsor: "Sponsor werden",
  },
} as const;
