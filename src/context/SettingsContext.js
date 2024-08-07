/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable import/no-cycle */
import moment from 'moment'
import PropTypes from 'prop-types'
import { useEffect, createContext } from 'react'
import spanishLocalization from 'moment/locale/es'
import englishLocalization from 'moment/locale/en-gb'
import portugueseLocalization from 'moment/locale/pt-br'

import { useLocalStorage } from '../hooks'
import { defaultSettings } from '../config'
import getLanguagePresets, { languagePresets } from '../utils/getLanguagePresets'

const initialState = {
  ...defaultSettings,
  onToggleLanguageSetted: () => {},
  onChangeLanguagePresets: () => {},
  setLanguage: languagePresets[0],
  languageOption: []
}

const SettingsContext = createContext(initialState)

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
}

function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', {
    ...defaultSettings
  })

  useEffect(() => {
    moment.updateLocale('es', spanishLocalization)
    moment.updateLocale('en-gb', englishLocalization)
    moment.updateLocale('pt-br', portugueseLocalization)
  }, [])

  const onToggleLanguageSetted = (newLng = 'es') => {
    const getUrl = window.location
    const urlEN = getUrl.pathname.includes('/en/') || getUrl.pathname.includes('/en')
    const urlES = getUrl.pathname.includes('/es/') || getUrl.pathname.includes('/es')
    const urlBR = getUrl.pathname.includes('/br/') || getUrl.pathname.includes('/br')
    const urlNone = !urlEN && !urlES && !urlBR

    const mustChange =
      settings.languageSetted !== newLng ||
      (settings.languageSetted === 'en' && urlES) ||
      (settings.languageSetted === 'es' && urlEN) ||
      (settings.languageSetted === 'br' && urlBR) ||
      (settings.languageSetted === 'en' && urlNone)

    if (mustChange) {
      setSettings({
        ...settings,
        languageSetted: newLng
      })

      if (newLng === 'en') moment.locale('en-gb')
      else if (newLng === 'br') moment.locale('pt-br')
      else moment.locale(newLng)

      const pathName = getUrl.pathname
        .replace('/en', '/')
        .replace('/es', '/')
        .replace('/br', '/')
        .replace('/en/', '/')
        .replace('/es/', '/')
        .replace('/br/', '/')
      const resultUrl = `${getUrl.protocol}//${getUrl.host}/${newLng}/${pathName}`
      window.location = resultUrl
    }
  }

  const onChangeLanguagePresets = (event) => {
    setSettings({
      ...settings,
      language: event.target.value
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        moment,
        onToggleLanguageSetted,
        onChangeLanguagePresets,
        setLanguage: getLanguagePresets(settings.languagePresets),
        languageOption: languagePresets.map((lng) => ({
          name: lng.name,
          value: lng.value
        }))
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsContext, SettingsProvider }
