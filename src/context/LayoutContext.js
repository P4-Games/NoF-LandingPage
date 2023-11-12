import PropTypes from 'prop-types'
import React, { createContext, useEffect, useState } from 'react'

const initialState = {
  windowSize: { size: false, mobile: false }
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

  return <LayoutContext.Provider value={windowSize}>{children}</LayoutContext.Provider>
}

export { LayoutProvider, LayoutContext }
