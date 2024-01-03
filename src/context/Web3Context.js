import { useState, useEffect, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { useWeb3Modal, useDisconnect } from '@web3modal/ethers5/react'
import daiAbi from './abis/TestDAI.v3.sol/NofTestDAIV3.json'
import alphaAbi from './abis/Alpha.v3.sol/NofAlphaV3.json'
import gammaPacksAbi from './abis/GammaPacks.v3.sol/NofGammaPacksV3.json'
import gammaCardsAbi from './abis/GammaCards.v5.sol/NofGammaCardsV5.json'
import gammaOffersAbi from './abis/GammaOffers.v4.sol/NofGammaOffersV4.json'
import gammaTicketsAbi from './abis/GammaTickets.v1.sol/NofGammaTicketsV1.json'
import { CONTRACTS, NETWORK, WalletConnectProjectId } from '../config'
import { NotificationContext } from './NotificationContext'
import { getAccountAddressText } from '../utils/stringUtils'

const initialState = {
  connectWallet: () => {},
  disconnectWallet: () => {},
  switchOrCreateNetwork: () => {}
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
  const { addNotification } = useContext(NotificationContext)
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const { disconnect } = useDisconnect()

  const mumbai = {
    chainId: hexToDec(NETWORK.chainId),
    name: NETWORK.chainName,
    currency: NETWORK.chainCurrency,
    explorerUrl: NETWORK.chainExplorerUrl,
    rpcUrl: NETWORK.ChainRpcUrl
  }

  const metadata = {
    name: 'NoF',
    description: 'Number One Fun',
    url: 'https://nof.town',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  createWeb3Modal({
    ethersConfig: defaultConfig({
      metadata,
      defaultChainId: hexToDec(NETWORK.chainId),
      enableEIP6963: true,
      enableInjected: true,
      enableCoinbase: true,
      rpcUrl: NETWORK.ChainRpcUrl
    }),
    chains: [mumbai],
    projectId: WalletConnectProjectId,
    enableAnalytics: true,
    themeMode: 'light',
    themeVariables: {
      '--w3m-color-mix': '#00DCFF'
    }
  })
  const { open } = useWeb3Modal()

  async function requestAccount() {
    let web3Provider
    let accountAddress
    try {
      if (!walletProvider) return
      web3Provider = new ethers.providers.Web3Provider(walletProvider)

      if (!web3Provider) return
      const _wallets = await web3Provider.listAccounts()
      const _chainId = (await web3Provider.getNetwork()).chainId

      setWallets(_wallets)
      accountAddress = await web3Provider.getSigner().getAddress()
      const chainIdHex = decToHex(_chainId)

      if (chainIdHex === NETWORK.chainId) {
        connectContracts(web3Provider.getSigner())
        setIsValidNetwork(true)
      } else {
        setIsValidNetwork(false)
        setWeb3Error('account_invalid_network')
        // await switchOrCreateNetwork()
      }
      return [web3Provider, accountAddress]
    } catch (e) {
      console.error({ e })
    }
  }

  useEffect(() => {
    requestAccount()
  }, [isConnected, chainId, address]) //eslint-disable-line react-hooks/exhaustive-deps

  function connectWallet() {
    try {
      setWeb3Error('')
      open()
    } catch (e) {
      console.error({ e })
    }
  }

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
      const gammaTicketsContractInstance = new ethers.Contract(
        CONTRACTS.gammaTicketsAddress,
        gammaTicketsAbi.abi,
        _signer
      )

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
        if (parseInt(clazz) === 1) addNotification(user, 'notification_album_120_completed', [])
        else addNotification(user, 'notification_album_60_completed', [])
      })

      gammaTicketsContractInstance.on('TicketGenerated', (_, ticketId, __, user) => {
        addNotification(user, 'notification_ticket_reception', [
          { item: 'TICKET_ID', value: ticketId, valueShort: getAccountAddressText(ticketId) }
        ])
      })

      setDaiContract(daiContractInstance)
      setAlphaContract(alphaContractInstance)
      setGammaPacksContract(gammaPacksContractInstance)
      setGammaCardsContract(gammaCardsContractInstance)
      setGammaOffersContract(gammaOffersContractInstance)
      setGammaTicketsContract(gammaTicketsContractInstance)
    } catch (e) {
      console.error({ e })
    }
  }

  async function disconnectWallet() {
    disconnect()
    setWallets(null)
    setIsValidNetwork(false)
    setWeb3Error('')
  }

  function decToHex(number) {
    return `0x${parseInt(number).toString(16)}`
  }

  function hexToDec(str) {
    return parseInt(str, 16)
  }

  async function switchOrCreateNetwork() {
    // open({ view: 'Networks' })

    if (window && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NETWORK.chainId }]
        })
        setIsValidNetwork(true)
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: NETWORK.chainId,
                  chainName: NETWORK.chainName,
                  rpcUrls: [NETWORK.ChainRpcUrl],
                  nativeCurrency: {
                    name: NETWORK.chainCurrency,
                    symbol: NETWORK.chainCurrency,
                    decimals: 18
                  },
                  blockExplorerUrls: [NETWORK.chainExplorerUrl]
                }
              ]
            })
          } catch (e) {
            console.error({ e })
          }
        } else {
          console.error('Error switching network', error)
        }
      }
    } else {
      console.error('Metamask or compatible wallet not installed')
    }
  }

  useEffect(() => {
    if (window && typeof window.ethereum === 'undefined') {
      setWeb3Error('account_no_metamask')
      return
    }

    if (window && window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('chainChanged event', accounts, address)
      })

      window.ethereum.on('chainChanged', (newChain) => {
        setWeb3Error('account_invalid_network')
        const _chanIdHex = decToHex(newChain)
        setIsValidNetwork(false)

        if (_chanIdHex === NETWORK.chainId) {
          const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
          const signer = provider.getSigner()
          connectContracts(signer)
          setIsValidNetwork(true)
        }
      })
    }
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

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
    open,
    connectWallet,
    disconnectWallet,
    switchOrCreateNetwork
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

Web3ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { Web3ContextProvider, Web3Context }
