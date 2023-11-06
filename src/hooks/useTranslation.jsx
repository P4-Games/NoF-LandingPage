/*
import useLocalStorage from 'use-local-storage'
import * as locales from './locales'

export default function useTranslation () {
  const [language, setLanguage] = useLocalStorage('language', 'en')
  const [fallbackLanguage, setFallbackLanguage] = useLocalStorage(
    'fallbackLanguage',
    'en'
  )

  const translate = key => {
  const keys = key.split('.')

  return (
    getNestedTranslation(language, keys) ?? getNestedTranslation(fallbackLanguage, keys) ?? key
  )
  }

  return {
    language,
    setLanguage,
    fallbackLanguage,
    setFallbackLanguage,
    t: translate
  }
}

function getNestedTranslation (language, keys) {
  return keys.reduce((obj, key) => obj?.[key], locales[language])
}
*/