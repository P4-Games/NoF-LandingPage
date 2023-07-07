import { useContext, useState, useEffect, createContext } from 'react'
import { ethers } from 'ethers'
// import router from 'next/router'
import Web3Modal from 'web3modal'

import daiAbi from "../artifacts/contracts/TestDAI.sol/UChildDAI.json"
import alphaAbi from "../artifacts/contracts/NOF-SC.sol/NOF_Alpha.json"
import gammaPacksAbi from "../artifacts/contracts/GammaPacks.sol/GammaPacks.json"
import gammaCardsAbi from "../artifacts/contracts/GammaCardsV2.sol/GammaCardsV2.json"

const EthersContext = createContext(null)

export function useEthers () {
  return useContext(EthersContext);
}

export default function EthersProvider ({ children }) {
  const [alphaContract, setAlphaContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [gammaPacksContract, setGammaPacksContract] = useState(null)
  const [gammaCardsContract, setGammaCardsContract] = useState(null)
  const [prov, setProv] = useState(null)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const validChainId = '0x13881' // Polygon testnet "Mumbai" (800001)
  

  async function requestAccount () {
    const web3Modal = new Web3Modal()
    let provider
    let address
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

    const chainName = 'Mumbai'
    const rpcUrl = 'https://rpc-mumbai.maticvigil.com'
    const currency = 'MATIC'
    const explorer = 'https://mumbai.polygonscan.com/'
    switchOrCreateNetwork(validChainId, chainName, rpcUrl, currency, explorer)
    return provider
  }

  function connectContracts (provider) {
    try {
      const alphaAddress = "0x4868445F626c775869C5b241635466d3a46c31A7" // test contract MUMBAI
      const daiAddress = "0xF995C0BB2f4F2138ba7d78F2cFA7D3E23ce05615" // test dai
      const gammaPacksAddress = "0xDe30a1B73031ccB456967BE9f103DaF23A006d1b"
      const gammaCardsAddress = "0xEefF8D035A60AC3E1456991C2A2C2dEb31C84B76"
      
      const signer = provider.getSigner()
      
      let daiContractInstance = new ethers.Contract(daiAddress, daiAbi.abi, signer)
      let alphaContractInstance = new ethers.Contract(alphaAddress, alphaAbi.abi, signer)
      let gammaPacksContractInstance = new ethers.Contract(gammaPacksAddress, gammaPacksAbi.abi, signer)
      let gammaCardsContractInstance = new ethers.Contract(gammaCardsAddress, gammaCardsAbi.abi, signer)
      
      setAlphaContract(alphaContractInstance)
      setDaiContract(daiContractInstance)
      setAlphaContract(alphaContractInstance)
      setDaiContract(daiContractInstance)
      
      return [daiContractInstance, alphaContractInstance, gammaPacksContractInstance, gammaCardsContractInstance]
    } catch (e) {
      console.log({ e })
    }
  }

  function logout () {
    setAccount(null)
  }

  function isValidChain () {
    return chainId === validChainId
  }

  function decToHex (number) {
    return `0x${parseInt(number).toString(16)}`
  }

  async function switchOrCreateNetwork (chainIdHex, chainName, rpcUrl, currency, explorer) {
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
                chainName: chainName,
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
    if (typeof window.ethereum === 'undefined') {
      console.log('Please install metamask to use this website')
      return
    }

    // if (router.pathname != '/') {
    //   requestAccount()
    // }

    window.ethereum.on('accountsChanged', (accounts) => {
      const address = accounts[0]
      setAccount(address)
    })

    window.ethereum.on('chainChanged', newChain => {
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
        gammaCardsContract
      }}
    >
      {children}
    </EthersContext.Provider>
  )
}
