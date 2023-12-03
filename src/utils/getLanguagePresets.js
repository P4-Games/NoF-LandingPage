const presetsKey = {
  es: 'es',
  en: 'en',
  br: 'br'
}

export const languagePresets = [
  {
    name: 'Spanish',
    value: 'es'
  },
  {
    name: 'English',
    value: 'en'
  },
  {
    name: 'Portuguese',
    value: 'br'
  }
]

const getPreset = (presetsKey) => languagePresets.filter((item) => item.name === presetsKey)[0]

export default function getLanguagePresets(languagePresets) {
  let lng

  switch (languagePresets) {
    case presetsKey.es:
      lng = getPreset(presetsKey.es)
      break
    case presetsKey.en:
      lng = getPreset(presetsKey.en)
      break
    case presetsKey.br:
      lng = getPreset(presetsKey.br)
      break
    default:
      lng = getPreset(presetsKey.es)
  }
  return lng
}
