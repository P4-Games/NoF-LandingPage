import { useEffect } from 'react';
import PropTypes from 'prop-types'
import '../styles/index.scss'
import '../styles/alpha.scss'
import '../styles/gamma.scss'
import '../styles/admin.scss'
import '../styles/common.scss'
import { appWithTranslation } from 'next-i18next'
import { EthersProvider } from '../context/Web3Context'
import { SettingsProvider } from '../context/SettingsContext'
import { LayoutProvider } from '../context/LayoutContext'
import Layout from '../components/Layout'
function MyApp ({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <EthersProvider>
        <LayoutProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LayoutProvider>
      </EthersProvider>
    </SettingsProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object
}

export default appWithTranslation(MyApp)
