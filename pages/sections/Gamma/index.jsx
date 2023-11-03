import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import InventoryAlbum from './InventoryAlbum'
import GammaAlbum from './GammaAlbum'
import GammaPack from './GammaPack'
import { ethers } from 'ethers'
import gammaPacksAbi from '../../../artifacts/contracts/GammaPacks.sol/GammaPacks.json'
import gammaCardsAbi from '../../../artifacts/contracts/GammaCardsV2.sol/GammaCardsV2.json'
import daiAbi from '../../../artifacts/contracts/TestDAI.sol/UChildDAI.json'
import Web3Modal from 'web3modal'
import InfoCard from './InfoCard'
import { fetchPackData } from '../../../services/backend/gamma'
import { checkPacksByUser, openPack } from '../../../services/contracts/gamma'
import { CONTRACTS, NETWORK } from '../../../config'


const index = React.forwardRef(() => {
  // const [packsEnable, setPacksEnable] = useState(false)
  const [account, setAccount] = useState(null)
  const [noMetamaskError, setNoMetamaskError] = useState('')
  const [, setChainId] = useState(null)
  const [packsContract, setPacksContract] = useState(null)
  const [cardsContract, setCardsContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [loading, setLoading] = useState(null)
  const [openPackCardsNumbers, setOpenPackCardsNumbers] = useState([])
  const [numberOfPacks, setNumberOfPacks] = useState('0')
  const [openPackage, setOpenPackage] = useState(false)

  const authorizeDaiContract = async () => {
    const authorization = await daiContract.approve(
      CONTRACTS.gammaPackAddress,
      ethers.constants.MaxUint256,
      { gasLimit: 2500000 }
    )
    setLoading(true)
    await authorization.wait()
    setLoading(false)
    return authorization
  }

  const checkApproved = async (approvedAddress, tokenOwner) => {
    const approved = await daiContract.allowance(tokenOwner, approvedAddress)
    return approved.gt(0)
  }

  const [mobile, setMobile] = useState(false)
  const [, setSize] = useState(false)

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

  const checkNumberOfPacks = async () => {
    try {
      const numberOfPacks = await checkPacksByUser(account, packsContract)
      setNumberOfPacks(numberOfPacks?.length.toString())
    } catch (e) {
      console.error({ e })
    }
  }

  useEffect(() => {
    checkNumberOfPacks()
  }, [account, packsContract]) //eslint-disable-line react-hooks/exhaustive-deps

  const [inventory, setInventory] = useState(true)
  const [packIsOpen, setPackIsOpen] = useState(false)

  async function requestAccount () {
    const web3Modal = new Web3Modal()
    let provider
    let address
    try {
      const connection = await web3Modal.connect()
      provider = new ethers.providers.Web3Provider(connection)
      address = await provider.getSigner().getAddress()
      setAccount(address)
    } catch (e) {
      console.error({ e })
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
    );
    return [provider, address]
  }

  function connectToMetamask () {
    if (window.ethereum !== undefined) {
      setNoMetamaskError('')
      requestAccount().then((data) => {
        const [provider] = data
        const signer = provider.getSigner()
        const gammaPacksContractInstance = new ethers.Contract(
          CONTRACTS.gammaPackAddress,
          gammaPacksAbi.abi,
          signer
        )
        setPacksContract(gammaPacksContractInstance)
        const gammaCardsContractInstance = new ethers.Contract(
          CONTRACTS.gammaCardsAddress,
          gammaCardsAbi.abi,
          signer
        )
        setCardsContract(gammaCardsContractInstance)
        const daiContractInstance = new ethers.Contract(
          CONTRACTS.daiAddress,
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
      window.ethereum.on('accountsChanged', () => {
        connectToMetamask()
      })

      window.ethereum.on('chainChanged', newChain => {
        setChainId(decToHex(newChain))
        connectToMetamask()
      })
    }
  }, []) //eslint-disable-line react-hooks/exhaustive-deps
  const [loaderPack, setLoaderPack] = useState(false)

  // funcion para abrir uno a uno los sobres disponibles
  const openAvailablePack = async () => {
    try {
      // llama al contrato para ver cantidad de sobres que tiene el usuario
      const packs = await checkPacksByUser(account, packsContract) // llamada al contrato
      setLoaderPack(true)

      if (packs.length == 0) {
        // setPacksEnable(false)
        alert('No tienes paquetes para abrir!')
      }

      if (packs.length >= 1) {
        const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
        // llama a la api para recibir los numeros de cartas del sobre y la firma
        const data = await fetchPackData(account, packNumber) // llamada al back
        const { packet_data, signature } = data

        setOpenPackCardsNumbers(packet_data)
        // ssetPacksEnable(true)
        // llama al contrato de cartas para abrir el sobre
        const openedPack = await openPack(cardsContract, packNumber, packet_data, signature.signature)
        if (openedPack) {
          await openedPack.wait()
          setOpenPackage(true)
          setLoaderPack(false)
          await checkNumberOfPacks()
          return openedPack
        } else {
          setLoaderPack(false)
        }
      }
    } catch (e) {
      console.error({ e })
    }
  }

  const [cardInfo, setCardInfo] = useState(false)
  const [imageNumber, setImageNumber] = useState(0)

  useEffect(() => {
    const loadingElem = document.getElementById('loading')
    loading
      ? loadingElem?.setAttribute('class', 'alpha_loader_container')
      : loadingElem?.setAttribute(
        'class',
        'alpha_loader_container alpha_display_none'
      )
  }, [loading])

  const showRules = () => {
    // TBC
  }
  
  return (
    <>
      {!account && <div className='alpha'>
        <div className='alpha_loader_container alpha_display_none' id='loading'>
          <span className='loader' />
        </div>
        <div className='alpha_main_buttons_container'>
          <button className='alpha_button alpha_main_button' id='connect_metamask_button' onClick={() => connectToMetamask()}>Conectar con Metamask</button>
          <button className='alpha_button alpha_main_button' id='show_rules_button' onClick={() => showRules()}>Reglas</button>
          <span>{noMetamaskError}</span>
        </div>
        {/* <div className="alpha_rules_container">
          <button className="alpha_rules_img_close alpha_modal_close" onClick={() => closeRules()}>X</button>
          <img alt='img' className="alpha_rules_img" src={reglas.src} tabIndex="0" />
        </div> */}
      </div>}

      <Navbar
        account={account}
        cardInfo={cardInfo}
        setCardInfo={setCardInfo}
        inventory={inventory}
        setInventory={setInventory}
        packsContract={packsContract}
        checkApproved={checkApproved}
        authorizeDaiContract={authorizeDaiContract}
        checkNumberOfPacks={checkNumberOfPacks}
      />

      {account && <div className='gamma_main'>
        {packIsOpen && <GammaPack
          loaderPack={loaderPack}
          setPackIsOpen={setPackIsOpen}
          cardsNumbers={openPackCardsNumbers}
          setOpenPackage={setOpenPackage}
          openPackage={openPackage}
                       />}
        <Head>
          <title>Number One Fan</title>
          <meta name='description' content='NoF Gamma' />
          <link rel='icon' href='./favicon.ico' />
        </Head>
        <div className='hero__top'>
          {!mobile && inventory && <img alt='albums' src='assets/gamma/albums.png' onClick={() => setInventory(false)} className='gammaAlbums' />}
          {!mobile && !inventory && <div onClick={() => setInventory(false)} className='gammaAlbums2' />}
          <div style={inventory ? { backgroundImage: 'url(\'assets/gamma/InventarioFondo.png\')' } : { backgroundImage: 'url(\'assets/gamma/GammaFondo.png\')' }} className='hero__top__album'>
            {inventory && !cardInfo && <InventoryAlbum
              account={account}
              cardsContract={cardsContract}
              setImageNumber={setImageNumber}
              setCardInfo={setCardInfo}
              cardInfo={cardInfo}
                                       />}
            {!inventory && <GammaAlbum />}
            {inventory && cardInfo && <InfoCard imageNumber={imageNumber} cardsContract={cardsContract} setLoading={setLoading} />}
          </div>
          {/* {!mobile && packsEnable && <div onClick={() => { setPackIsOpen(true), fetchPackData() }} className="gammaFigures">Buy Pack</div>}
          {!mobile && !packsEnable && <div onClick={() => { setPackIsOpen(true), buypack() }} className="gammaFigures"><h2>Buy Pack</h2></div>} */}
          {!mobile && inventory &&
            <div onClick={() => { setPackIsOpen(true), openAvailablePack() }} className='gammaShop'>
              <h1>{numberOfPacks || ''}</h1>
              <div className='album'>
                {/* <h2>{numberOfPacks}</h2> */}
                <h3>TRANSFER</h3>
              </div>
            </div>}

          {!mobile && !inventory &&
            <div className='gammaComplete'>
              <h3>Album</h3>
              <h3>24/120</h3>
              <h3>Completar</h3>
            </div>}
        </div>
      </div>}
      <Footer />
    </>
  )
})

export default index
