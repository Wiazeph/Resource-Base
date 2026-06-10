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
    subtitle: "Explore the full directory by category — resources for anything and everything.",
    count: "{{count}} resources",
    domain: { developer: "Development", designer: "Design", general: "General" },
  },
  language: { label: "Language" },

  header: {
    searchPlaceholder: "Search…",
    signIn: "Sign in",
  },

  nav: {
    profile: "Profile",
    categories: "Categories",
    notifications: "Notifications",
    favorites: "Favorites",
    submit: "Submit a resource",
    signOut: "Sign out",
    account: "Account",
  },

  home: {
    badge: "{{count}}+ hand-picked resources",
    titleLead: "Find your next",
    titleHighlight: "resource.",
    subtitle:
      "Every resource you could ever need — for anything and everything, all in one place!",
  },

  browse: {
    heading: "Browse resources",
    summary: "{{resources}} resources across {{categories}} categories.",
    searchPlaceholder: "Search by name, tag, description…",
    filters: "Filters",
    sort: { featured: "Featured", popular: "Most popular", favorites: "Most favorited", name: "Name A→Z", nameDesc: "Name Z→A", recent: "Recently added" },
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
    addedBy: "added by @{{username}}",
    by: "by {{author}}",
    broken: "broken",
    addFavorite: "Add favorite",
    removeFavorite: "Remove favorite",
    signInToSave: "Sign in to save",
  },

  modal: {
    close: "Close",
    open: "Open resource",
    viewDetails: "View details",
    noDescription: "No description available.",
    fixPrompt: "This link looks broken.",
    fixCta: "Suggest a fix",
    fixLabel: "Correct URL",
    fixSubmit: "Submit fix",
    fixSuccess: "Thanks! Your fix is in the review queue.",
    fixError: "Couldn't submit your fix. Please try again.",
    categories: "Categories",
    tags: "Tags",
    addedOn: "Added {{date}}",
  },

  taxonomy: {
    editCta: "Suggest edit",
    pendingSuggestion: "Suggestion pending",
    yourSuggestion: "Your suggested categories & tags",
    newLegend: "Newly added",
    removedLegend: "Removed",
    close: "Exit",
    addCategory: "Add a category…",
    addTag: "Add a tag…",
    submit: "Submit suggestion",
    atLeastOne: "Add at least one category or tag.",
    pendingText: "Add or clear the text in the input first.",
    success: "Thanks! Your suggestion is in the review queue.",
    error: "Couldn't submit your suggestion. Please try again.",
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
    signInPrompt: "Sign in to see your favorites.",
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
      "Know a great resource that’s missing? Suggest it — we review every submission before it goes live.",
    name: "Name",
    url: "URL",
    category: "Category",
    selectCategory: "Select a category…",
    otherCategory: "Other…",
    customCategoryPlaceholder: "Type a category",
    pricing: "Pricing (optional)",
    tags: "Tags (optional)",
    tagsPlaceholder: "Comma-separated, e.g. react, css",
    viewMine: "View my submissions",
    note: "Note",
    notePlaceholder: "Why is this resource great?",
    submit: "Submit resource",
    success: "Thanks! Your suggestion is in the review queue.",
    error: "Something went wrong. Please try again.",
  },

  submissions: {
    title: "My submissions",
    empty: "You haven't submitted any resources yet.",
    status: { pending: "Pending", approved: "Approved", rejected: "Rejected" },
    reasonLabel: "Reason",
    noReason: "This submission wasn't approved.",
    edit: "Edit",
    cancel: "Cancel",
    urlFix: "URL fix",
    taxonomyFix: "Category/tag fix",
    editResubmit: "Edit & resubmit",
    resubmit: "Resubmit",
    resubmitSuccess: "Resubmitted! It's back in the review queue.",
    resubmitError: "Couldn't resubmit. Please try again.",
  },

  auth: {
    title: "Welcome 👋",
    requiredTitle: "Sign in required",
    requiredBody: "You need to be signed in to view this page.",
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
      "Resources for anything and everything — all in one place!",
    source: "Star on GitHub",
    reportIssue: "Report an issue",
    sponsor: "Sponsor",
  },
} as const;
