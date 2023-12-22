import { useEffect } from 'react'
import PropTypes from 'prop-types'
import '../styles/index.scss'
import '../styles/alpha.scss'
import '../styles/gamma.scss'
import '../styles/admin.scss'
import '../styles/common.scss'
import '../styles/offline.scss'
import '../styles/gamma-flip-cards.scss'

import { appWithTranslation } from 'next-i18next'
import { Web3ContextProvider } from '../context/Web3Context'
import { NotificationProvider } from '../context/NotificationContext'
import { SettingsProvider } from '../context/SettingsContext'
import { LayoutProvider } from '../context/LayoutContext'
import Layout from '../components/Layout'
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator && window && !window.location.hostname.includes('localhost')) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js', { type: 'module' }).then(
          function (registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope)
          },
          function (err) {
            console.error('Service Worker registration failed: ', err)
          }
        )
      })
    }
  }, [])

  return (
    <SettingsProvider>
      <NotificationProvider>
        <Web3ContextProvider>
          <LayoutProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LayoutProvider>
        </Web3ContextProvider>
      </NotificationProvider>
    </SettingsProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object
}

export default appWithTranslation(MyApp)
