import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import uk from './locales/uk.json'

const savedLang = localStorage.getItem('lang') || 'uk'

export const i18n = createI18n({
    legacy: false,
    locale: savedLang,
    fallbackLocale: 'uk',
    messages: { en, uk }
})