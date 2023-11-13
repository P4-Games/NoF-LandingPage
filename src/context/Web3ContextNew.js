import PropTypes from 'prop-types'
import { createContext, useState, useEffect, useCallback } from 'react'
import Onboard from '@web3-onboard/core'
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import { ethers, providers } from 'ethers'

import daiAbi from './abis/TestDAI.v2.sol/NofTestDAIV2.json'
import alphaAbi from './abis/Alpha.v2.sol/NofAlphaV2.json'
import gammaPacksAbi from './abis/GammaPacks.v2.sol/NofGammaPacksV2.json'
import gammaCardsAbi from './abis/GammaCards.v2.sol/NofGammaCardsV2.json'
import { CONTRACTS, NETWORK } from '../config'

const NODE_PROVIDER_URL = 'https://polygon-mumbai.g.alchemy.com/v2/'
const NODE_PROVIDER_KEY='6Ge-klr1O_0kD4ZUSAFffyC7QNNEOJZJ'
const NETWORK_ID = '0x539'
export const ENV_SUPPORTED_NETWORK_ID = parseInt(NETWORK_ID, 10)
export const SUPPORTED_NETWORKS = {
  1337: {
    id: 1337,
    token: 'ETH',
    label: 'localhost',
    publicRpcUrl: 'http://localhost:8545',
    rpcUrl: `${NODE_PROVIDER_URL}${NODE_PROVIDER_URL.endsWith('/') ? '' : '/'}${NODE_PROVIDER_KEY}`,
    blockExplorerUrl: 'http://localhost:8080',
  },
  137: {
    id: 137,
    token: 'MATIC',
    label: 'Polygon Mainnet',
    publicRpcUrl: 'https://polygon-rpc.com',
    rpcUrl: `${NODE_PROVIDER_URL}${NODE_PROVIDER_URL.endsWith('/') ? '' : '/'}${NODE_PROVIDER_KEY}`,
    blockExplorerUrl: 'https://polygonscan.com',
  },
  80001: {
    id: 80001,
    token: 'MATIC',
    label: 'Polygon testnet',
    publicRpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    rpcUrl: `${NODE_PROVIDER_URL}${NODE_PROVIDER_URL.endsWith('/') ? '' : '/'}${NODE_PROVIDER_KEY}`,
  }
}
export const ENV_SUPPORTED_NETWORK = SUPPORTED_NETWORKS[ENV_SUPPORTED_NETWORK_ID]

const initialState = {
  connectWallet: () => {}
}

const Web3Context = createContext(initialState)


const Web3ContextProvider = ({ children }) => {
  const [web3Onboard, setWeb3Onboard] = useState(null)
  const [noMetamaskError, setNoMetamaskError] = useState('')
  const [wallets, setWallets] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [alphaContract, setAlphaContract] = useState(null)
  const [gammaPacksContract, setGammaPacksContract] = useState(null)
  const [gammaCardsContract, setGammaCardsContract] = useState(null)

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

      setDaiContract(daiContractInstance)
      setAlphaContract(alphaContractInstance)
      setGammaPacksContract(gammaPacksContractInstance)
      setGammaCardsContract(gammaCardsContractInstance)

      console.log('gamma contract', gammaCardsContractInstance)
    } catch (e) {
      console.error({ e })
    }
  }

  const initWeb3Onboard = useCallback(async () => {
    const MAINNET_RPC_URL = 'https://polygon-mumbai.g.alchemy.com/v2/6Ge-klr1O_0kD4ZUSAFffyC7QNNEOJZJ'
    const injected = injectedModule({
      filter: {
        // allow only on non android mobile
        [ProviderLabel.Detected]: ['Android', 'desktop', 'macOS', 'iOS'],
        displayUnavailable: true
      }
    })

    const onboard = Onboard({
      wallets: [injected],
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
          id: '0x13881',
          token: 'MATIC',
          label: 'Mumbai',
          rpcUrl: MAINNET_RPC_URL,
        }
      ],
      appMetadata: {
        name: 'NoF',
        description: 'Number one Fun',
        // icon,
        recommendedInjectedWallets: [{ name: 'MetaMask', url: 'https://metamask.io' }]
      }
    })

    setWeb3Onboard(onboard)

  }, [])

  useEffect(() => {
    initWeb3Onboard()
  }, [initWeb3Onboard])

  const getProvider = (wlt) => {
    if (!wlt)
      return new ethers.providers.JsonRpcProvider(
        SUPPORTED_NETWORKS[ENV_SUPPORTED_NETWORK_ID].rpcUrl,
        ENV_SUPPORTED_NETWORK_ID
      )
    return new providers.Web3Provider(wlt.provider, 'any')
  }
  
  /*
  const connectWallet = useCallback(async () => {
    setNoMetamaskError('')
    const wallets = await web3Onboard.connectWallet()
    setWallets(wallets)
    setWalletAddress(wallets[0].accounts[0].address)
    const provider = getProvider(wallets[0])
    const signer = provider.getSigner()
    connectContracts(signer)
  }, [web3Onboard])
  */

  const connectWallet = () => {
    setNoMetamaskError('')
    const wallets = web3Onboard.connectWallet()
      .then((wallets) => {
        setWallets(wallets)
        setWalletAddress(wallets[0].accounts[0].address)
        const provider = getProvider(wallets[0])
        const signer = provider.getSigner()
        connectContracts(signer)
      })
      .catch((e) => {
        console.error({ e })
      })
  }

  const disconnectWallet = useCallback(() => {
    if (web3Onboard) {
      web3Onboard.walletReset()
      setWalletAddress(null)
    }
  }, [web3Onboard])

  const value = {
    web3Onboard,
    noMetamaskError,
    wallets,
    walletAddress,
    daiContract,
    alphaContract,
    gammaPacksContract,
    gammaCardsContract,
    connectWallet,
    disconnectWallet
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

Web3ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { Web3ContextProvider, Web3Context }
