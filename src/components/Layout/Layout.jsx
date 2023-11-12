import React from 'react';
import { useLayout } from '../../hooks';
import Loading from '../Loading';

const Layout = ({ children }) => {
  const { loading } = useLayout();

  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  );
};

export default Layout;

