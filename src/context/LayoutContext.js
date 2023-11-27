import PropTypes from 'prop-types'
import React, { useCallback, createContext, useEffect, useState, useRef } from 'react'

const initialState = {
  windowSize: { size: false, mobile: false },
  bookRef: null,
  showDefaultButtons: true,
  buttonFunctions: [null, null, null, null],
  showButtons: [true, true, true, true]
}

const LayoutContext = createContext(initialState)

LayoutProvider.propTypes = {
  children: PropTypes.node.isRequired
}

function LayoutProvider({ children }) {
  const [windowSize, setWindowSize] = useState({
    size: typeof window !== 'undefined' && window.innerWidth < 600,
    mobile: typeof window !== 'undefined' && window.innerWidth < 600
  })
  const bookRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [showDefaultButtons, setShowDefaultButtons] = useState(true)
  const [buttonFunctions, setButtonFunctions] = useState([null, null, null, null])
  const [showButtons, setShowButtons] = useState([true, true, true, true])

  const updateButtonFunctions = useCallback((index, newFunction) => {
    setButtonFunctions((prevFunctions) => {
      const updatedFunctions = [...prevFunctions]
      updatedFunctions[index] = newFunction
      return updatedFunctions
    })
  }, [])


  const updateShowButtons = useCallback((btn1, btn2, btn3, btn4) => {
    setShowButtons(btn1, btn2, btn3, btn4)
  }, [])

  const startLoading = useCallback(() => {
    setLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
  }, [])

  const ToggleShowDefaultButtons = useCallback((toggle) => {
    setShowDefaultButtons(toggle)
  }, [])

  const turnPrevPage = useCallback(() => {
    if (!bookRef.current) return
    bookRef.current.pageFlip().flipPrev()
  }, [])

  const turnNextPage = useCallback(() => {
    if (!bookRef.current) return
    bookRef.current.pageFlip().flipNext()
  }, [])

  function goToCollectionsPage() {
    if (!bookRef.current) return
    bookRef.current.pageFlip().flip(windowSize.mobile ? 4 : 5)
  }

  const updateMedia = () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 600
      setWindowSize({
        size: isMobile,
        mobile: isMobile
      })
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateMedia)
      return () => {
        window.removeEventListener('resize', updateMedia)
      }
    }
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        windowSize,
        loading,
        bookRef,
        buttonFunctions,
        showButtons,
        showDefaultButtons,
        startLoading,
        stopLoading,
        turnPrevPage,
        turnNextPage,
        goToCollectionsPage,
        updateButtonFunctions,
        updateShowButtons,
        ToggleShowDefaultButtons
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export { LayoutProvider, LayoutContext }
