import { useContext } from 'react'
import { LayoutContext } from '../context/LayoutContext'

const useLayout = () => useContext(LayoutContext)

export default useLayout
