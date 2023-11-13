import React from 'react';
import PropTypes from 'prop-types'
import { useLayoutContext } from '../../hooks'
import Loading from '../Loading';

const Layout = ({ children }) => {
  const { loading } = useLayoutContext()

  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.object
}

export default Layout

