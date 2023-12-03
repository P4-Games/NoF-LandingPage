import React from 'react'
import PropTypes from 'prop-types'
import { useLayoutContext } from '../../hooks'
import Loading from '../Loading'
import NofHead from '../Head'
import Navbar from '../Navbar'
import Footer from '../Footer'

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
