import { useState, useEffect, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import daiAbi from './abis/TestDAI.v3.sol/NofTestDAIV3.json'
import alphaAbi from './abis/Alpha.v3.sol/NofAlphaV3.json'
import gammaPacksAbi from './abis/GammaPacks.v3.sol/NofGammaPacksV3.json'
import gammaCardsAbi from './abis/GammaCards.v5.sol/NofGammaCardsV5.json'
import gammaOffersAbi from './abis/GammaOffers.v4.sol/NofGammaOffersV4.json'
import { CONTRACTS, NETWORK } from '../config'
import { NotificationContext } from './NotificationContext'
import { getAccountAddressText } from '../utils/stringUtils'

const initialState = {
  connectWallet: () => {},
  disconnectWallet: () => {},
  isValidNetwork: () => {},
  switchOrCreateNetwork: () => {}
}

const Web3Context = createContext(initialState)

function Web3ContextProvider({ children }) {
  const [, setNoMetamaskError] = useState('')
  const [wallets] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [alphaContract, setAlphaContract] = useState(null)
  const [gammaPacksContract, setGammaPacksContract] = useState(null)
  const [gammaCardsContract, setGammaCardsContract] = useState(null)
  const [gammaOffersContract, setGammaOffersContract] = useState(null)
  const { addNotification } = useContext(NotificationContext)

  async function requestAccount() {
    const web3Modal = new Web3Modal()
    let web3Provider
    let accountAddress
    try {
      const connection = await web3Modal.connect()
      web3Provider = new ethers.providers.Web3Provider(connection)
      if (!web3Provider) return

      const chain = (await web3Provider.getNetwork()).chainId
      setChainId(decToHex(chain))
      switchOrCreateNetwork(
        NETWORK.chainId,
        NETWORK.chainName,
        NETWORK.ChainRpcUrl,
        NETWORK.chainCurrency,
        NETWORK.chainExplorerUrl
      )

      accountAddress = await web3Provider.getSigner().getAddress()
      setWalletAddress(accountAddress)
      connectContracts(web3Provider.getSigner())
      return [web3Provider, accountAddress]
    } catch (e) {
      console.error({ e })
    }
  }

  async function connectWallet() {
    try {
      if (window.ethereum !== undefined) {
        setNoMetamaskError('')
        await requestAccount()
      } else {
        setNoMetamaskError('Por favor instala Metamask para continuar.')
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

  function disconnectWallet() {
    setWalletAddress(null)
  }

  function isValidNetwork() {
    return chainId === NETWORK.chainId
  }

  function decToHex(number) {
    return `0x${parseInt(number).toString(16)}`
  }

  async function switchOrCreateNetwork(chainIdHex, chainName, rpcUrl, currency, explorer) {
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
  }

  useEffect(() => {
    if (window && typeof window.ethereum === 'undefined') {
      console.log('Please install metamask to use this website')
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
        setChainId(decToHex(newChain))
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
