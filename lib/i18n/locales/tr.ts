export const tr = {

  profile: {
    editTitle: "Profili düzenle",
    signInPrompt: "Profilini düzenlemek için giriş yap.",
    email: "E-posta",
    emailPublic: "Herkese açık",
    emailHidden: "Gizli",
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
    subtitle: "Tüm dizini kategorilere göre keşfet — her şey için kaynaklar.",
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
    submit: "Kaynak ekle",
    signOut: "Çıkış yap",
    account: "Hesap",
  },

  home: {
    badge: "{{count}}+ özenle seçilmiş kaynak",
    titleLead: "Bir sonraki",
    titleHighlight: "kaynağını bul.",
    subtitle:
      "İhtiyacın olabilecek her kaynak — her şey için, hepsi tek bir yerde!",
  },

  browse: {
    heading: "Kaynaklara göz at",
    summary: "{{categories}} kategoride {{resources}} kaynak.",
    searchPlaceholder: "İsim, etiket, açıklamaya göre ara…",
    filters: "Filtreler",
    sort: { featured: "Öne çıkanlar", popular: "En popüler", favorites: "En çok favorilenenler", name: "İsim A→Z", nameDesc: "İsim Z→A", recent: "Son eklenenler" },
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
    favoriteError: "Favori güncellenemedi. Lütfen tekrar dene.",
  },

  modal: {
    close: "Kapat",
    open: "Kaynağı aç",
    details: "Detaylar",
    viewDetails: "Detayları gör",
    noDescription: "Açıklama bulunmuyor.",
    fixPrompt: "Bu bağlantı kırık görünüyor.",
    fixCta: "Düzeltme öner",
    fixLabel: "Doğru URL",
    fixSubmit: "Düzeltmeyi gönder",
    fixSuccess: "Teşekkürler! Düzeltmen inceleme sırasında.",
    fixError: "Düzeltme gönderilemedi. Lütfen tekrar dene.",
    categories: "Kategoriler",
    tags: "Etiketler",
    addedOn: "{{date}} tarihinde eklendi",
  },

  taxonomy: {
    editCta: "Düzenleme öner",
    pendingSuggestion: "Önerin beklemede",
    yourSuggestion: "Önerdiğin kategori ve etiketler",
    newLegend: "Yeni eklenen",
    removedLegend: "Kaldırılan",
    close: "Çık",
    addCategory: "Kategori ekle…",
    addTag: "Etiket ekle…",
    submit: "Öneriyi gönder",
    atLeastOne: "En az bir kategori veya etiket ekle.",
    pendingText: "Önce kutudaki metni ekle veya temizle.",
    success: "Teşekkürler! Önerin inceleme sırasında.",
    error: "Önerin gönderilemedi. Lütfen tekrar dene.",
  },

  resource: { share: "Paylaş", related: "Önerilen kaynaklar" },

  contributor: {
    count_one: "{{count}} kaynak",
    count_other: "{{count}} kaynak",
    tier: {
      newcomer: "Yeni katkıcı",
      contributor: "Katkıcı",
      star: "Yıldız katkıcı",
      legend: "Efsane",
    },
  },

  cta: {
    title: "Eksik bir kaynak mı biliyorsun?",
    subtitle:
      "Depoya ekle — her gönderi yayına girmeden önce incelenir.",
    submit: "Kaynak ekle",
    emptyPrompt: "Bulamadın mı? Ekle, başkalarına da yardım et.",
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
    signInPrompt: "Favorilerini görmek için giriş yap.",
    title: "Favorilerin",
    empty: "Henüz hiç kaynak kaydetmedin.",
    browse: "Kaynaklara göz at",
  },

  notifications: {
    title: "Bildirimler",
    empty: "Henüz bildirim yok.",
    signInPrompt: "Bildirimlerini görmek için giriş yap.",
  },

  submit: {
    title: "Kaynak ekle",
    subtitle:
      "Eksik olan harika bir kaynak mı biliyorsun? Ekle — her gönderiyi yayına almadan önce inceliyoruz.",
    name: "İsim",
    url: "URL",
    category: "Kategori",
    selectCategory: "Bir kategori seç…",
    otherCategory: "Diğer…",
    customCategoryPlaceholder: "Bir kategori yaz",
    pricing: "Fiyatlandırma (opsiyonel)",
    tags: "Etiketler (opsiyonel)",
    tagsPlaceholder: "Virgülle ayır, örn. react, css",
    viewMine: "Gönderilerimi gör",
    note: "Not",
    notePlaceholder: "Bu kaynak neden harika?",
    submit: "Kaynağı ekle",
    success: "Teşekkürler! Gönderin inceleme sırasında.",
    error: "Bir şeyler ters gitti. Lütfen tekrar dene.",
  },

  submissions: {
    title: "Gönderilerim",
    empty: "Henüz hiç kaynak göndermedin.",
    status: { pending: "Beklemede", approved: "Onaylandı", rejected: "Reddedildi" },
    reasonLabel: "Gerekçe",
    noReason: "Bu gönderi onaylanmadı.",
    edit: "Düzenle",
    cancel: "Vazgeç",
    urlFix: "URL düzeltme",
    taxonomyFix: "Kategori/etiket düzeltme",
    editResubmit: "Düzenle ve tekrar gönder",
    resubmit: "Tekrar gönder",
    resubmitSuccess: "Tekrar gönderildi! İnceleme sırasına alındı.",
    resubmitError: "Tekrar gönderilemedi. Lütfen tekrar dene.",
  },

  auth: {
    title: "Hoş geldin 👋",
    requiredTitle: "Giriş yapmanız gerekiyor",
    requiredBody: "Bu sayfayı görüntülemek için giriş yapmalısınız.",
    subtitle:
      "Favori kaydetmek, kaynak önermek ve deponun büyümesine katkıda bulunmak için katıl.",
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
      "Her şey için kaynaklar — hepsi tek bir yerde!",
    source: "GitHub'da yıldızla",
    reportIssue: "Sorun bildir",
    sponsor: "Sponsor ol",
    privacy: "Gizlilik Politikası",
    terms: "Kullanım Şartları",
  },

  legal: { updated: "Son güncelleme {{date}}" },

  consent: {
    message:
      "Siteyi geliştirmek için anonim analitik amacıyla çerez kullanıyoruz. Ayrıntılar:",
    accept: "Kabul et",
    decline: "Reddet",
  },

  account: {
    title: "Verilerin",
    export: "Verilerimi dışa aktar",
    delete: "Hesabı sil",
    deleted: "Hesabın silindi.",
    deleteError: "Hesabın silinemedi. Lütfen tekrar dene.",
    deleteTitle: "Hesabını silmek istiyor musun?",
    deleteWarning:
      "Bu işlem profilini, favorilerini ve gönderilerini kalıcı olarak siler. Geri alınamaz. Yayındaki kaynaklar kalır ama katkı atfın kaldırılır.",
    deleteConfirm: "Kalıcı olarak sil",
  },
} as const;
