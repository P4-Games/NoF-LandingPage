import PropTypes from 'prop-types'
import React, { useCallback, createContext, useEffect, useState, useRef } from 'react'

const initialState = {
  windowSize: { size: false, mobile: false },
  bookRef: null,
  footerButtonsShowDefaults: true,
  footerButtonsFunctions: [null, null, null, null],
  footerButtonsToShow: [true, true, true, true],
  footerButtonsClasses: [null, null, null, null],
  lastPageIndex: 1
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
  const [footerButtonsShowDefaults, setShowDefaultButtons] = useState(true)
  const [footerButtonsFunctions, setFooterButtonsFunctions] = useState([null, null, null, null])
  const [footerButtonsToShow, setFooterButtonsToShow] = useState([true, true, true, true])
  const [footerButtonsClasses, setFooterButtonsClasses] = useState(null, null, null, null)

  const startLoading = useCallback(() => {
    setLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
  }, [])

  const updateFooterButtonsFunctions = useCallback((index, newFunction) => {
    setFooterButtonsFunctions((prevFunctions) => {
      const updatedFunctions = [...prevFunctions]
      updatedFunctions[index] = newFunction
      return updatedFunctions
    })
  }, [])

  const updateFooterButtonsClasses = useCallback((cls1, cls2, cls3, cls4) => {
    setFooterButtonsClasses(cls1, cls2, cls3, cls4)
  }, [])

  const updateFooterButtonsToShow = useCallback((btn1, btn2, btn3, btn4) => {
    setFooterButtonsToShow(btn1, btn2, btn3, btn4)
  }, [])

  const ToggleShowDefaultButtons = useCallback((toggle) => {
    setShowDefaultButtons(toggle)
  }, [])

  const turnPrevPage = useCallback(() => {
    if (!bookRef.current) return
    bookRef.current.pageFlip().flipPrev('bootom', true)
  }, [])

  const turnNextPage = useCallback(() => {
    if (!bookRef.current) return
    bookRef.current.pageFlip().flipNext('bootom', true)
  }, [])

  const getCurrentPage = useCallback(() => {
    if (!bookRef || !bookRef.current) return 0
    const currentPage = bookRef.current.pageFlip().getCurrentPageIndex()
    return currentPage
  }, [])

  const goToPage = useCallback((pageIndex) => {
    if (!bookRef.current) return
    bookRef.current.pageFlip().flip(pageIndex)
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
        buttonFunctions: footerButtonsFunctions,
        showButtons: footerButtonsToShow,
        showDefaultButtons: footerButtonsShowDefaults,
        footerButtonsClasses,
        startLoading,
        stopLoading,
        turnPrevPage,
        turnNextPage,
        getCurrentPage,
        goToPage,
        goToCollectionsPage,
        updateButtonFunctions: updateFooterButtonsFunctions,
        updateShowButtons: updateFooterButtonsToShow,
        updateFooterButtonsClasses,
        ToggleShowDefaultButtons
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export { LayoutProvider, LayoutContext }
