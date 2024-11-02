// useLanguage.ts
import { ref, watch } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useI18n } from '#imports'

export function useLanguage() {
  // Check if `localStorage` is available
  const isClient = typeof window !== 'undefined'
  const language = ref(isClient ? localStorage.getItem('cvLang') || 'en' : 'en')

  const setLanguage = async (lang: string) => {
    if (isClient) {
      localStorage.setItem('cvLang', lang)
      language.value = lang
    }
  }

  return {
    language,
    setLanguage,
  }
}
