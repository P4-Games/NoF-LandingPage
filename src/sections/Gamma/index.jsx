import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { ethers } from 'ethers'
import InfoCard from './InfoCard'
import Swal from 'sweetalert2'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import InventoryAlbum from './InventoryAlbum'
import GammaAlbum from './GammaAlbum'
import GammaPack from './GammaPack'
import { fetchPackData } from '../../services/backend/gamma'
import { checkPacksByUser, openPack, getPackPrice } from '../../services/contracts/gamma'
import { CONTRACTS } from '../../config'
import { showRules, closeRules } from '../../utils/rules'
import { checkApproved } from '../../services/contracts/dai'
import {useTranslation} from 'next-i18next'
import { useWeb3 } from '../../hooks'


const index = React.forwardRef(() => {
  const {t} = useTranslation()
  const [loading, setLoading] = useState(false)
  const [openPackCardsNumbers, setOpenPackCardsNumbers] = useState([])
  const [numberOfPacks, setNumberOfPacks] = useState('0')
  const [openPackage, setOpenPackage] = useState(false)
  const [cardInfo, setCardInfo] = useState(false)
  const [imageNumber, setImageNumber] = useState(0)
  const [mobile, setMobile] = useState(false)
  const [, setSize] = useState(false)
  const [inventory, setInventory] = useState(true)
  const [packIsOpen, setPackIsOpen] = useState(false)
  const [loaderPack, setLoaderPack] = useState(false)
  const { 
    account, daiContract, gammaCardsContract, 
    gammaPacksContract, noMetamaskError, connectToMetamask } = useWeb3()

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
      const numberOfPacks = await checkPacksByUser(account, gammaPacksContract)
      setNumberOfPacks(numberOfPacks?.length.toString() || '0')
    } catch (e) {
      console.error({ e })
    }
  }

  useEffect(() => {
    checkNumberOfPacks()
  }, [account, gammaPacksContract]) //eslint-disable-line react-hooks/exhaustive-deps

  const authorizeDaiContract = async () => {
    const authorization = await daiContract.approve(
      CONTRACTS.gammaPackAddress,
      ethers.constants.MaxUint256,
      { gasLimit: 2500000 }
    )
    await authorization.wait()
    return authorization
  }

  function emitError (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: 5000
    })
  }

  const handleTransferPack = async () => {  
    // TODO
  }

  const handleOpenPack = async () => {
    try {
      // llama al contrato para ver cantidad de sobres que tiene el usuario
      const packs = await checkPacksByUser(account, gammaPacksContract) // llamada al contrato
      setLoaderPack(true)

      if (packs.length == 0) {
        Swal.fire({
          title: '',
          text: t('no_paquetes_para_abrir'),
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
      }

      if (packs.length >= 1) {
        const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
        // llama a la api para recibir los numeros de cartas del sobre y la firma
        const data = await fetchPackData(account, packNumber)
        const { packet_data, signature } = data

        setOpenPackCardsNumbers(packet_data)
        // ssetPacksEnable(true)
        const openedPack = await openPack(gammaCardsContract, packNumber, packet_data, signature.signature)
        if (openedPack) {
          await openedPack.wait()
          setOpenPackage(true)
          setLoaderPack(false)
          await checkNumberOfPacks()
          return openedPack
        }
      }
      setLoaderPack(false)
    } catch (e) {
      setLoaderPack(false)
      emitError(t('open_pack_error'))
    }
  }

  const buyPackscontact = async (numberOfPacks) => {
    
    gammaPacksContract.on('PackPurchase', (returnValue, theEvent) => {
      console.log('evento PacksPurchase', returnValue)
      for (let i = 0; i < theEvent.length; i++) {
        const pack_number = ethers.BigNumber.from(theEvent[i]).toNumber()
      }
    })

    try {
      setLoading(true)
      const approval = await checkApproved(daiContract, account, gammaPacksContract.address)
      if (!approval) {
        await authorizeDaiContract()
      }
      const call = await gammaPacksContract.buyPacks(numberOfPacks, { gasLimit: 6000000 })
      await call.wait()
      await checkNumberOfPacks()
      setLoading(false)
      return call
    } catch (e) {
      setLoading(false)
      emitError(t('buy_pack_error'))
    }
  }

  const handleBuyPackClick = async () => {
    const price =  getPackPrice(gammaPacksContract)

    const result = await Swal.fire({
      text: `${t('buy_pack_title_1')} (${t('buy_pack_title_2')} ${price || '1'} DAI)`,
      input: 'number',
      inputAttributes: {
        min: 1,
        max: 10,
      },
      inputValidator: (value) => {
        if (value < 1 || value > 10) {
            return `${t('buy_pack_input_validator')}`
        }
      },
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `${t('buy_pack_button')}`,
      confirmButtonColor: '#005EA3',
      color: 'black',
      background: 'white',
      customClass: {
        image: 'cardalertimg',
        input: 'alertinput'
      }
    })

    if (result.isConfirmed) {
      const packsToBuy = result.value
      await buyPackscontact(packsToBuy)
    }
  }

  return (
    <>
      {!account && <div className='alpha'>
        {loading && (<div className= 'loader_container'>
          <span className='loader' />
        </div>)}
        <div className='main_buttons_container'>
          <button
            className='alpha_button alpha_main_button'
            id='connect_metamask_button'
            onClick={() => connectToMetamask()}>{t('connect_metamask')}
          </button>
          <button
            className='alpha_button alpha_main_button'
            id='show_rules_button'
            onClick={() => showRules('gamma')}
          >
            {t('reglas')}
          </button>
          <span>{noMetamaskError}</span>
        </div>

        <div className='gamma_rules_container'>
          <button
            className='gamma_rules_img_close alpha_modal_close'
            onClick={() => closeRules('gamma')}
          >
            X
          </button>

          <div className='gamma_rules_text_content'>
            <div className='gamma_rules_title'>
              <p>{t('reglas')}</p>
            </div>
            <div className='gamma_rules_text_left'>
              <p>{t('rules_gamma_left_text_1')}</p>
              <p>{t('rules_gamma_left_text_2')}</p>
              <p>{t('rules_gamma_left_text_3')}</p>
              <p>{t('rules_gamma_left_text_4')}</p>
            </div>
            <div className='gamma_rules_text_right'>
              <p>{t('rules_gamma_right_text_1')}</p>
              <p>{t('rules_gamma_right_text_2')}</p>
              <p>{t('rules_gamma_right_text_3')}</p>
              <p>{t('rules_gamma_right_text_4')}</p>
            </div>
          </div>
        </div>

      </div>
      }

      <Navbar
        account={account}
        cardInfo={cardInfo}
        setCardInfo={setCardInfo}
        inventory={inventory}
        setInventory={setInventory}
        handleBuyPackClick={handleBuyPackClick}
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
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className='hero__top'>
          {!mobile && inventory && <img alt='albums' src='/gamma/albums.png' onClick={() => setInventory(false)} className='gammaAlbums' />}
          {!mobile && !inventory && <div onClick={() => setInventory(false)} className='gammaAlbums2' />}
          <div style={inventory ? { backgroundImage: 'url(\'/gamma/InventarioFondo.png\')' } : { backgroundImage: 'url(\'/gamma/GammaFondo.png\')' }} className='hero__top__album'>
            {inventory && !cardInfo && gammaCardsContract && <InventoryAlbum
              setImageNumber={setImageNumber}
              setCardInfo={setCardInfo}
              cardInfo={cardInfo}/>}
            {!inventory && <GammaAlbum />}
            {inventory && cardInfo && gammaCardsContract && <InfoCard imageNumber={imageNumber} setLoading={setLoading} />}
          </div>
          {/* {!mobile && packsEnable && <div onClick={() => { setPackIsOpen(true), fetchPackData() }} className="gammaFigures">Buy Pack</div>}
          {!mobile && !packsEnable && <div onClick={() => { setPackIsOpen(true), buypack() }} className="gammaFigures"><h2>Buy Pack</h2></div>} */}
          {!mobile && inventory &&
            <div className='gammaShop'>
              <h1>{numberOfPacks}</h1>
              <div 
                onClick={() => { setPackIsOpen(true), handleOpenPack() }} 
                className={numberOfPacks==='0' ? 'openPack_disabled' : 'openPack'}>
                <h3>{t('abrir')}</h3>
              </div>
              <div
                onClick={() => { handleTransferPack() }}
                className={numberOfPacks==='0' ? 'transferPack_disabled' : 'transferPack'}>
                <h3>{t('transferir')}</h3>
              </div>
            </div>}

          {!mobile && !inventory &&
            <div className='gammaComplete'>
              <h3>{t('album')}</h3>
              <h3>24/120</h3>
              <h3>{t('completar')}</h3>
            </div>}
        </div>
      </div>}
      <Footer />
    </>
  )
})

export default index
