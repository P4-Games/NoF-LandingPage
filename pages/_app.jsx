import EthersProvider from '../context/EthersContext'
import PropTypes from 'prop-types'
import '../styles/index.scss'
import '../styles/alpha.scss'
import '../styles/gamma.scss'
import '../styles/admin.scss'


function MyApp ({ Component, pageProps }) {
  return (
    <EthersProvider>
      <Component {...pageProps} />
    </EthersProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object
}

export default MyApp;
