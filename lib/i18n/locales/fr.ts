export const fr = {
  language: { label: "Langue" },

  header: {
    searchPlaceholder: "Rechercher…",
    signIn: "Se connecter",
  },

  nav: {
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
      "Recherchez et filtrez les meilleurs outils, bibliothèques, cours et ressources gratuits pour les développeurs et les designers.",
  },

  browse: {
    heading: "Parcourir les ressources",
    summary: "{{resources}} ressources dans {{categories}} catégories.",
    searchPlaceholder: "Rechercher par nom, tag, description…",
    filters: "Filtres",
    sort: { featured: "En vedette", name: "Nom A→Z", recent: "Récemment ajoutés" },
    facet: { category: "Catégorie", pricing: "Tarif", language: "Langue", tags: "Tags" },
    results: "{{count}} résultats",
    clear: "Effacer",
    empty: "Aucune ressource ne correspond à vos filtres.",
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
    title: "Bienvenue sur Resource Base",
    subtitle: "Connectez-vous pour enregistrer des favoris et proposer des ressources.",
    google: "Continuer avec Google",
    github: "Continuer avec GitHub",
    or: "ou",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    createAccount: "Créer un compte",
    emailPlaceholder: "vous@exemple.com",
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
      "Un répertoire organisé et consultable des meilleures ressources gratuites pour les développeurs et les designers.",
    source: "Code source",
    reportIssue: "Signaler un problème",
    sponsor: "Devenir sponsor",
  },
} as const;
