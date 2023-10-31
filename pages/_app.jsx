import EthersProvider from '../context/EthersContext'
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

export default MyApp;
