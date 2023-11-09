import PropTypes from 'prop-types'
import '../styles/index.scss'
import '../styles/alpha.scss'
import '../styles/gamma.scss'
import '../styles/admin.scss'
import '../styles/common.scss'
import { appWithTranslation } from 'next-i18next'
import EthersProvider from '../context/EthersContext'
import { SettingsProvider } from '../context/SettingsContext'

function MyApp ({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <EthersProvider>
        <Component {...pageProps} />
      </EthersProvider>
    </SettingsProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object
}

export default appWithTranslation(MyApp)
