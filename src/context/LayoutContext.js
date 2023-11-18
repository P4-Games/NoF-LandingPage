import PropTypes from 'prop-types'
import React, { useCallback, createContext, useEffect, useState, useRef } from 'react'

const initialState = {
  windowSize: { size: false, mobile: false },
  bookRef: null
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
  const [loading, setLoading] = useState(false)
  const bookRef = useRef(null)

  const updateMedia = () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 600
      setWindowSize({
        size: isMobile,
        mobile: isMobile
      })
    }
  }

  const startLoading = useCallback(() => {
    setLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
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
        startLoading,
        stopLoading,
        turnPrevPage,
        turnNextPage,
        goToCollectionsPage
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export { LayoutProvider, LayoutContext }
