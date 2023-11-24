import { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'

const useSettingsContext = () => useContext(SettingsContext)

export default useSettingsContext
