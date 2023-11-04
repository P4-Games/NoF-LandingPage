import { useContext, useState, useEffect, createContext } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import daiAbi from './abis/TestDAI.sol/UChildDAI.json'
import alphaAbi from './abis//NOF-SC.sol/NOF_Alpha.json'
import gammaPacksAbi from './abis/GammaPacks.sol/GammaPacks.json'
import gammaCardsAbi from './abis/GammaCardsV2.sol/GammaCardsV2.json'
import { CONTRACTS, NETWORK } from '../config'

const EthersContext = createContext(null)

export function useEthers() {
  return useContext(EthersContext)
}

export default function EthersProvider({ children }) {
  const [alphaContract, setAlphaContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [gammaPacksContract] = useState(null)
  const [gammaCardsContract] = useState(null)
  const [, setProv] = useState(null)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)

  async function requestAccount() {
    const web3Modal = new Web3Modal()
    let provider
    try {
      const connection = await web3Modal.connect()
      provider = new ethers.providers.Web3Provider(connection)
      setProv(provider)
      const address = await provider.getSigner().getAddress()
      setAccount(address)
    } catch (e) {
      console.log('requestAccount error:', e)
    }

    if (!provider) return
    const chain = (await provider.getNetwork()).chainId
    setChainId(decToHex(chain))

    switchOrCreateNetwork(
      NETWORK.chainId,
      NETWORK.chainName,
      NETWORK.ChainRpcUrl,
      NETWORK.chainCurrency,
      NETWORK.chainExplorerUrl
    )
    return provider
  }

  function connectContracts(provider) {
    try {
      const signer = provider.getSigner()
      const daiContractInstance = new ethers.Contract(CONTRACTS.daiAddress, daiAbi.abi, signer)
      const alphaContractInstance = new ethers.Contract(
        CONTRACTS.alphaAddress,
        alphaAbi.abi,
        signer
      )
      const gammaPacksContractInstance = new ethers.Contract(
        CONTRACTS.gammaPackAddress,
        gammaPacksAbi.abi,
        signer
      )
      const gammaCardsContractInstance = new ethers.Contract(
        CONTRACTS.gammaCardsAddress,
        gammaCardsAbi.abi,
        signer
      )

      setAlphaContract(alphaContractInstance)
      setDaiContract(daiContractInstance)
      setAlphaContract(alphaContractInstance)
      setDaiContract(daiContractInstance)

      return [
        daiContractInstance,
        alphaContractInstance,
        gammaPacksContractInstance,
        gammaCardsContractInstance,
      ]
    } catch (e) {
      console.log({ e })
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
        params: [{ chainId: chainIdHex }],
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
                  decimals: 18,
                },
                blockExplorerUrls: [explorer],
              },
            ],
          })
        } catch (e) {
          console.log(e.message)
        }
      }
    }
  }

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install metamask to use this website')
      return
    }

    window.ethereum.on('accountsChanged', (accounts) => {
      const address = accounts[0]
      setAccount(address)
    })

    window.ethereum.on('chainChanged', (newChain) => {
      setChainId(decToHex(newChain))
    })
  }, [])

  return (
    <EthersContext.Provider
      value={{
        account,
        requestAccount,
        logout,
        chainId,
        setChainId,
        isValidChain,
        connectContracts,
        daiContract,
        alphaContract,
        gammaPacksContract,
        gammaCardsContract,
      }}
    >
      {children}
    </EthersContext.Provider>
  )
}
