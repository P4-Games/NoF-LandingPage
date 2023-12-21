import { useState, useEffect, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import WalletConnectProvider from '@walletconnect/web3-provider'

import daiAbi from './abis/TestDAI.v3.sol/NofTestDAIV3.json'
import alphaAbi from './abis/Alpha.v3.sol/NofAlphaV3.json'
import gammaPacksAbi from './abis/GammaPacks.v3.sol/NofGammaPacksV3.json'
import gammaCardsAbi from './abis/GammaCards.v5.sol/NofGammaCardsV5.json'
import gammaOffersAbi from './abis/GammaOffers.v4.sol/NofGammaOffersV4.json'
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
  const [web3Modal, setWeb3Modal] = useState(null)
  const [web3Error, setWeb3Error] = useState('')
  const [wallets, setWallets] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isValidNetwork, setIsValidNetwork] = useState(false)
  const [chainId, setChainId] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [alphaContract, setAlphaContract] = useState(null)
  const [gammaPacksContract, setGammaPacksContract] = useState(null)
  const [gammaCardsContract, setGammaCardsContract] = useState(null)
  const [gammaOffersContract, setGammaOffersContract] = useState(null)
  const { addNotification } = useContext(NotificationContext)

  async function requestAccount() {
    const providerOptions = {
      injected: {
        display: {
          description: ' '
        }
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        display: {
          description: ' '
        },
        options: {
          appName: 'NoF'
        }
      },
      binancechainwallet: {
        package: true,
        display: {
          description: ' '
        }
      },
      walletconnect: {
        package: WalletConnectProvider,
        display: {
          description: ' '
        },
        options: {
          version: 2,
          clientId: WalletConnectProjectId,
          rpc: {
            [parseInt(NETWORK.chainId, 16)]: NETWORK.chainNodeProviderUrl
          }
          /*{
          version: 1,
          qrcodeModalOptions: {
            mobileLinks: ['metamask', 'trust', 'coinbase', 'argent']
          },
          rpc: {
            [parseInt(NETWORK.chainId, 16)]: NETWORK.chainNodeProviderUrl
          }
          }  */
        }
      }
    }

    const _web3Modal = new Web3Modal({
      network: NETWORK.chainName,
      cacheProvider: true,
      providerOptions
    })

    setWeb3Modal(_web3Modal)

    let web3Provider
    let accountAddress
    try {
      const connection = await _web3Modal.connect()
      web3Provider = new ethers.providers.Web3Provider(connection)
      if (!web3Provider) return

      const _wallets = await web3Provider.listAccounts()
      const _chainId = (await web3Provider.getNetwork()).chainId

      setWallets(_wallets)
      accountAddress = await web3Provider.getSigner().getAddress()
      setWalletAddress(accountAddress)

      const chainIdHex = decToHex(_chainId)
      setChainId(chainIdHex)
      setIsConnected(true)

      if (chainIdHex === NETWORK.chainId) {
        connectContracts(web3Provider.getSigner())
        setIsValidNetwork(true)
      } else {
        setIsValidNetwork(false)
        setWeb3Error('account_invalid_network')
        await switchOrCreateNetwork()
      }
      return [web3Provider, accountAddress]
    } catch (e) {
      console.error({ e })
    }
  }

  async function connectWallet() {
    try {
      if (window.ethereum !== undefined) {
        setWeb3Error('')
        await requestAccount()
      } else {
        setWeb3Error('account_no_metamask')
      }
    } catch (ex) {
      console.error(ex)
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

      gammaPacksContractInstance.on('PackTransfer', (from, to, tokenId) => {
        const packNbr = ethers.BigNumber.from(tokenId).toNumber()
        addNotification(to, 'notification_pack_transfer', [
          { item: 'PACK', value: packNbr, valueShort: packNbr },
          { item: 'WALLET', value: from, valueShort: getAccountAddressText(from) }
        ])
      })

      gammaCardsContractInstance.on('ExchangeCardOffer', (from, to, cNFrom, cNTo) => {
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

      setDaiContract(daiContractInstance)
      setAlphaContract(alphaContractInstance)
      setGammaPacksContract(gammaPacksContractInstance)
      setGammaCardsContract(gammaCardsContractInstance)
      setGammaOffersContract(gammaOffersContractInstance)
    } catch (e) {
      console.error({ e })
    }
  }

  async function disconnectWallet() {
    if (web3Modal) await web3Modal.clearCachedProvider()
    setWallets(null)
    setWalletAddress(null)
    setChainId(null)
    setIsValidNetwork(false)
    setIsConnected(false)
    setWeb3Error('')
  }

  function decToHex(number) {
    return `0x${parseInt(number).toString(16)}`
  }

  async function switchOrCreateNetwork() {
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
            console.error(e.message)
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
        if (accounts) {
          const address = accounts[0]
          setWalletAddress(address)
        }
      })

      window.ethereum.on('chainChanged', (newChain) => {
        setWeb3Error('account_invalid_network')
        const _chanIdHex = decToHex(newChain)
        setChainId(_chanIdHex)
        setIsValidNetwork(false)
        if (_chanIdHex === NETWORK.chainId) {
          const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
          const signer = provider.getSigner()
          connectContracts(signer)
          setIsValidNetwork(true)
        }
      })
    }
  }, [])

  const value = {
    chainId,
    wallets,
    walletAddress,
    daiContract,
    alphaContract,
    gammaPacksContract,
    gammaCardsContract,
    gammaOffersContract,
    web3Error,
    isConnected,
    isValidNetwork,
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
