export const fr = {

  profile: {
    editTitle: "Modifier le profil",
    signInPrompt: "Connectez-vous pour modifier votre profil.",
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
    subtitle: "Des projets farfelus à la science sérieuse — explorez tout le répertoire par catégorie.",
    count: "{{count}} ressources",
    domain: { developer: "Développement", designer: "Design", general: "Général" },
  },
  language: { label: "Langue" },

  header: {
    searchPlaceholder: "Rechercher…",
    signIn: "Se connecter",
  },

  nav: {
    categories: "Catégories",
    notifications: "Notifications",
    favorites: "Favoris",
    submit: "Proposer une ressource",
    signOut: "Se déconnecter",
    account: "Compte",
  },

  home: {
    badge: "{{count}}+ ressources gratuites triées sur le volet",
    titleLead: "Trouvez votre prochaine",
    titleHighlight: "ressource.",
    subtitle:
      "Des milliers de ressources gratuites pour tout — des gadgets web farfelus à la science sérieuse. Cherchez tout au même endroit.",
  },

  browse: {
    heading: "Parcourir les ressources",
    summary: "{{resources}} ressources dans {{categories}} catégories.",
    searchPlaceholder: "Rechercher par nom, tag, description…",
    filters: "Filtres",
    sort: { featured: "En vedette", popular: "Les plus populaires", name: "Nom A→Z", recent: "Récemment ajoutés" },
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
    by: "par {{author}}",
    broken: "lien mort",
    addFavorite: "Ajouter aux favoris",
    removeFavorite: "Retirer des favoris",
    signInToSave: "Connectez-vous pour enregistrer",
  },

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
      "Vous connaissez une superbe ressource gratuite qui manque ? Proposez-la — nous examinons chaque proposition avant publication.",
    name: "Nom",
    url: "URL",
    category: "Catégorie",
    selectCategory: "Choisir une catégorie…",
    note: "Note",
    notePlaceholder: "Pourquoi cette ressource est-elle géniale ?",
    email: "Votre e-mail (facultatif)",
    submit: "Envoyer la ressource",
    success: "Merci ! Votre proposition est en cours d'examen.",
    error: "Une erreur s'est produite. Veuillez réessayer.",
  },

  auth: {
    title: "Bienvenue 👋",
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
      "Un répertoire organisé et consultable de ressources gratuites pour tout — des gadgets web farfelus à la science sérieuse.",
    source: "Code source",
    reportIssue: "Signaler un problème",
    sponsor: "Devenir sponsor",
  },
} as const;
