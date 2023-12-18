import { useContext } from 'react'
import { GammaDataContext } from '../context/GammaDataContext'

const useGammaDataContext = () => useContext(GammaDataContext)

export default useGammaDataContext
