import { useLanguage } from '~/composables/useCvLang'

const { language } = useLanguage()
export default function useFormatDate() {
  return function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
    }
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString(language.value, options)
  }
}
