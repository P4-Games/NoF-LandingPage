import PropTypes from 'prop-types'
import '../styles/index.scss'
import '../styles/alpha.scss'
import '../styles/gamma.scss'
import '../styles/admin.scss'
import '../styles/common.scss'
import { appWithTranslation } from 'next-i18next'
// import { Web3ContextProvider } from '../context/Web3ContextNew'
import { Web3ContextProvider } from '../context/Web3Context'
import { SettingsProvider } from '../context/SettingsContext'
import { LayoutProvider } from '../context/LayoutContext'
import Layout from '../components/Layout'
function MyApp ({ Component, pageProps }) {
  return (
    <SettingsProvider>
        <Web3ContextProvider>
          <LayoutProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LayoutProvider>
        </Web3ContextProvider>
    </SettingsProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object
}

export default appWithTranslation(MyApp)
