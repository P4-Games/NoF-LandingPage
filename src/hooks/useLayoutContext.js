import { useContext } from 'react'
import { LayoutContext } from '../context/LayoutContext'

const useLayoutContext = () => useContext(LayoutContext)

export default useLayoutContext
