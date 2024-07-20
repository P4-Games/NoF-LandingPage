import React from 'react'
import PropTypes from 'prop-types'

import NofHead from '../Head'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Loading from '../Loading'
import { useLayoutContext } from '../../hooks'

const Layout = ({ children }) => {
  const { loading } = useLayoutContext()

  return (
    <>
      {loading && <Loading />}
      <NofHead />
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.object
}

export default Layout
