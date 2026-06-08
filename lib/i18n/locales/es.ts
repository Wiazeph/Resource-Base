export const es = {

  profile: {
    editTitle: "Editar perfil",
    signInPrompt: "Inicia sesión para editar tu perfil.",
    username: "Nombre de usuario",
    fullName: "Nombre completo",
    bio: "Biografía",
    portfolio: "Portafolio",
    save: "Guardar perfil",
    saved: "Perfil guardado.",
    saveError: "No se pudo guardar. Inténtalo de nuevo.",
    usernameTaken: "Ese nombre de usuario ya está en uso.",
    contributions: "Contribuciones ({{count}})",
    noContributions: "Aún no hay contribuciones.",
  },

  categories: {
    title: "Categorías",
    subtitle: "Desde proyectos absurdos hasta ciencia seria — explora todo el directorio por categoría.",
    count: "{{count}} recursos",
    domain: { developer: "Desarrollo", designer: "Diseño", general: "General" },
  },
  language: { label: "Idioma" },

  header: {
    searchPlaceholder: "Buscar…",
    signIn: "Iniciar sesión",
  },

  nav: {
    profile: "Perfil",
    categories: "Categorías",
    notifications: "Notificaciones",
    favorites: "Favoritos",
    submit: "Sugerir un recurso",
    signOut: "Cerrar sesión",
    account: "Cuenta",
  },

  home: {
    badge: "{{count}}+ recursos gratuitos seleccionados",
    titleLead: "Encuentra tu próximo",
    titleHighlight: "recurso.",
    subtitle:
      "Miles de recursos gratuitos para todo — desde juguetes web peculiares hasta ciencia seria. Búscalo todo en un solo lugar.",
  },

  browse: {
    heading: "Explorar recursos",
    summary: "{{resources}} recursos en {{categories}} categorías.",
    searchPlaceholder: "Buscar por nombre, etiqueta, descripción…",
    filters: "Filtros",
    sort: { featured: "Destacados", popular: "Más populares", name: "Nombre A→Z", recent: "Añadidos recientemente" },
    facet: { category: "Categoría", pricing: "Precio", language: "Idioma", tags: "Etiquetas" },
    results: "{{count}} resultados",
    clear: "Limpiar",
    empty: "Ningún recurso coincide con tus filtros.",
    first: "Primera página",
    prev: "Anterior",
    next: "Siguiente",
    page: "Página {{page}} de {{total}}",
  },

  pricing: { free: "Gratis", freemium: "Opción gratuita", paid: "De pago" },
  languages: { en: "Inglés", tr: "Turco" },

  card: {
    addedBy: "añadido por @{{username}}",
    by: "por {{author}}",
    broken: "roto",
    addFavorite: "Añadir a favoritos",
    removeFavorite: "Quitar de favoritos",
    signInToSave: "Inicia sesión para guardar",
  },

  command: {
    title: "Buscar recursos",
    description: "Busca en todos los recursos, categorías y etiquetas.",
    placeholder: "Buscar recursos, etiquetas, categorías…",
    empty: "No hay recursos coincidentes.",
    featured: "Destacados",
    results: "Resultados",
    goTo: "Ir a",
    browseAll: "Explorar todos los recursos",
  },

  category: { home: "Inicio", resources: "{{count}} recursos" },
  tag: { home: "Inicio", resources: "{{count}} recursos" },

  favorites: {
    signInPrompt: "Inicia sesión para ver tus favoritos.",
    title: "Tus favoritos",
    empty: "Aún no has guardado ningún recurso.",
    browse: "Explorar recursos",
  },

  notifications: {
    title: "Notificaciones",
    empty: "Aún no hay notificaciones.",
    signInPrompt: "Inicia sesión para ver tus notificaciones.",
    back: "Volver al inicio",
  },

  submit: {
    title: "Sugerir un recurso",
    subtitle:
      "¿Conoces un gran recurso gratuito que falta? Sugiérelo — revisamos cada propuesta antes de publicarla.",
    name: "Nombre",
    url: "URL",
    category: "Categoría",
    selectCategory: "Selecciona una categoría…",
    note: "Nota",
    notePlaceholder: "¿Por qué es genial este recurso?",
    email: "Tu correo (opcional)",
    submit: "Enviar recurso",
    success: "¡Gracias! Tu propuesta está en revisión.",
    error: "Algo salió mal. Inténtalo de nuevo.",
  },

  auth: {
    title: "Bienvenido 👋",
    subtitle: "Inicia sesión para guardar favoritos y enviar recursos.",
    google: "Continuar con Google",
    github: "Continuar con GitHub",
    or: "o",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    createAccount: "Crear cuenta",
    emailPlaceholder: "tu@ejemplo.com",
    usernamePlaceholder: "Nombre de usuario",
    usernameInvalid: "El nombre de usuario debe tener 3-20 caracteres: a-z, 0-9, - o _",
    passwordPlaceholder: "Contraseña",
    confirmEmail: "Revisa tu correo para confirmar tu cuenta.",
    welcomeBack: "¡Bienvenido de nuevo!",
    failed: "Error de autenticación",
  },

  banner: {
    title: "Resource Base se está renovando 🚧",
    body:
      "Estamos reconstruyendo y mejorando activamente el sitio — algunas cosas pueden cambiar o fallar mientras trabajamos. Gracias por tu paciencia 💜",
  },

  footer: {
    tagline:
      "Un directorio curado y con búsqueda de recursos gratuitos para todo — desde juguetes web peculiares hasta ciencia seria.",
    source: "Código fuente",
    reportIssue: "Reportar un problema",
    sponsor: "Patrocinar",
  },
} as const;
