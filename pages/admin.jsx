import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import gammaPacksAbi from '../artifacts/contracts/GammaPacks.sol/GammaPacks.json'
import gammaCardsAbi from '../artifacts/contracts/GammaCardsV2.sol/GammaCardsV2.json'
import daiAbi from '../artifacts/contracts/TestDAI.sol/UChildDAI.json'
import Web3Modal from 'web3modal'
import { CONTRACTS, NETWORK, adminAccounts } from '../config'

const index = React.forwardRef((props, book) => {
  const production = true
  const localhost = true
  const [account, setAccount] = useState(null)
  const [noMetamaskError, setNoMetamaskError] = useState('')
  const [chainId, setChainId] = useState(null)
  const [packsContract, setPacksContract] = useState(null)
  const [cardsContract, setCardsContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [loading, setLoading] = useState(null)

  const [mobile, setMobile] = useState(false)
  const [size, setSize] = useState(false)
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true)
      setSize(true)
    } else {
      setMobile(false)
      setSize(false)
    }
    const updateMedia = () => {
      if (window.innerWidth < 600) {
        setMobile(true)
        setSize(true)
      } else {
        setMobile(false)
        setSize(false)
      }
    }
    window.addEventListener('resize', updateMedia)
    return () => window.removeEventListener('resize', updateMedia)
  }, [])
  const images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    async function requestAccount() {
        const web3Modal = new Web3Modal();
        let provider;
        let address;
        try {
            const connection = await web3Modal.connect();
            provider = new ethers.providers.Web3Provider(connection);
            address = await provider.getSigner().getAddress();
            setAccount(address);
        } catch (e) {
            console.error({ e });
        }

        if (!provider) return;
        const chain = (await provider.getNetwork()).chainId;
        setChainId(decToHex(chain));

        switchOrCreateNetwork(
          NETWORK.chainId,
          NETWORK.chainName,
          NETWORK.ChainRpcUrl,
          NETWORK.chainCurrency,
          NETWORK.chainExplorerUrl
        );
        return [provider, address];
    }
    

  function connectToMetamask () {
    if (window.ethereum !== undefined) {
      setNoMetamaskError('')
      requestAccount().then((data) => {
        const [provider, address] = data
        const signer = provider.getSigner()
        const gammaPacksContractInstance = new ethers.Contract(
          CONTRACTS.gammaPackAddressV2,
          gammaPacksAbi.abi,
          signer
        )
        setPacksContract(gammaPacksContractInstance)
        const gammaCardsContractInstance = new ethers.Contract(
          CONTRACTS.gammaCardsAddressV2,
          gammaCardsAbi.abi,
          signer
        )
        setCardsContract(gammaCardsContractInstance)
        const daiContractInstance = new ethers.Contract(
          CONTRACTS.daiAddressV2,
          daiAbi.abi,
          signer
        )
        setDaiContract(daiContractInstance)
      })
        .catch(e => {
          console.error({ e })
        })
    } else {
      setNoMetamaskError('Por favor instala Metamask para continuar.')
    }
  }

  function decToHex (number) {
    return `0x${parseInt(number).toString(16)}`
  }

  async function switchOrCreateNetwork (
    chainIdHex,
    chainName,
    rpcUrl,
    currency,
    explorer
  ) {
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
    if (window && window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', (accounts) => {
        connectToMetamask()
      })

      window.ethereum.on('chainChanged', newChain => {
        setChainId(decToHex(newChain))
        connectToMetamask()
      })
    }
  }, [])

  const adminAccess = () => {
    return adminAccounts.includes(account)
  }

  const showRules = () => {
    // TBC
  }

  return (
    <>
      <div className='admincontainer'>
        {!account && <div className='alpha_main_buttons_container'>
          <button className='alpha_button alpha_main_button' id='connect_metamask_button' onClick={() => connectToMetamask()}>Conectar con Metamask</button>
          <button className='alpha_button alpha_main_button' id='show_rules_button' onClick={() => showRules()}>Reglas</button>
          <span>{noMetamaskError}</span>
        </div>}
        {adminAccess() &&
          <div className='adminpanel' />}
      </div>
    </>
  )
})

export default index
