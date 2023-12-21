import coinbaseModule from '@web3-onboard/coinbase'
import trustModule from '@web3-onboard/trust'
import gnosisModule from '@web3-onboard/gnosis'
import walletConnectModule from '@web3-onboard/walletconnect'
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import { init } from '@web3-onboard/react'

import { NETWORK, WalletConnectProjectId } from '../config'

import brLocales from '../../public/locales/br/web3_onboard.json'
import enLocales from '../../public/locales/en/web3_onboard.json'
import esLocales from '../../public/locales/es/web3_onboard.json'

//----------------------------------------------------------
console.log('initWeb3Onboard 1')
const wcV1InitOptions = {
  version: 1,
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'argent', 'trust']
  },
  connectFirstChainId: true
}
console.log('initWeb3Onboard 2')

const wcV2InitOptions = {
  version: 2,
  projectId: WalletConnectProjectId || ''
}
console.log('initWeb3Onboard 3')

const injected = injectedModule({
  filter: {
    // allow only on non-android mobile
    [ProviderLabel.Detected]: ['Android', 'desktop', 'macOS', 'iOS'],
    displayUnavailable: true
  }
})
console.log('initWeb3Onboard 4')

const walletConnect = walletConnectModule(wcV2InitOptions || wcV1InitOptions)
console.log('initWeb3Onboard 5')

const trust = trustModule()
console.log('initWeb3Onboard 6')
const coinbase = coinbaseModule()
console.log('initWeb3Onboard 7')
const gnosis = gnosisModule({
  whitelistedDomains: []
})
console.log('initWeb3Onboard 8')

export const initWeb3Onboard = init({
  wallets: [injected, walletConnect, gnosis, coinbase, trust],
  connect: {
    showSidebar: true,
    disableClose: false,
    autoConnectLastWallet: true,
    autoConnectAllPreviousWallet: true
  },
  accountCenter: {
    desktop: {
      enabled: false,
      minimal: true,
      position: 'bottomRight'
    },
    mobile: {
      enabled: false,
      minimal: true,
      position: 'topRight'
    }
  },
  notify: { enabled: true },
  chains: [
    {
      id: NETWORK.chainId,
      token: NETWORK.chainCurrency,
      label: NETWORK.chainName,
      rpcUrl: NETWORK.ChainRpcUrl
    }
  ],
  i18n: {
    en: enLocales,
    es: esLocales,
    br: brLocales
  },
  appMetadata: {
    name: 'NoF',
    description: 'Number one Fun',
    icon: '/images/common/nof.png',
    recommendedInjectedWallets: [
      {
        name: 'MetaMask',
        url: 'https://metamask.io'
      }
    ]
  }
})
console.log('initWeb3Onboard 9')

export const connectedWallets = async () => {
  await initWeb3Onboard.connectWallet()
}
