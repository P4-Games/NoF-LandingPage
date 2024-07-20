const presetsKeyLng = {
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

export default function getLanguagePresets(opc) {
  let lng

  switch (opc) {
    case presetsKeyLng.es:
      lng = getPreset(presetsKeyLng.es)
      break
    case presetsKeyLng.en:
      lng = getPreset(presetsKeyLng.en)
      break
    case presetsKeyLng.br:
      lng = getPreset(presetsKeyLng.br)
      break
    default:
      lng = getPreset(presetsKeyLng.es)
  }
  return lng
}
