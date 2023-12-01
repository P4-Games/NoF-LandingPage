import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ethers } from 'ethers'
import Swal from 'sweetalert2'
import { useTranslation } from 'next-i18next'

import { emitError, emitInfo, emitSuccess, emitWarning } from '../../utils/alert'
import Rules from '../Common/Rules'
import GammaAlbum from './GammaAlbum'
import GammaPackOpen from './GammaPackOpen'
import { checkApproved } from '../../services/dai'
import { fetchPackData } from '../../services/gamma'
import {
  getCardsByUser,
  checkPacksByUser,
  finishAlbum,
  openPack,
  getPackPrice
} from '../../services/gamma'

import { CONTRACTS } from '../../config'
import { useWeb3Context } from '../../hooks'
import { useLayoutContext } from '../../hooks'
import { checkInputAddress } from '../../utils/InputValidators'

const GammaMain = () => {
  const { t } = useTranslation()
  const [openPackCardsNumbers, setOpenPackCardsNumbers] = useState([])
  const [numberOfPacks, setNumberOfPacks] = useState(0)
  const [openPackage, setOpenPackage] = useState(false)
  const [inventory, setInventory] = useState(true)
  const [packIsOpen, setPackIsOpen] = useState(false)
  const {
    walletAddress,
    daiContract,
    gammaCardsContract,
    gammaPacksContract,
    noMetamaskError,
    connectWallet
  } = useWeb3Context()
  const {
    startLoading,
    stopLoading,
    ToggleShowDefaultButtons,
    updateShowButtons,
    updateButtonFunctions,
    updateFooterButtonsClasses
  } = useLayoutContext()
  const [paginationObj, setPaginationObj] = useState({})
  const [cardsQtty, setCardsQtty] = useState(0)
  const [showRules, setShowRules] = useState(false)
  const [cardInfoOpened, setCardInfoOpened] = useState(false)

  const getCardsQtty = (paginationObj) => {
    let total = 0

    if (!paginationObj) return
    for (let key in paginationObj.user) {
      if (paginationObj.user[key].quantity > 0) {
        total += 1
      }
    }

    return total
  }

  const checkNumberOfPacks = async () => {
    try {
      const result = await checkPacksByUser(walletAddress, gammaPacksContract)
      setNumberOfPacks(result?.length || 0)
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
    if (walletAddress && !cardInfoOpened) {
      ToggleShowDefaultButtons(false)

      if (inventory) {
        updateShowButtons([true, true, true, true])
        updateFooterButtonsClasses([
          'footer__buttons__bluebtn_custom_switch_inventory',
          'footer__buttons__greenbtn_custom_shop',
          'footer__buttons__redbtn_custom_open',
          'footer__buttons__yellowbtn_custom_transfer'
        ])
      } else {
        updateShowButtons([true, true, false, false])
        updateFooterButtonsClasses([
          'footer__buttons__bluebtn_custom_switch_album',
          'footer__buttons__greenbtn_custom_claim',
          null,
          null
        ])
      }

      updateButtonFunctions(0, handleSwitchBook)
    }
  }, [walletAddress, gammaPacksContract, inventory, cardInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (walletAddress && !cardInfoOpened) {
      if (inventory) updateButtonFunctions(1, handleBuyPack)
      else updateButtonFunctions(1, handleFinishAlbum)
    }
  }, [walletAddress, gammaPacksContract, inventory, cardInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (walletAddress && inventory && !cardInfoOpened) {
      updateButtonFunctions(2, handleOpenPack)
    }
  }, [
    walletAddress,
    gammaPacksContract,
    openPackage, //eslint-disable-line react-hooks/exhaustive-deps
    packIsOpen,
    cardsQtty,
    numberOfPacks,
    inventory,
    cardInfoOpened
  ])

  useEffect(() => {
    if (walletAddress && inventory) {
      updateButtonFunctions(3, handleTransferPack)
    }
  }, [walletAddress, gammaPacksContract, numberOfPacks, inventory, cardInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!paginationObj) return
    setCardsQtty(getCardsQtty(paginationObj))
  }, [paginationObj])

  useEffect(() => {
    fetchInventory()
  }, [walletAddress, gammaCardsContract]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    checkNumberOfPacks()
  }, [walletAddress, gammaPacksContract]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleFinishAlbum = useCallback(async () => {
    try {
      if (cardsQtty < 120) {
        emitInfo(t('finish_album_no_qtty'))
        return
      }

      startLoading()
      const result = await finishAlbum(gammaCardsContract, daiContract, walletAddress)
      if (result) {
        await updateUserData()
        emitSuccess(t('finish_album_success'))
      } else {
        emitWarning(t('finish_album_warning'), 8000, '', false)
      }
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('finish_album_error'))
    }
  }, [walletAddress, gammaPacksContract, inventory, cardInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleTransferPack = useCallback(async () => {
    try {
      if (numberOfPacks === 0) {
        emitInfo(t('no_paquetes_para_transferir', 2000))
        return
      }

      const result = await Swal.fire({
        text: `${t('wallet_destinatario')}`,
        input: 'text',
        inputAttributes: {
          min: 43,
          max: 43
        },
        inputValidator: (value) => {
          if (!checkInputAddress(value, walletAddress)) return `${t('direccion_destino_error')}`
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
        emitSuccess(t('confirmado'), 2000)
        await checkNumberOfPacks()
        stopLoading()
      }
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('transfer_pack_error'))
    }
  }, [walletAddress, gammaPacksContract, numberOfPacks, inventory, cardInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenPack = useCallback(async () => {
    try {
      if (numberOfPacks === 0) {
        emitInfo(t('no_paquetes_para_abrir', 2000))
        return
      }
      startLoading()

      // llama al contrato para ver cantidad de sobres que tiene el usuario
      const packs = await checkPacksByUser(walletAddress, gammaPacksContract) // llamada al contrato

      setPackIsOpen(true)
      const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
      // llama a la api para recibir los numeros de cartas del sobre y la firma
      const data = await fetchPackData(walletAddress, packNumber)
      const { packet_data, signature } = data

      // verify signer
      // const signer = await verifyPackSigner(gammaCardsContract, packNumber, packet_data, signature.signature)
      // console.log('pack signer', signer)

      setOpenPackCardsNumbers(packet_data)
      const openedPack = await openPack(
        gammaCardsContract,
        packNumber,
        packet_data,
        signature.signature
      )

      if (openedPack) {
        stopLoading()
        setOpenPackage(true)
        await checkNumberOfPacks()
        await updateUserData()
      }
      stopLoading()
    } catch (e) {
      stopLoading()
      emitError(t('open_pack_error'))
    }
  }, [
    walletAddress,
    gammaPacksContract,
    openPackage, //eslint-disable-line react-hooks/exhaustive-deps
    packIsOpen,
    cardsQtty,
    numberOfPacks,
    inventory,
    cardInfoOpened
  ])

  const buyPacksContract = async (numberOfPacks) => {
    /*
    gammaPacksContract.on('PackPurchase', (returnValue, theEvent) => {
      // console.log('evento PacksPurchase', returnValue)
      for (let i = 0; i < theEvent.length; i++) {
        const pack_number = ethers.BigNumber.from(theEvent[i]).toNumber()
        // console.log(pack_number)
      }
    })
    */

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
      console.error({ e })
      emitError(t('buy_pack_error'))
    }
  }

  const connectWallet1 = async () => {
    await connectWallet()
  }

  const handleSwitchBook = useCallback(async () => {
    setCardInfoOpened(false)
    setInventory(!inventory)
  }, [inventory])

  const handleBuyPack = useCallback(async () => {
    const price = await getPackPrice(gammaPacksContract)

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
  }, [walletAddress, gammaPacksContract, inventory, cardInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  const NotConnected = () => (
    <div className='alpha'>
      <div className='main_buttons_container'>
        <button
          className='alpha_button alpha_main_button'
          id='connect_wallet_button'
          onClick={() => connectWallet1()}
        >
          {t('connect_wallet')}
        </button>
        <button
          className='alpha_button alpha_main_button'
          id='show_rules_button'
          onClick={() => setShowRules(true)}
        >
          {t('reglas')}
        </button>
        <span>{noMetamaskError}</span>
      </div>
    </div>
  )

  const GammaPackInfo = () => {
    if (inventory) {
      return (
        <>
          <div className='gammapack'>
            {numberOfPacks === 0 || cardInfoOpened ? (
              <>
                <div className={'gammapack__content__disabled'}>
                  <h1 className={'pack_number_disabled'}>{numberOfPacks}</h1>
                </div>
              </>
            ) : (
              <>
                <div className={'gammapack__content'}>
                  <h1 className={'pack_number'}>{numberOfPacks}</h1>
                </div>
              </>
            )}
            <div className='gammapack__actions'>
              {numberOfPacks === 0 || cardInfoOpened ? (
                <>
                  {cardInfoOpened ? (
                    <div className={'gammapack__actions__buyPack_disabled'}>
                      <Image
                        src={'/images/gamma/buyPackOff.png'}
                        alt='buy pack'
                        height='40'
                        width='40'
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        handleBuyPack()
                      }}
                      className={'gammapack__actions__buyPack'}
                    >
                      <Image
                        src={'/images/gamma/buyPackOn.png'}
                        alt='buy pack'
                        height='40'
                        width='40'
                      />
                    </div>
                  )}
                  <div className='gammapack__actions__openPack_disabled'>
                    <Image
                      src={'/images/gamma/openPackOff.png'}
                      alt='open pack'
                      height='50'
                      width='50'
                    />
                  </div>
                  <div className='gammapack__actions__transferPack_disabled'>
                    <Image
                      src={'/images/gamma/transferPackOff.png'}
                      alt='open pack'
                      height='40'
                      width='40'
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => {
                      handleBuyPack()
                    }}
                    className={'gammapack__actions__buyPack'}
                  >
                    <Image
                      src={'/images/gamma/buyPackOn.png'}
                      alt='buy pack'
                      height='40'
                      width='40'
                    />
                  </div>
                  <div
                    onClick={() => {
                      handleOpenPack()
                    }}
                    className='gammapack__actions__openPack'
                  >
                    <Image
                      src={'/images/gamma/openPackOn.png'}
                      alt='open pack'
                      height='50'
                      width='50'
                    />
                  </div>
                  <div
                    onClick={() => {
                      handleTransferPack()
                    }}
                    className='gammapack__actions__openPack'
                  >
                    <Image
                      src={'/images/gamma/transferPackOn.png'}
                      alt='open pack'
                      height='40'
                      width='40'
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )
    }

    if (!inventory && cardsQtty >= 0) {
      return (
        <div className='gammaComplete'>
          <div className={cardsQtty >= 120 ? 'qtty_complete' : 'qtty_incomplete'}>
            <h3>{`${cardsQtty}/120`}</h3>
          </div>
          <div className={cardsQtty >= 120 ? 'title_complete' : 'title_incomplete'}>
            <h3>{cardsQtty === 120 ? `(${t('completo')})` : `(${t('incompleto')})`}</h3>
          </div>
          {cardsQtty >= 120 && (
            <div
              onClick={() => {
                handleFinishAlbum()
              }}
              className={cardsQtty >= 120 ? 'completeAlbum' : 'completeAlbum_disabled'}
            >
              <h3>{t('reclamar_premio')}</h3>
            </div>
          )}
        </div>
      )
    }

    return <></>
  }

  const BookImageLeft = () => (
    <div
      onClick={() => {
        handleSwitchBook()
      }}
      className={
        cardInfoOpened
          ? inventory
            ? 'gammaAlbums-disabled'
            : 'gammaAlbums2-disabled'
          : inventory
          ? 'gammaAlbums'
          : 'gammaAlbums2'
      }
    />
  )

  return (
    <div className='gamma_main'>
      {!walletAddress && <NotConnected />}

      {showRules && <Rules type='gamma' setShowRules={setShowRules} />}

      {walletAddress && packIsOpen && (
        <GammaPackOpen
          setPackIsOpen={setPackIsOpen}
          cardsNumbers={openPackCardsNumbers}
          setOpenPackage={setOpenPackage}
          openPackage={openPackage}
        />
      )}

      {walletAddress && <BookImageLeft />}

      {walletAddress && (
        <GammaAlbum
          showInventory={inventory}
          updateUserData={updateUserData}
          setCardInfoOpened={setCardInfoOpened}
          paginationObj={paginationObj}
        />
      )}

      {walletAddress && <GammaPackInfo />}
    </div>
  )
}

export default GammaMain
