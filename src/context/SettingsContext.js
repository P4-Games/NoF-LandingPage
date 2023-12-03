import PropTypes from "prop-types";
import {createContext} from "react";
import {useLocalStorage} from "../hooks";
import getLanguagePresets, {
  languagePresets
} from "../utils/getLanguagePresets";
import {defaultSettings} from "../config";

// ----------------------------------------------------------------------

const initialState = {
  ...defaultSettings,
  onToggleLanguageSetted: () => {},
  onChangeLanguagePresets: () => {},
  setLanguage: languagePresets[0],
  languageOption: []
};

const SettingsContext =
  createContext(initialState);

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

function SettingsProvider({children}) {
  const [settings, setSettings] = useLocalStorage(
    "settings",
    {
      ...defaultSettings
    }
  );

  const onToggleLanguageSetted = (
    newLng = "es"
  ) => {
    const getUrl = window.location;
    const urlEN =
      getUrl.pathname.includes("/en/") ||
      getUrl.pathname.includes("/en");
    const urlES =
      getUrl.pathname.includes("/es/") ||
      getUrl.pathname.includes("/es");
    const urlBR =
      getUrl.pathname.includes("/br/") ||
      getUrl.pathname.includes("/br");
    const urlNone = !urlEN && !urlES && !urlBR;

    const mustChange =
      settings.languageSetted !== newLng ||
      (settings.languageSetted === "en" &&
        urlES) ||
      (settings.languageSetted === "es" &&
        urlEN) ||
      (settings.languageSetted === "br" &&
        urlBR) ||
      (settings.languageSetted === "en" &&
        urlNone);

    if (mustChange) {
      setSettings({
        ...settings,
        languageSetted: newLng
      });

      const getUrl = window.location;
      const pathName = getUrl.pathname
        .replace("/en", "/")
        .replace("/es", "/")
        .replace("/br", "/")
        .replace("/en/", "/")
        .replace("/es/", "/")
        .replace("/br/", "/");
      const resultUrl =
        getUrl.protocol +
        "//" +
        getUrl.host +
        "/" +
        newLng +
        "/" +
        pathName;
      window.location = resultUrl;
    }
  };

  const onChangeLanguagePresets = (event) => {
    setSettings({
      ...settings,
      language: event.target.value
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onToggleLanguageSetted,
        //setUrlLanguage,
        // language
        onChangeLanguagePresets,
        setLanguage: getLanguagePresets(
          settings.languagePresets
        ),
        languageOption: languagePresets.map(
          (lng) => ({
            name: lng.name,
            value: lng.value
          })
        )
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export {SettingsProvider, SettingsContext};
