import { useState, useEffect, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  useWeb3Modal,
  useDisconnect
} from '@web3modal/ethers5/react'
import daiAbi from './abis/testDai/TestDAI.v3.sol/NofTestDAIV3.json'
import alphaAbi from './abis/alpha/Alpha.v4.sol/NofAlphaV4.json'
import gammaPacksAbi from './abis/gamma/GammaPacks.v3.sol/NofGammaPacksV3.json'
import gammaCardsAbi from './abis/gamma/GammaCards.v5.sol/NofGammaCardsV5.json'
import gammaOffersAbi from './abis/gamma/GammaOffers.v4.sol/NofGammaOffersV4.json'
import gammaTicketsAbi from './abis/gamma/GammaTickets.v1.sol/NofGammaTicketsV1.json'
import { NETWORKS, walletConnectProjectId, environment } from '../config'
// import { NotificationContext } from './NotificationContext'
// import { getAccountAddressText } from '../utils/stringUtils'

const initialState = {
  connectWallet: () => {},
  disconnectWallet: () => {},
  getCurrentNetwork: () => {}
}

const Web3Context = createContext(initialState)

function Web3ContextProvider({ children }) {
  const [web3Error, setWeb3Error] = useState('')
  const [wallets, setWallets] = useState(null)
  const [isValidNetwork, setIsValidNetwork] = useState(false)
  const [daiContract, setDaiContract] = useState(null)
  const [alphaContract, setAlphaContract] = useState(null)
  const [gammaPacksContract, setGammaPacksContract] = useState(null)
  const [gammaCardsContract, setGammaCardsContract] = useState(null)
  const [gammaOffersContract, setGammaOffersContract] = useState(null)
  const [gammaTicketsContract, setGammaTicketsContract] = useState(null)
  // const { addNotification } = useContext(NotificationContext)
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const { disconnect } = useDisconnect()

  const metadata = {
    name: 'NoF',
    description: 'Number One Fan',
    url: 'https://nof.town',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const enabledNetworks = Object.keys(NETWORKS)
    .filter((networkKey) => {
      const network = NETWORKS[networkKey]
      return network.config.enabled === 'true' && network.config.environments.includes(environment)
    })
    .map((networkKey) => {
      const network = NETWORKS[networkKey]
      return {
        web3ModalConfig: {
          chainId: network.config.chainId.d,
          name: network.config.chainName,
          currency: network.config.chainCurrency,
          explorerUrl: network.config.chainExplorerUrl,
          rpcUrl: network.config.ChainRpcUrl
        },
        config: network.config,
        contracts: network.contracts
      }
    })

  const enabledNetworkNames = enabledNetworks
    .map((network) => network.web3ModalConfig.name)
    .join(', ')
  const webModalConfigs = enabledNetworks.map((network) => network.web3ModalConfig)

  createWeb3Modal({
    ethersConfig: defaultConfig({
      metadata,
      defaultChainId: enabledNetworks[0].config.chainId.d,
      enableEIP6963: true,
      enableInjected: true,
      enableCoinbase: true,
      rpcUrl: enabledNetworks[0].config.ChainRpcUrl
    }),
    chains: webModalConfigs,
    projectId: walletConnectProjectId || 'ND',
    enableAnalytics: true,
    themeMode: 'light',
    themeVariables: {
      '--w3m-color-mix': '#00DCFF'
    }
  })
  const { open } = useWeb3Modal()

  function getCurrentNetwork() {
    const network = enabledNetworks.find((ntwk) => ntwk.web3ModalConfig.chainId === chainId)
    return network || null
  }

  function connectContracts(_signer) {
    try {
      console.info('connectContracts')
      const currentNetwork = getCurrentNetwork()
      if (!currentNetwork) {
        // eslint-disable-next-line no-console
        console.warn('No current network setting contracts')
        return
      }

      const { contracts } = currentNetwork

      const daiContractInstance = new ethers.Contract(contracts.daiAddress, daiAbi.abi, _signer)

      const alphaContractInstance = new ethers.Contract(
        contracts.alphaAddress,
        alphaAbi.abi,
        _signer
      )
      const gammaPacksContractInstance = new ethers.Contract(
        contracts.gammaPackAddress,
        gammaPacksAbi.abi,
        _signer
      )
      const gammaCardsContractInstance = new ethers.Contract(
        contracts.gammaCardsAddress,
        gammaCardsAbi.abi,
        _signer
      )
      const gammaOffersContractInstance = new ethers.Contract(
        contracts.gammaOffersAddress,
        gammaOffersAbi.abi,
        _signer
      )
      const gammaTicketsContractInstance = new ethers.Contract(
        contracts.gammaTicketsAddress,
        gammaTicketsAbi.abi,
        _signer
      )

      /*
      gammaPacksContractInstance.on('PackTransfered', (from, to, tokenId) => {
        const packNbr = ethers.BigNumber.from(tokenId).toNumber()
        addNotification(to, 'notification_pack_transfer', [
          { item: 'PACK', value: packNbr, valueShort: packNbr },
          { item: 'WALLET', value: from, valueShort: getAccountAddressText(from) }
        ])
      })

      gammaCardsContractInstance.on('CardTransfered', (from, to, cardNumber) => {
        const messages = {
          120: 'notification_album_transfer',
          121: 'notification_burn_album_transfer'
        }
        const msg = messages[cardNumber] || 'notification_card_transfer'

        addNotification(to, msg, [
          { item: 'CARD', value: cardNumber, valueShort: cardNumber },
          { item: 'WALLET', value: from, valueShort: getAccountAddressText(from) }
        ])
      })

      gammaCardsContractInstance.on('OfferCardsExchanged', (from, to, cNFrom, cNTo) => {
        addNotification(to, 'notification_exchange', [
          { item: 'CARD_RECEIVED', value: cNFrom, valueShort: cNFrom },
          { item: 'CARD_SENT', value: cNTo, valueShort: cNTo },
          { item: 'WALLET', value: from, valueShort: getAccountAddressText(from) }
        ])
        addNotification(from, 'notification_exchange', [
          { item: 'CARD_RECEIVED', value: cNTo, valueShort: cNTo },
          { item: 'CARD_SENT', value: cNFrom, valueShort: cNFrom },
          { item: 'WALLET', value: to, valueShort: getAccountAddressText(to) }
        ])
      })

      gammaCardsContractInstance.on('CardsBurned', (user, cardNumbers) => {
        addNotification(user, 'notification_cards_burned', [
          { item: 'CARDS_BURNED', value: cardNumbers.length, valueShort: cardNumbers.length }
        ])
      })

      gammaCardsContractInstance.on('AlbumCompleted', (user, clazz) => {
        if (parseInt(clazz, 10) === 1) addNotification(user, 'notification_album_120_completed', [])
        else addNotification(user, 'notification_album_60_completed', [])
      })

      gammaTicketsContractInstance.on('TicketGenerated', (_, ticketId, __, user) => {
        addNotification(user, 'notification_ticket_reception', [
          { item: 'TICKET_ID', value: ticketId, valueShort: getAccountAddressText(ticketId) }
        ])
      })
      */

      setDaiContract(daiContractInstance)
      setAlphaContract(alphaContractInstance)
      setGammaPacksContract(gammaPacksContractInstance)
      setGammaCardsContract(gammaCardsContractInstance)
      setGammaOffersContract(gammaOffersContractInstance)
      setGammaTicketsContract(gammaTicketsContractInstance)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.info('connectContracts error')
      console.error({ e })
    }
  }

  async function requestAccount() {
    let web3Provider

    try {
      console.info('requestAccount')

      if (!walletProvider) return
      web3Provider = new ethers.providers.Web3Provider(walletProvider)

      if (!web3Provider) return
      const providerWallets = await web3Provider.listAccounts()
      const providerChainId = (await web3Provider.getNetwork()).chainId

      setWallets(providerWallets)
      await web3Provider.getSigner().getAddress()

      const networkKeys = Object.keys(NETWORKS)
      const validNetwork = networkKeys.some((networkKey) => {
        const network = NETWORKS[networkKey]
        return (
          network.config.enabled.toString().toLowerCase() === 'true' &&
          network.config.environments.includes(environment) &&
          network.config.chainId.d === providerChainId
        )
      })

      if (validNetwork) {
        connectContracts(web3Provider.getSigner())
        setIsValidNetwork(true)
      } else {
        setIsValidNetwork(false)
        setWeb3Error('account_invalid_network')
      }

      // return [web3Provider, accountAddress]
    } catch (e) {
      // eslint-disable-next-line no-console
      console.info('requestAccount error')
      console.error({ e })
    }
  }

  useEffect(() => {
    requestAccount()
  }, [isConnected, chainId, address]) //eslint-disable-line react-hooks/exhaustive-deps

  function connectWallet() {
    try {
      console.info('connectWallet')
      setWeb3Error('')
      open()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.info('connectWallet error')
      console.error({ e })
    }
  }

  async function disconnectWallet() {
    disconnect()
    setWallets(null)
    setIsValidNetwork(false)
    setWeb3Error('')
  }

  useEffect(() => {
    if (window && typeof window.ethereum === 'undefined') {
      setWeb3Error('account_no_metamask')
      return
    }

    if (window && window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', (accounts) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged event', accounts, address)
      })

      window.ethereum.on('chainChanged', (newChainIdDec) => {
        setWeb3Error('account_invalid_network')
        setIsValidNetwork(false)

        const enabledNetworkChainIdsDec = enabledNetworks.map(
          (network) => network.web3ModalConfig.chainId
        )
        if (enabledNetworkChainIdsDec.includes(newChainIdDec)) {
          const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
          const signer = provider.getSigner()
          connectContracts(signer)
          setIsValidNetwork(true)
        }
      })
    }
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    chainId,
    wallets,
    walletAddress: address,
    daiContract,
    alphaContract,
    gammaPacksContract,
    gammaCardsContract,
    gammaOffersContract,
    gammaTicketsContract,
    web3Error,
    isConnected,
    isValidNetwork,
    enabledNetworkNames,
    connectWallet,
    disconnectWallet,
    getCurrentNetwork
  }

  // eslint-disable-next-line react/jsx-filename-extension
  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

Web3ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { Web3ContextProvider, Web3Context }
