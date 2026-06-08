export const tr = {

  profile: {
    editTitle: "Profili düzenle",
    signInPrompt: "Profilini düzenlemek için giriş yap.",
    username: "Kullanıcı adı",
    fullName: "Ad soyad",
    bio: "Biyografi",
    portfolio: "Portfolyo",
    save: "Profili kaydet",
    saved: "Profil kaydedildi.",
    saveError: "Kaydedilemedi. Lütfen tekrar dene.",
    usernameTaken: "Bu kullanıcı adı alınmış.",
    contributions: "Katkılar ({{count}})",
    noContributions: "Henüz katkı yok.",
  },

  categories: {
    title: "Kategoriler",
    subtitle: "Saçma yan projelerden ciddi bilime kadar — tüm dizini kategorilere göre keşfet.",
    count: "{{count}} kaynak",
    domain: { developer: "Geliştirme", designer: "Tasarım", general: "Genel" },
  },
  language: { label: "Dil" },

  header: {
    searchPlaceholder: "Ara…",
    signIn: "Giriş yap",
  },

  nav: {
    profile: "Profil",
    categories: "Kategoriler",
    notifications: "Bildirimler",
    favorites: "Favoriler",
    submit: "Kaynak öner",
    signOut: "Çıkış yap",
    account: "Hesap",
  },

  home: {
    badge: "{{count}}+ özenle seçilmiş ücretsiz kaynak",
    titleLead: "Bir sonraki",
    titleHighlight: "kaynağını bul.",
    subtitle:
      "Her şey için binlerce ücretsiz kaynak — tuhaf web araçlarından ciddi bilime. Hepsini tek yerde ara.",
  },

  browse: {
    heading: "Kaynaklara göz at",
    summary: "{{categories}} kategoride {{resources}} kaynak.",
    searchPlaceholder: "İsim, etiket, açıklamaya göre ara…",
    filters: "Filtreler",
    sort: { featured: "Öne çıkanlar", popular: "En popüler", name: "İsim A→Z", recent: "Son eklenenler" },
    facet: { category: "Kategori", pricing: "Fiyat", language: "Dil", tags: "Etiketler" },
    results: "{{count}} sonuç",
    clear: "Temizle",
    empty: "Filtrelerinize uygun kaynak yok.",
    first: "İlk sayfa",
    prev: "Önceki",
    next: "Sonraki",
    page: "Sayfa {{page}} / {{total}}",
  },

  pricing: { free: "Ücretsiz", freemium: "Ücretsiz seçenek", paid: "Ücretli" },
  languages: { en: "İngilizce", tr: "Türkçe" },

  card: {
    addedBy: "@{{username}} ekledi",
    by: "{{author}} tarafından",
    broken: "kırık",
    addFavorite: "Favorilere ekle",
    removeFavorite: "Favorilerden çıkar",
    signInToSave: "Kaydetmek için giriş yap",
  },

  command: {
    title: "Kaynaklarda ara",
    description: "Tüm kaynaklarda, kategorilerde ve etiketlerde ara.",
    placeholder: "Kaynak, etiket, kategori ara…",
    empty: "Eşleşen kaynak yok.",
    featured: "Öne çıkanlar",
    results: "Sonuçlar",
    goTo: "Git",
    browseAll: "Tüm kaynaklara göz at",
  },

  category: { home: "Anasayfa", resources: "{{count}} kaynak" },
  tag: { home: "Anasayfa", resources: "{{count}} kaynak" },

  favorites: {
    title: "Favorilerin",
    empty: "Henüz hiç kaynak kaydetmedin.",
    browse: "Kaynaklara göz at",
  },

  notifications: {
    title: "Bildirimler",
    empty: "Henüz bildirim yok.",
    signInPrompt: "Bildirimlerini görmek için giriş yap.",
    back: "Anasayfaya dön",
  },

  submit: {
    title: "Kaynak öner",
    subtitle:
      "Eksik olan harika bir ücretsiz kaynak mı biliyorsun? Öner — her öneriyi yayına almadan önce inceliyoruz.",
    name: "İsim",
    url: "URL",
    category: "Kategori",
    selectCategory: "Bir kategori seç…",
    note: "Not",
    notePlaceholder: "Bu kaynak neden harika?",
    email: "E-postan (opsiyonel)",
    submit: "Kaynağı gönder",
    success: "Teşekkürler! Önerin inceleme sırasında.",
    error: "Bir şeyler ters gitti. Lütfen tekrar dene.",
  },

  auth: {
    title: "Hoş geldin 👋",
    subtitle: "Favori kaydetmek ve kaynak önermek için giriş yap.",
    google: "Google ile devam et",
    github: "GitHub ile devam et",
    or: "veya",
    signIn: "Giriş yap",
    signUp: "Kayıt ol",
    createAccount: "Hesap oluştur",
    emailPlaceholder: "sen@ornek.com",
    usernamePlaceholder: "Kullanıcı adı",
    usernameInvalid: "Kullanıcı adı 3-20 karakter olmalı: a-z, 0-9, - veya _",
    passwordPlaceholder: "Şifre",
    confirmEmail: "Hesabını onaylamak için e-postanı kontrol et.",
    welcomeBack: "Tekrar hoş geldin!",
    failed: "Kimlik doğrulama başarısız",
  },

  banner: {
    title: "Resource Base yenileniyor 🚧",
    body:
      "Siteyi aktif olarak yeniden inşa edip geliştiriyoruz — bu sırada bazı şeyler değişebilir veya bozulabilir. Sabrın için teşekkürler 💜",
  },

  footer: {
    tagline:
      "Her şey için ücretsiz kaynakların özenle seçilmiş, aranabilir bir dizini — tuhaf web araçlarından ciddi bilime.",
    source: "Kaynak kod",
    reportIssue: "Sorun bildir",
    sponsor: "Sponsor ol",
  },
} as const;
