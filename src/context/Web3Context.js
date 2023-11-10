import PropTypes from 'prop-types'
import { useState, useEffect, createContext } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import daiAbi from './abis/TestDAI.v2.sol/NofTestDAIV2.json'
import alphaAbi from './abis/Alpha.v2.sol/NofAlphaV2.json'
import gammaPacksAbi from './abis/GammaPacks.v2.sol/NofGammaPacksV2.json'
import gammaCardsAbi from './abis/GammaCards.v2.sol/NofGammaCardsV2.json'
import { CONTRACTS, NETWORK } from '../config'

const initialState = {
  connectToMetamask: () => {},
  switchOrCreateNetwork: () => {}
}

const Web3Context = createContext(initialState)

EthersProvider.propTypes = {
  children: PropTypes.node.isRequired
}

function EthersProvider({ children }) {
  const [noMetamaskError, setNoMetamaskError] = useState('')
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [signer, setSigner] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [alphaContract, setAlphaContract] = useState(null)
  const [gammaPacksContract, setGammaPacksContract] = useState(null)
  const [gammaCardsContract, setGammaCardsContract ] = useState(null)


  async function requestAccount() {
    const web3Modal = new Web3Modal()
    let web3Provider
    let accountAddress
    try {
        const connection = await web3Modal.connect()
        web3Provider = new ethers.providers.Web3Provider(connection)
        accountAddress = await web3Provider.getSigner().getAddress()
        setAccount(accountAddress)
        setProvider(web3Provider)
        setSigner(web3Provider.getSigner())
    } catch (e) {
        console.error({ e })
    }

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
    return [web3Provider, accountAddress]
  }


  function connectToMetamask () {
    try {
      if (window.ethereum !== undefined) {
        setNoMetamaskError('')

        requestAccount().then((data) => {
          const [provider] = data
          const signer = provider.getSigner()
          connectContracts(signer)
        })
          .catch(e => {
            console.error({ e })
          })
      } else {
        setNoMetamaskError('Por favor instala Metamask para continuar.')
      }
    } catch (ex) {
      console.error(ex)
    }
  }

  function connectContracts(_signer) {
    try {
      const daiContractInstance = new ethers.Contract(
        CONTRACTS.daiAddress,
        daiAbi.abi,
        _signer
      )

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

    } catch (e) {
      console.error({ e })
    }
  }

  function logout() {
    setAccount(null)
  }

  function isValidChain() {
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
          console.log(e.message)
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
          setAccount(address)
        }
      })

      window.ethereum.on('chainChanged', (newChain) => {
        setChainId(decToHex(newChain))
        // connectToMetamask()
      })
    }

    /*
    window.ethereum.on('accountsChanged', (accounts) => {
      const address = accounts[0]
      setAccount(address)
    })

    window.ethereum.on('chainChanged', (newChain) => {
      setChainId(decToHex(newChain))
    })
    */
  }, [])

  return (
    <Web3Context.Provider
      value={{
        noMetamaskError,
        account,
        requestAccount,
        logout,
        chainId,
        setChainId,
        isValidChain,
        daiContract,
        alphaContract,
        gammaPacksContract,
        gammaCardsContract,
        switchOrCreateNetwork,
        connectToMetamask,
        connectContracts
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export { EthersProvider, Web3Context }
