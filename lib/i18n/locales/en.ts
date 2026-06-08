export const en = {

  profile: {
    editTitle: "Edit profile",
    signInPrompt: "Sign in to edit your profile.",
    username: "Username",
    fullName: "Full name",
    bio: "Bio",
    portfolio: "Portfolio",
    save: "Save profile",
    saved: "Profile saved.",
    saveError: "Could not save. Please try again.",
    usernameTaken: "That username is taken.",
    contributions: "Contributions ({{count}})",
    noContributions: "No contributions yet.",
  },

  categories: {
    title: "Categories",
    subtitle: "From silly side-projects to serious science — explore the full directory by category.",
    count: "{{count}} resources",
    domain: { developer: "Development", designer: "Design", general: "General" },
  },
  language: { label: "Language" },

  header: {
    searchPlaceholder: "Search…",
    signIn: "Sign in",
  },

  nav: {
    categories: "Categories",
    notifications: "Notifications",
    favorites: "Favorites",
    submit: "Submit a resource",
    signOut: "Sign out",
    account: "Account",
  },

  home: {
    badge: "{{count}}+ hand-picked free resources",
    titleLead: "Find your next",
    titleHighlight: "resource.",
    subtitle:
      "Thousands of free resources for everything — from quirky web toys to serious science. Search it all in one place.",
  },

  browse: {
    heading: "Browse resources",
    summary: "{{resources}} resources across {{categories}} categories.",
    searchPlaceholder: "Search by name, tag, description…",
    filters: "Filters",
    sort: { featured: "Featured", popular: "Most popular", name: "Name A→Z", recent: "Recently added" },
    facet: { category: "Category", pricing: "Pricing", language: "Language", tags: "Tags" },
    results: "{{count}} results",
    clear: "Clear",
    empty: "No resources match your filters.",
    first: "First page",
    prev: "Previous",
    next: "Next",
    page: "Page {{page}} of {{total}}",
  },

  pricing: { free: "Free", freemium: "Free option", paid: "Paid" },
  languages: { en: "English", tr: "Turkish" },

  card: {
    by: "by {{author}}",
    broken: "broken",
    addFavorite: "Add favorite",
    removeFavorite: "Remove favorite",
    signInToSave: "Sign in to save",
  },

  command: {
    title: "Search resources",
    description: "Search across every resource, category and tag.",
    placeholder: "Search resources, tags, categories…",
    empty: "No matching resources.",
    featured: "Featured",
    results: "Results",
    goTo: "Go to",
    browseAll: "Browse all resources",
  },

  category: { home: "Home", resources: "{{count}} resources" },
  tag: { home: "Home", resources: "{{count}} resources" },

  favorites: {
    title: "Your favorites",
    empty: "You haven't saved any resources yet.",
    browse: "Browse resources",
  },

  notifications: {
    title: "Notifications",
    empty: "No notifications yet.",
    signInPrompt: "Sign in to see your notifications.",
    back: "Back to home",
  },

  submit: {
    title: "Submit a resource",
    subtitle:
      "Know a great free resource that's missing? Suggest it — we review every submission before it goes live.",
    name: "Name",
    url: "URL",
    category: "Category",
    selectCategory: "Select a category…",
    note: "Note",
    notePlaceholder: "Why is this resource great?",
    email: "Your email (optional)",
    submit: "Submit resource",
    success: "Thanks! Your suggestion is in the review queue.",
    error: "Something went wrong. Please try again.",
  },

  auth: {
    title: "Welcome 👋",
    subtitle: "Sign in to save favorites and submit resources.",
    google: "Continue with Google",
    github: "Continue with GitHub",
    or: "or",
    signIn: "Sign in",
    signUp: "Sign up",
    createAccount: "Create account",
    emailPlaceholder: "you@example.com",
    usernamePlaceholder: "Username",
    usernameInvalid: "Username must be 3-20 characters: a-z, 0-9, - or _",
    passwordPlaceholder: "Password",
    confirmEmail: "Check your email to confirm your account.",
    welcomeBack: "Welcome back!",
    failed: "Authentication failed",
  },

  banner: {
    title: "Resource Base is being renewed 🚧",
    body:
      "We're actively rebuilding and improving the site — things may change or break while we work. Thanks for your patience 💜",
  },

  footer: {
    tagline:
      "A curated, searchable directory of free resources for everything — from quirky web toys to serious science.",
    source: "Source",
    reportIssue: "Report an issue",
    sponsor: "Sponsor",
  },
} as const;
