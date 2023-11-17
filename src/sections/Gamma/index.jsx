import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import GammaInfoCard from './GammaInfoCard'
import Swal from 'sweetalert2'
import {useTranslation} from 'next-i18next'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import GammaAlbum from './GammaAlbum'
import GammaPack from './GammaPack'
import { checkApproved } from '../../services/dai'
import { fetchPackData } from '../../services/gamma'
import { 
  getCardsByUser, checkPacksByUser, finishAlbum,
  verifyPackSigner, openPack, getPackPrice } from '../../services/gamma'
import { CONTRACTS } from '../../config'
import { showRules, closeRules } from '../../utils/rules'
import { useWeb3Context } from '../../hooks'
import { useLayoutContext } from '../../hooks'
import { checkInputAddress } from '../../utils/addresses'

const index = React.forwardRef(() => {
  const {t} = useTranslation()
  const [openPackCardsNumbers, setOpenPackCardsNumbers] = useState([])
  const [numberOfPacks, setNumberOfPacks] = useState('0')
  const [openPackage, setOpenPackage] = useState(false)
  const [cardInfo, setCardInfo] = useState(false)
  const [imageNumber, setImageNumber] = useState(0)
  const [inventory, setInventory] = useState(true)
  const [packIsOpen, setPackIsOpen] = useState(false)
  const [loaderPack, setLoaderPack] = useState(false)
  const { 
    walletAddress, daiContract, gammaCardsContract, 
    gammaPacksContract, noMetamaskError, connectWallet } = useWeb3Context()

  const { mobile, startLoading, stopLoading } = useLayoutContext()
  const [paginationObj, setPaginationObj] = useState({})
    const [cardsQtty, setCardsQtty] = useState(0)

  const getCardsQtty = (paginationObj) => {
    let total = 0

    if(!paginationObj) return
    for (let key in paginationObj.user) {
      if (paginationObj.user[key].quantity > 0) {
        total += 1;
      }
    }
  
    return total;
  }

  const checkNumberOfPacks = async () => {
    try {
      const numberOfPacks = await checkPacksByUser(walletAddress, gammaPacksContract)
      setNumberOfPacks(numberOfPacks?.length.toString() || '0')
    } catch (e) {
      console.error({ e })
    }
  }

  const authorizeDaiContract = async () => {
    const authorization = await daiContract.approve(
      CONTRACTS.gammaPackAddress,
      ethers.constants.MaxUint256,
      { gasLimit: 2500000 }
    )
    await authorization.wait()
    return authorization
  }

  const updateUserData = async () => {
    const userCards = await getCardsByUser(gammaCardsContract, walletAddress)
    setPaginationObj(userCards)
    setCardsQtty(getCardsQtty(userCards))
  }

  const fetchInventory = async () => {
    try {
      startLoading()
      const userCards = await getCardsByUser(gammaCardsContract, walletAddress)
      setPaginationObj(userCards)
      stopLoading()
    } catch (error) {
      stopLoading()
      console.error(error)
    }
  }
     
  useEffect(() => {
    if (!paginationObj) return
    setCardsQtty(getCardsQtty(paginationObj))
  }, [paginationObj]) 
  
  useEffect(() => {
    fetchInventory()
  }, [walletAddress, gammaCardsContract]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    checkNumberOfPacks()
  }, [walletAddress, gammaPacksContract]) // eslint-disable-line react-hooks/exhaustive-deps

  function emitError (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: 5000
    })
  }

  const handleFinishAlbum = async () => {  
    try {
      startLoading()
      const result = await finishAlbum(gammaCardsContract, walletAddress)
      if (result) {
        await updateUserData()
        Swal.fire({
          title: '',
          text: t('finish_album_success'),
          icon: 'success',
          showConfirmButton: false,
          timer: 5000
        })
        
      } else {
        Swal.fire({
          title: '',
          text: t('finish_album_warning'),
          icon: 'warning',
          showConfirmButton: false,
          timer: 8000
        })
      }
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('finish_album_error'))
    }
  }

  const handleTransferPack = async () => {  
    try {
      const result = await Swal.fire({
        text: `${t('wallet_destinatario')}`,
        input: 'text',
        inputAttributes: {
          min: 43,
          max: 43
        },
        inputValidator: (value) => {
          if (!checkInputAddress(value, walletAddress))
            return `${t('direccion_destino_error')}`
        },
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('trasnferir')}`,
        confirmButtonColor: '#005EA3',
        color: 'black',
        background: 'white',
        customClass: {
          image: 'cardalertimg',
          input: 'alertinput'
        }
      })

      if (result.isConfirmed) {

        startLoading()

        const packs = await checkPacksByUser(walletAddress, gammaPacksContract)
        const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
        const transaction = await gammaPacksContract.transferPack(result.value, packNumber)
        await transaction.wait()
        transaction.wait()
        Swal.fire({
          title: '',
          text: t('confirmado'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
        await checkNumberOfPacks()
        stopLoading()
      }
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('transfer_pack_error'))
    }
  }

  const handleOpenPack = async () => {
    try {
      // llama al contrato para ver cantidad de sobres que tiene el usuario
      const packs = await checkPacksByUser(walletAddress, gammaPacksContract) // llamada al contrato
      setLoaderPack(true)

      if (packs.length == 0) {
        Swal.fire({
          title: '',
          text: t('no_paquetes_para_abrir'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
      }

      if (packs.length >= 1) {
        const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
        // llama a la api para recibir los numeros de cartas del sobre y la firma
        const data = await fetchPackData(walletAddress, packNumber)
        const { packet_data, signature } = data

        // verify signer
        const signer = await verifyPackSigner(gammaCardsContract, packNumber, packet_data, signature.signature)
        console.log('pack signer', signer)

        setOpenPackCardsNumbers(packet_data)
        const openedPack = await openPack(gammaCardsContract, packNumber, packet_data, signature.signature)
        
        if (openedPack) {
          setOpenPackage(true)
          setLoaderPack(false)
          await checkNumberOfPacks()
          await updateUserData()
          return openedPack
        }
      }
      setLoaderPack(false)
    } catch (e) {
      setLoaderPack(false)
      emitError(t('open_pack_error'))
    }
  }

  const buyPacksContract = async (numberOfPacks) => {
    
    gammaPacksContract.on('PackPurchase', (returnValue, theEvent) => {
      console.log('evento PacksPurchase', returnValue)
      for (let i = 0; i < theEvent.length; i++) {
        const pack_number = ethers.BigNumber.from(theEvent[i]).toNumber()
        console.log(pack_number)
      }
    })

    try {
      startLoading()
      const approval = await checkApproved(daiContract, walletAddress, gammaPacksContract.address)
      if (!approval) {
        await authorizeDaiContract()
      }
      const call = await gammaPacksContract.buyPacks(numberOfPacks, { gasLimit: 6000000 })
      await call.wait()
      await checkNumberOfPacks()
      stopLoading()
      return call
    } catch (e) {
      stopLoading()
      emitError(t('buy_pack_error'))
    }
  }

  const connectWallet1 = async () => {
    await connectWallet()
  }

  const handleBuyPackClick = async () => {
    const price =  getPackPrice(gammaPacksContract)

    const result = await Swal.fire({
      text: `${t('buy_pack_title_1')} (${t('buy_pack_title_2')} ${price || '1'} DAI)`,
      input: 'number',
      inputAttributes: {
        min: 1,
        max: 10
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
      await buyPacksContract(packsToBuy)
    }
  }

  const handleFinishInfoCard = async () => {
    setCardInfo(false)
    await updateUserData()
  }

  const NotConnected = () => (
    <div className='alpha'>
      <div className='main_buttons_container'>
        <button
          className='alpha_button alpha_main_button'
          id='connect_wallet_button'
          onClick={() => connectWallet1()}>{t('connect_wallet')}
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
  )

  return (
    <>
      <Navbar
        walletAddress={walletAddress}
        cardInfo={cardInfo}
        setCardInfo={setCardInfo}
        inventory={inventory}
        setInventory={setInventory}
        handleBuyPackClick={handleBuyPackClick}
      />

     {!walletAddress && <NotConnected />}

      {walletAddress && <div className='gamma_main'>
        {packIsOpen && <GammaPack
          loaderPack={loaderPack}
          setPackIsOpen={setPackIsOpen}
          cardsNumbers={openPackCardsNumbers}
          setOpenPackage={setOpenPackage}
          openPackage={openPackage}
        />}
        <div className='hero__top'>
          {!mobile &&
            <div 
              onClick={() => setInventory(!inventory)}
              className= {inventory ? 'gammaAlbums' : 'gammaAlbums2'}
            />
          }

          <div
            style={inventory 
              ? { backgroundImage: 'url(\'/images/gamma/InventarioFondo.png\')' }
              : { backgroundImage: 'url(\'/images/gamma/GammaFondo.png\')' }}
            className='hero__top__album'
          >
            {!inventory && 
            <GammaAlbum
              showInventory={false}
              paginationObj={paginationObj}
              setImageNumber={setImageNumber}
              setCardInfo={setCardInfo}/>
            /*
              <GammaAlbumStatistics
                paginationObj={paginationObj}
              />
            */}
            {inventory && !cardInfo &&
            <GammaAlbum
              showInventory={true}
              paginationObj={paginationObj}
              setImageNumber={setImageNumber}
              setCardInfo={setCardInfo}/>
            }
            {inventory && cardInfo &&
              <GammaInfoCard 
                imageNumber={imageNumber} 
                handleFinishInfoCard={handleFinishInfoCard}
              />
            }
          </div>

          {!mobile && inventory &&          
            <div className='gammapack'>
              <div className=''>
                  <h1
                    className={numberOfPacks==='0' ? 'pack_number_disabled' : 'pack_number'}
                    onClick={() => { setPackIsOpen(true), handleOpenPack() }} >
                    {numberOfPacks}
                  </h1>
              </div>
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
            </div>
          }

          {!mobile && !inventory && cardsQtty >= 0 &&
            <div className='gammaComplete'>
              <div className={cardsQtty===120 ? 'title_complete' : 'title_incomplete'}>
                <h3>
                    {cardsQtty === 120 
                      ? `${t('album')} ${t('completo')}`
                      : `${t('album')} ${t('incompleto')}`
                    } 
                </h3>
              </div>
              <div className={cardsQtty===120 ? 'qtty_complete' : 'qtty_incomplete'}>
                <h3>{`${cardsQtty}/120`}</h3>
              </div>
              {cardsQtty===120 && <div
                onClick={() => { handleFinishAlbum() }}
                className={cardsQtty===120 ? 'completeAlbum' : 'completeAlbum_disabled'}>
                <h3>{t('reclamar_premio')}</h3>
              </div>}
            </div>}
        </div>
      </div>}
      <Footer />
    </>
  )
})

export default index
