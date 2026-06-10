export const fr = {

  profile: {
    editTitle: "Modifier le profil",
    signInPrompt: "Connectez-vous pour modifier votre profil.",
    email: "E-mail",
    emailPublic: "Public",
    emailHidden: "Masqué",
    username: "Nom d’utilisateur",
    fullName: "Nom complet",
    bio: "Bio",
    portfolio: "Portfolio",
    save: "Enregistrer le profil",
    saved: "Profil enregistré.",
    saveError: "Échec de l’enregistrement. Réessayez.",
    usernameTaken: "Ce nom d’utilisateur est déjà pris.",
    contributions: "Contributions ({{count}})",
    noContributions: "Aucune contribution pour le moment.",
  },

  categories: {
    title: "Catégories",
    subtitle: "Explorez tout le répertoire par catégorie — des ressources pour tout.",
    count: "{{count}} ressources",
    domain: { developer: "Développement", designer: "Design", general: "Général" },
  },
  language: { label: "Langue" },

  header: {
    searchPlaceholder: "Rechercher…",
    signIn: "Se connecter",
  },

  nav: {
    profile: "Profil",
    categories: "Catégories",
    notifications: "Notifications",
    favorites: "Favoris",
    submit: "Proposer une ressource",
    signOut: "Se déconnecter",
    account: "Compte",
  },

  home: {
    badge: "{{count}}+ ressources triées sur le volet",
    titleLead: "Trouvez votre prochaine",
    titleHighlight: "ressource.",
    subtitle:
      "Toutes les ressources dont vous aurez besoin — pour tout, au même endroit !",
  },

  browse: {
    heading: "Parcourir les ressources",
    summary: "{{resources}} ressources dans {{categories}} catégories.",
    searchPlaceholder: "Rechercher par nom, tag, description…",
    filters: "Filtres",
    sort: { featured: "En vedette", popular: "Les plus populaires", favorites: "Les plus favoris", name: "Nom A→Z", nameDesc: "Nom Z→A", recent: "Récemment ajoutés" },
    facet: { category: "Catégorie", pricing: "Tarif", language: "Langue", tags: "Tags" },
    results: "{{count}} résultats",
    clear: "Effacer",
    empty: "Aucune ressource ne correspond à vos filtres.",
    first: "Première page",
    prev: "Précédent",
    next: "Suivant",
    page: "Page {{page}} sur {{total}}",
  },

  pricing: { free: "Gratuit", freemium: "Option gratuite", paid: "Payant" },
  languages: { en: "Anglais", tr: "Turc" },

  card: {
    addedBy: "ajouté par @{{username}}",
    by: "par {{author}}",
    broken: "lien mort",
    addFavorite: "Ajouter aux favoris",
    removeFavorite: "Retirer des favoris",
    signInToSave: "Connectez-vous pour enregistrer",
    favoriteError: "Impossible de mettre à jour le favori. Veuillez réessayer.",
  },

  modal: {
    close: "Fermer",
    open: "Ouvrir la ressource",
    details: "Détails",
    viewDetails: "Voir les détails",
    noDescription: "Aucune description disponible.",
    fixPrompt: "Ce lien semble rompu.",
    fixCta: "Proposer une correction",
    fixLabel: "URL correcte",
    fixSubmit: "Envoyer la correction",
    fixSuccess: "Merci ! Votre correction est en cours d'examen.",
    fixError: "Échec de l'envoi. Veuillez réessayer.",
    categories: "Catégories",
    tags: "Tags",
    addedOn: "Ajouté le {{date}}",
  },

  taxonomy: {
    editCta: "Suggérer une modification",
    pendingSuggestion: "Suggestion en attente",
    yourSuggestion: "Vos catégories et tags suggérés",
    newLegend: "Nouvellement ajouté",
    removedLegend: "Supprimé",
    close: "Quitter",
    addCategory: "Ajouter une catégorie…",
    addTag: "Ajouter un tag…",
    submit: "Envoyer la suggestion",
    atLeastOne: "Ajoutez au moins une catégorie ou un tag.",
    pendingText: "Ajoutez ou effacez d'abord le texte du champ.",
    success: "Merci ! Votre suggestion est en cours d'examen.",
    error: "Échec de l'envoi. Veuillez réessayer.",
  },

  resource: { share: "Partager", related: "Ressources connexes" },

  command: {
    title: "Rechercher des ressources",
    description: "Recherchez dans toutes les ressources, catégories et tags.",
    placeholder: "Rechercher ressources, tags, catégories…",
    empty: "Aucune ressource correspondante.",
    featured: "En vedette",
    results: "Résultats",
    goTo: "Aller à",
    browseAll: "Parcourir toutes les ressources",
  },

  category: { home: "Accueil", resources: "{{count}} ressources" },
  tag: { home: "Accueil", resources: "{{count}} ressources" },

  favorites: {
    signInPrompt: "Connectez-vous pour voir vos favoris.",
    title: "Vos favoris",
    empty: "Vous n'avez encore enregistré aucune ressource.",
    browse: "Parcourir les ressources",
  },

  notifications: {
    title: "Notifications",
    empty: "Aucune notification pour le moment.",
    signInPrompt: "Connectez-vous pour voir vos notifications.",
    back: "Retour à l'accueil",
  },

  submit: {
    title: "Proposer une ressource",
    subtitle:
      "Vous connaissez une superbe ressource qui manque ? Proposez-la — nous examinons chaque proposition avant publication.",
    name: "Nom",
    url: "URL",
    category: "Catégorie",
    selectCategory: "Choisir une catégorie…",
    otherCategory: "Autre…",
    customCategoryPlaceholder: "Saisir une catégorie",
    pricing: "Tarif (facultatif)",
    tags: "Tags (facultatif)",
    tagsPlaceholder: "Séparés par des virgules, ex. react, css",
    viewMine: "Voir mes propositions",
    note: "Note",
    notePlaceholder: "Pourquoi cette ressource est-elle géniale ?",
    submit: "Envoyer la ressource",
    success: "Merci ! Votre proposition est en cours d'examen.",
    error: "Une erreur s'est produite. Veuillez réessayer.",
  },

  submissions: {
    title: "Mes propositions",
    empty: "Vous n'avez encore proposé aucune ressource.",
    status: { pending: "En attente", approved: "Approuvée", rejected: "Refusée" },
    reasonLabel: "Motif",
    noReason: "Cette proposition n'a pas été approuvée.",
    edit: "Modifier",
    cancel: "Annuler",
    urlFix: "Correction d'URL",
    taxonomyFix: "Correction catégorie/tag",
    editResubmit: "Modifier et renvoyer",
    resubmit: "Renvoyer",
    resubmitSuccess: "Renvoyée ! Elle est de nouveau en cours d'examen.",
    resubmitError: "Échec du renvoi. Veuillez réessayer.",
  },

  auth: {
    title: "Bienvenue 👋",
    requiredTitle: "Connexion requise",
    requiredBody: "Vous devez être connecté pour voir cette page.",
    subtitle: "Connectez-vous pour enregistrer des favoris et proposer des ressources.",
    google: "Continuer avec Google",
    github: "Continuer avec GitHub",
    or: "ou",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    createAccount: "Créer un compte",
    emailPlaceholder: "vous@exemple.com",
    usernamePlaceholder: "Nom d’utilisateur",
    usernameInvalid: "Le nom d’utilisateur doit faire 3 à 20 caractères : a-z, 0-9, - ou _",
    passwordPlaceholder: "Mot de passe",
    confirmEmail: "Vérifiez vos e-mails pour confirmer votre compte.",
    welcomeBack: "Bon retour !",
    failed: "Échec de l'authentification",
  },

  banner: {
    title: "Resource Base fait peau neuve 🚧",
    body:
      "Nous reconstruisons et améliorons activement le site — certaines choses peuvent changer ou ne pas fonctionner. Merci de votre patience 💜",
  },

  footer: {
    tagline:
      "Des ressources pour tout — au même endroit !",
    source: "Star sur GitHub",
    reportIssue: "Signaler un problème",
    sponsor: "Devenir sponsor",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
  },

  legal: { updated: "Dernière mise à jour {{date}}" },

  consent: {
    message:
      "Nous utilisons des cookies pour des analyses anonymes afin d'améliorer le site. Voir notre",
    accept: "Accepter",
    decline: "Refuser",
  },

  account: {
    title: "Vos données",
    export: "Exporter mes données",
    delete: "Supprimer le compte",
    deleted: "Votre compte a été supprimé.",
    deleteError: "Impossible de supprimer votre compte. Veuillez réessayer.",
    deleteTitle: "Supprimer votre compte ?",
    deleteWarning:
      "Cela supprime définitivement votre profil, vos favoris et vos propositions. Action irréversible. Les ressources publiées restent mais perdent votre attribution.",
    deleteConfirm: "Supprimer définitivement",
  },
} as const;
