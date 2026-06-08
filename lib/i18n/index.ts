"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "./locales/en";
import { de } from "./locales/de";
import { fr } from "./locales/fr";
import { es } from "./locales/es";
import { tr } from "./locales/tr";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "tr", label: "Türkçe" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        de: { translation: de },
        fr: { translation: fr },
        es: { translation: es },
        tr: { translation: tr },
      },
      fallbackLng: "en",
      supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "lang",
        caches: ["localStorage"],
      },
      react: { useSuspense: false },
    });

  // Keep <html lang> in sync for accessibility / SEO.
  i18n.on("languageChanged", (lng) => {
    if (typeof document !== "undefined") document.documentElement.lang = lng;
  });
}

export default i18n;
