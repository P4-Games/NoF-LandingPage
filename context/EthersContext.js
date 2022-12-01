import { useContext, useState, useEffect, createContext } from 'react'
import { ethers } from 'ethers'
import router from 'next/router'
import Web3Modal from 'web3modal'
import nofAbi from '../artifacts/contracts/NOF-SC.sol/NOF_Alpha'
import daiAbi from "../artifacts/contracts/TestDAI.sol/Dai.json"

const EthersContext = createContext()

export function useEthers () {
  return useContext(EthersContext)
}

export default function EthersProvider ({ children }) {
  const [contract, setContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [prov, setProv] = useState(null)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [notificationStatus, setNotificationStatus] = useState({ show: false, error: false })
  const validChainId = '0x13881' // Polygon testnet "Mumbai" (800001)
  

  async function requestAccount () {
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

    const chainName = 'Mumbai'
    const rpcUrl = 'https://rpc-mumbai.maticvigil.com'
    const currency = 'MATIC'
    const explorer = 'https://mumbai.polygonscan.com/'
    switchOrCreateNetwork(validChainId, chainName, rpcUrl, currency, explorer)
    return provider
  }

  function connectContracts (provider) {
    try {
      const contractAddress = "0x4868445F626c775869C5b241635466d3a46c31A7" // test contract MUMBAI
      const daiAddress = '0xF995C0BB2f4F2138ba7d78F2cFA7D3E23ce05615' // test dai
      const signer = provider.getSigner()
      let nofContract = new ethers.Contract(contractAddress, nofAbi.abi, signer)
      let daiContractInstance = new ethers.Contract(daiAddress, daiAbi.abi, signer)
      setContract(nofContract)
      setDaiContract(daiContractInstance)
      return [nofContract, daiContractInstance]
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
        notificationStatus,
        setNotificationStatus,
        contract,
        connectContracts,
        // daiContract,
        // connectDai
      }}
    >
      {children}
    </EthersContext.Provider>
  )
}
