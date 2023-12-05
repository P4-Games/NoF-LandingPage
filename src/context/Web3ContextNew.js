import PropTypes from 'prop-types'
import { createContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

import coinbaseModule from '@web3-onboard/coinbase'
import trustModule from '@web3-onboard/trust'
import gnosisModule from '@web3-onboard/gnosis'
import walletConnectModule from '@web3-onboard/walletconnect'
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import { init } from '@web3-onboard/react'

import daiAbi from './abis/TestDAI.v3.sol/NofTestDAIV3.json'
import alphaAbi from './abis/Alpha.v3.sol/NofAlphaV3.json'
import gammaPacksAbi from './abis/GammaPacks.v3.sol/NofGammaPacksV3.json'
import gammaCardsAbi from './abis/GammaCards.v5.sol/NofGammaCardsV5.json'
import gammaOffersAbi from './abis/GammaOffers.v4.sol/NofGammaOffersV4.json'
import { CONTRACTS, NETWORK, WalletConnectProjectId } from '../config'

import brLocales from '../../public/locales/br/web3_onboard.json'
import enLocales from '../../public/locales/en/web3_onboard.json'
import esLocales from '../../public/locales/es/web3_onboard.json'

//----------------------------------------------------------

const initialState = {
  connectWallet: () => {},
  disconnectWallet: () => {}
}

const Web3Context = createContext(initialState)

const Web3ContextProvider = ({ children }) => {
  const [web3Onboard, setWeb3Onboard] = useState(null)
  const [wallets, setWallets] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [alphaContract, setAlphaContract] = useState(null)
  const [gammaPacksContract, setGammaPacksContract] = useState(null)
  const [gammaCardsContract, setGammaCardsContract] = useState(null)
  const [gammaOffersContract, setGammaOffersContract] = useState(null)
  // const { languageSetted } = useSettingsContext()

  const initWeb3Onboard = useCallback(async () => {
    const wcV1InitOptions = {
      version: 1,
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModalOptions: {
        mobileLinks: ['metamask', 'argent', 'trust']
      },
      connectFirstChainId: true
    }

    const wcV2InitOptions = {
      version: 2,
      projectId: WalletConnectProjectId || ''
    }

    const injected = injectedModule({
      filter: {
        // allow only on non-android mobile
        [ProviderLabel.Detected]: ['Android', 'desktop', 'macOS', 'iOS'],
        displayUnavailable: true
      }
    })

    const walletConnect = walletConnectModule(wcV2InitOptions || wcV1InitOptions)
    const trust = trustModule()
    const coinbase = coinbaseModule()
    const gnosis = gnosisModule({
      whitelistedDomains: []
    })

    const onboard = init({
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

    setWeb3Onboard(onboard)
  }, [])

  useEffect(() => {
    initWeb3Onboard().then(() => {})
  }, [initWeb3Onboard])

  /*
  useEffect(() => {
    if (web3Onboard) {
      updateLocale(languageSetted || 'en')
    }
  }, [languageSetted])
  */

  /*
  function switchNetwork() {
    // console.log(web3Onboard)
    // const currentNetwork = web3Onboard.getCurrentNetwork()
    // const desiredNetwork = 'mumbai'
    // const isCorrectNetwork = currentNetwork === desiredNetwork
    // console.log('network', currentNetwork, desiredNetwork,  isCorrectNetwork)
  }
  */

  function connectContracts(_signer) {
    try {
      const daiContractInstance = new ethers.Contract(CONTRACTS.daiAddress, daiAbi.abi, _signer)

      const alphaContractInstance = new ethers.Contract(
        CONTRACTS.alphaAddress,
        alphaAbi.abi,
        _signer
      )
      const gammaPacksContractInstance = new ethers.Contract(
        CONTRACTS.gammaPackAddress,
        gammaPacksAbi.abi,
        _signer
      )
      const gammaCardsContractInstance = new ethers.Contract(
        CONTRACTS.gammaCardsAddress,
        gammaCardsAbi.abi,
        _signer
      )
      const gammaOffersContractInstance = new ethers.Contract(
        CONTRACTS.gammaOffersAddress,
        gammaOffersAbi.abi,
        _signer
      )

      setDaiContract(daiContractInstance)
      setAlphaContract(alphaContractInstance)
      setGammaPacksContract(gammaPacksContractInstance)
      setGammaCardsContract(gammaCardsContractInstance)
      setGammaOffersContract(gammaOffersContractInstance)
    } catch (e) {
      console.error({ e })
    }
  }

  const getProvider = (wlt) => {
    if (wlt) {
      // console.log(wlt)
      return new ethers.providers.Web3Provider(wlt.provider, 'any')
    } else {
      return new ethers.providers.JsonRpcProvider(
        NETWORK.ChainRpcUrl,
        parseInt(NETWORK.chainId, 10)
      )
    }
  }

  const connectWallet = useCallback(() => {
    // const updateLocale = useSetLocale()
    // updateLocale(languageSetted || 'en')

    web3Onboard
      .connectWallet()
      .then((wallets) => {
        if (wallets) {
          setWallets(wallets)
          if (wallets[0]) {
            setWalletAddress(wallets[0].accounts[0].address)
            const chanId = wallets[0]?.chains?.[0].id.toString()
            if (chanId) {
              const chanIdDecimal = parseInt(chanId, 16)
              const providerNetwork = ethers.providers.getNetwork(chanIdDecimal)
              setChainId(providerNetwork.chainId)
            }
            // switchNetwork()
            const provider = getProvider(wallets[0])
            const signer = provider.getSigner()
            connectContracts(signer)
          }
        }
      })
      .catch((e) => {
        console.error({ e })
      })
  }, [web3Onboard])

  const disconnectWallet = useCallback(() => {
    if (web3Onboard) {
      web3Onboard.walletReset()
      setWalletAddress(null)
    }
  }, [web3Onboard])

  const isValidNetwork = useCallback(() => chainId === NETWORK.chainId, [chainId])

  const switchOrCreateNetwork = useCallback(
    async (chainIdHex, chainName, rpcUrl, currency, explorer) => {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }]
        })
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainIdHex,
                  chainName,
                  rpcUrls: [rpcUrl],
                  nativeCurrency: {
                    name: currency,
                    symbol: currency,
                    decimals: 18
                  },
                  blockExplorerUrls: [explorer]
                }
              ]
            })
          } catch (e) {
            console.error(e.message)
          }
        }
      }
    },
    []
  )

  const value = {
    web3Onboard,
    wallets,
    walletAddress,
    daiContract,
    alphaContract,
    gammaPacksContract,
    gammaCardsContract,
    gammaOffersContract,
    connectWallet,
    disconnectWallet,
    isValidNetwork,
    switchOrCreateNetwork
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

Web3ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { Web3ContextProvider, Web3Context }
