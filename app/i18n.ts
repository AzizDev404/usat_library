import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import uzTranslation from "../public/locales/uz/translation.json"
import ruTranslation from "../public/locales/ru/translation.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: {
        translation: uzTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
    },
    fallbackLng: "uz", // Agar tanlangan til topilmasa, 'uz' tiliga qaytadi
    debug: false, // Productionda false bo'lishi kerak
    interpolation: {
      escapeValue: false, // React allaqachon XSS himoyasini ta'minlaydi
    },
    detection: {
      order: ["localStorage", "navigator"], // Tilni aniqlash tartibi
      caches: ["localStorage"], // Tilni localStorage'da saqlash
    },
  })

export default i18n
