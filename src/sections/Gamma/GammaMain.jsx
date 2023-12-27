import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ethers } from 'ethers'
import Swal from 'sweetalert2'
import { useTranslation } from 'next-i18next'

import { emitError, emitInfo, emitSuccess, emitWarning } from '../../utils/alert'
import { checkInputAddress, checkIntValue1GTValue2 } from '../../utils/InputValidators'

import Rules from '../Common/Rules'
import GammaAlbum from './GammaAlbum'
import GammaPackOpen from './GammaPackOpen'
import { checkApproved, authorizeDaiContract } from '../../services/dai'
import { fetchPackData, burnCards } from '../../services/gamma'
import {
  checkPacksByUser,
  finishAlbum,
  openPack,
  openPacks,
  getMaxPacksAllowedToOpenAtOnce,
  getPackPrice
} from '../../services/gamma'
import { NETWORK } from '../../config'
import { useWeb3Context, useLayoutContext, useGammaDataContext } from '../../hooks'

const GammaMain = () => {
  const { t } = useTranslation()
  const [openPackCardsNumbers, setOpenPackCardsNumbers] = useState([])
  const [numberOfPacks, setNumberOfPacks] = useState(0)
  const [openPackage, setOpenPackage] = useState(false)
  const [packIsOpen, setPackIsOpen] = useState(false)
  const {
    ALBUMS,
    currentAlbum,
    switchAlbum,
    paginationObj,
    getRepeatedCardsQtty,
    refreshPaginationObj,
    getUniqueCardsQtty,
    getAlbums120Qtty,
    getAlbums60Qtty,
    cardsQttyToBurn,
    cardsToBurn,
    setCardsToBurn,
    setCardsQttyToBurn
  } = useGammaDataContext()
  const {
    walletAddress,
    daiContract,
    gammaCardsContract,
    gammaPacksContract,
    connectWallet,
    isConnected,
    isValidNetwork
  } = useWeb3Context()
  const {
    startLoading,
    stopLoading,
    ToggleShowDefaultButtons,
    updateShowButtons,
    updateButtonFunctions,
    updateFooterButtonsClasses
  } = useLayoutContext()
  const [uniqueCardsQtty, setUniqueCardsQtty] = useState(0)
  const [repeatedCardsQtty, setRepeatedCardsQtty] = useState(0)
  const [albums120Qtty, setAlbums120Qtty] = useState(0)
  const [albums60Qtty, setAlbums60Qtty] = useState(0)
  const [showRules, setShowRules] = useState(false)
  const [cardInfoOpened, setCardInfoOpened] = useState(false)
  const [albumInfoOpened, setAlbumInfoOpened] = useState(false)

  const canCompleteAlbum120 = () => uniqueCardsQtty >= 120 && albums120Qtty > 0

  const checkNumberOfPacks = async () => {
    try {
      const result = await checkPacksByUser(walletAddress, gammaPacksContract)
      setNumberOfPacks(result?.length || 0)
    } catch (e) {
      console.error({ e })
    }
  }

  const updateUserData = async () => {
    await refreshPaginationObj()
    setAlbums120Qtty(getAlbums120Qtty())
    setAlbums60Qtty(getAlbums60Qtty())
    setUniqueCardsQtty(getUniqueCardsQtty())
    setRepeatedCardsQtty(getRepeatedCardsQtty())
  }

  const fetchInventory = async () => {
    try {
      if (!walletAddress) return
      startLoading()
      await updateUserData()
      stopLoading()
    } catch (error) {
      stopLoading()
      console.error(error)
    }
  }

  useEffect(() => {
    if (!gammaCardsContract || !gammaPacksContract || !walletAddress) return
    gammaCardsContract.on('OfferCardsExchanged', (from, to) => {
      if (
        to.toUpperCase() === walletAddress.toUpperCase() ||
        from.toUpperCase() === walletAddress.toUpperCase()
      ) {
        updateUserData()
      }
    })
    gammaCardsContract.on('CardTransfered', (from, to) => {
      if (
        to.toUpperCase() === walletAddress.toUpperCase() ||
        from.toUpperCase() === walletAddress.toUpperCase()
      ) {
        updateUserData()
      }
    })
    gammaPacksContract.on('PacksTransfered', (from, to) => {
      if (
        to.toUpperCase() === walletAddress.toUpperCase() ||
        from.toUpperCase() === walletAddress.toUpperCase()
      ) {
        checkNumberOfPacks()
      }
    })
  }, [gammaCardsContract, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setUniqueCardsQtty(getUniqueCardsQtty())
    setAlbums120Qtty(getAlbums120Qtty())
    setAlbums60Qtty(getAlbums60Qtty())
    setRepeatedCardsQtty(getRepeatedCardsQtty())
  }, [paginationObj]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchInventory()
  }, [walletAddress, gammaCardsContract]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!walletAddress) return
    checkNumberOfPacks()
  }, [walletAddress, gammaPacksContract]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      if (walletAddress && !cardInfoOpened && !albumInfoOpened) {
        ToggleShowDefaultButtons(false)

        switch (currentAlbum) {
          case ALBUMS.ALBUM_INVENTORY:
            updateShowButtons([true, true, true, true])
            updateFooterButtonsClasses([
              'footer__buttons__bluebtn_custom_switch_album',
              'footer__buttons__greenbtn_custom_shop',
              'footer__buttons__redbtn_custom_open',
              'footer__buttons__yellowbtn_custom_transfer'
            ])
            break
          case ALBUMS.ALBUM_120:
            updateShowButtons([true, true, false, false])
            updateFooterButtonsClasses([
              'footer__buttons__bluebtn_custom_switch_inventory',
              'footer__buttons__greenbtn_custom_claim',
              null,
              null
            ])
            break
          case ALBUMS.ALBUM_BURN_SELECTION:
            updateShowButtons([true, false, false, false])
            updateFooterButtonsClasses([null, null, null, null])
            break
          case ALBUMS.ALBUM_TO_BURN:
            updateShowButtons([true, true, true, false])
            updateFooterButtonsClasses([null, null, null, null])
            break
        }

        updateButtonFunctions(0, handleSwitchBook)
      }
    },
    // prettier-ignore
    [ //eslint-disable-line react-hooks/exhaustive-deps
    walletAddress,
    gammaPacksContract,
    cardInfoOpened,
    albumInfoOpened,
    currentAlbum
  ]
  )

  useEffect(
    () => {
      if (walletAddress && !cardInfoOpened && !albumInfoOpened) {
        if (currentAlbum === ALBUMS.ALBUM_INVENTORY) {
          updateButtonFunctions(1, handleBuyPack)
        } else if (currentAlbum === ALBUMS.ALBUM_TO_BURN) {
          updateButtonFunctions(1, handleBurnCards)
        } else if (currentAlbum === ALBUMS.ALBUM_120) {
          updateButtonFunctions(1, handleFinishAlbum)
        }
      }
    },
    // prettier-ignore
    [ //eslint-disable-line react-hooks/exhaustive-deps
    walletAddress, 
    gammaPacksContract,
    cardInfoOpened,
    albumInfoOpened,
    currentAlbum
  ]
  )

  useEffect(
    () => {
      if (walletAddress && !cardInfoOpened && !albumInfoOpened) {
        if (currentAlbum === ALBUMS.ALBUM_INVENTORY) {
          updateButtonFunctions(2, handleOpenPack)
        } else if (currentAlbum === ALBUMS.ALBUM_BURN_SELECTION) {
          updateButtonFunctions(2, handleCancelBurning)
        }
      }
    },
    // prettier-ignore
    [ // eslint-disable-line react-hooks/exhaustive-deps
      walletAddress,
      gammaPacksContract,
      openPackage,
      packIsOpen,
      uniqueCardsQtty,
      numberOfPacks,
      cardInfoOpened,
      albumInfoOpened,
      currentAlbum
    ]
  )

  useEffect(
    () => {
      if (walletAddress && currentAlbum === ALBUMS.ALBUM_INVENTORY) {
        updateButtonFunctions(3, handleTransferPack)
      }
    },
    // prettier-ignore
    [ //eslint-disable-line react-hooks/exhaustive-deps
    walletAddress,
    gammaPacksContract,
    numberOfPacks,
    currentAlbum,
    cardInfoOpened,
    albumInfoOpened
  ]
  )

  const handleFinishAlbum = useCallback(
    async () => {
      try {
        if (uniqueCardsQtty < 120) {
          emitInfo(t('finish_album_no_qtty'), 100000)
          return
        }

        if (albums120Qtty < 1) {
          emitInfo(t('finish_album_no_album'), 100000)
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
    },
    // prettier-ignore
    [ //eslint-disable-line react-hooks/exhaustive-deps
    walletAddress,
    gammaPacksContract,
    paginationObj,
    cardInfoOpened,
    albumInfoOpened,
    uniqueCardsQtty,
    albums120Qtty
  ]
  )

  const handleTransferPack = useCallback(async () => {
    try {
      if (numberOfPacks === 0) {
        emitInfo(t('no_paquetes_para_transferir', 2000))
        return
      }

      const result = await Swal.fire({
        title: `${t('transfer_pack_title')}`,
        html: `
        <input id="wallet" class="swal2-input" placeholder="${t('wallet_destinatario')}">
        <input id="amount" type='number' step='1' class="swal2-input" placeholder="${t(
          'quantity'
        )}">
        `,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('transferir')}`,
        confirmButtonColor: '#005EA3',
        color: 'black',
        background: 'white',
        customClass: {
          image: 'cardalertimg',
          input: 'alertinput'
        },
        preConfirm: () => {
          const walletInput = Swal.getPopup().querySelector('#wallet')
          const quantityInput = Swal.getPopup().querySelector('#amount')
          const wallet = walletInput.value
          const amount = parseInt(quantityInput.value)

          if (
            !checkInputAddress(wallet, walletAddress) &&
            !checkIntValue1GTValue2(amount, numberOfPacks, true)
          ) {
            walletInput.classList.add('swal2-inputerror')
            quantityInput.classList.add('swal2-inputerror')
            Swal.showValidationMessage(
              `${t('direccion_destino_error')}<br />${t('quantity_invalid')}`
            )
          } else {
            if (!checkInputAddress(wallet, walletAddress)) {
              walletInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('direccion_destino_error')}`)
            }
            if (!checkIntValue1GTValue2(amount, numberOfPacks, true)) {
              quantityInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('quantity_invalid')}`)
            }
          }
          return { wallet: wallet, amount: amount }
        }
      })

      if (result.isConfirmed) {
        startLoading()
        const qttyPacks = parseInt(result.value.amount)
        const packs = await checkPacksByUser(walletAddress, gammaPacksContract)

        if (qttyPacks === 1) {
          const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
          const transaction = await gammaPacksContract.transferPack(result.value.wallet, packNumber)
          await transaction.wait()
        } else {
          let packsNumber = []
          for (let index = 0; index < qttyPacks; index++) {
            packsNumber.push(ethers.BigNumber.from(packs[index]).toNumber())
          }
          if (packsNumber.length > 0) {
            const transaction = await gammaPacksContract.transferPacks(
              result.value.wallet,
              packsNumber
            )
            await transaction.wait()
          }
        }
        emitSuccess(t('confirmado'), 2000)
        await checkNumberOfPacks()
        stopLoading()
      }
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('transfer_pack_error'))
    }
  }, [
    walletAddress,
    gammaPacksContract,
    numberOfPacks,
    currentAlbum,
    cardInfoOpened,
    albumInfoOpened
  ]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenPack = useCallback(
    async () => {
      try {
        if (numberOfPacks === 0) {
          emitInfo(t('no_paquetes_para_abrir', 2000))
          return
        }

        startLoading()

        const packs = await checkPacksByUser(walletAddress, gammaPacksContract)
        let openedPack = false

        if (numberOfPacks === 1) {
          setPackIsOpen(true)

          const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
          const data = await fetchPackData(walletAddress, packNumber)
          const { packet_data, signature } = data

          setOpenPackCardsNumbers(packet_data)
          openedPack = await openPack(
            gammaCardsContract,
            packNumber,
            packet_data,
            signature.signature
          )
        } else {
          const maxQttyAllowed = await getMaxPacksAllowedToOpenAtOnce(gammaCardsContract)
          const maxQttyPacksUser = numberOfPacks > maxQttyAllowed ? maxQttyAllowed : numberOfPacks
          const msg = `${t('open_pack_input_validator').replace('{MAX}', maxQttyPacksUser)}`
          stopLoading()

          const result = await Swal.fire({
            title: `${t('open_pack_title')}`,
            input: 'number',
            inputValue: 1,
            inputPlaceholder: `${t('quantity')}`,
            inputAttributes: {
              min: 1,
              max: maxQttyPacksUser,
              step: 1
            },
            inputValidator: (value) => {
              if (value < 1 || value > maxQttyPacksUser) {
                return msg
              }
            },
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `${t('open')}`,
            confirmButtonColor: '#005EA3',
            color: 'black',
            background: 'white',
            customClass: {
              image: 'cardalertimg',
              input: 'alertinput gamma_validators_centered_input'
            }
          })

          if (!result.isConfirmed) {
            return
          }

          startLoading()
          setPackIsOpen(true)

          let packsNumber = []
          let packsData = []
          let signatures = []
          let packsCardsNumbers = []
          const qttyPacksToOpen = result.value

          for (let index = 0; index < qttyPacksToOpen; index++) {
            const packNumber = ethers.BigNumber.from(packs[index]).toNumber()
            const data = await fetchPackData(walletAddress, packNumber)
            const { packet_data, signature } = data

            packsNumber.push(packNumber)
            packsData.push(packet_data)
            signatures.push(signature.signature)
            packsCardsNumbers = packsCardsNumbers.concat(packet_data)
          }
          setOpenPackCardsNumbers(packsCardsNumbers)
          openedPack = await openPacks(
            gammaCardsContract,
            qttyPacksToOpen,
            packsNumber,
            packsData,
            signatures
          )
        }

        if (openedPack) {
          setOpenPackage(true)
          stopLoading()
          await checkNumberOfPacks()
          await updateUserData()
        }

        stopLoading()
      } catch (e) {
        stopLoading()
        emitError(t('open_pack_error'))
      }
    },
    // prettier-ignore
    [ // eslint-disable-line react-hooks/exhaustive-deps
    walletAddress,
    gammaPacksContract,
    openPackage,
    packIsOpen,
    uniqueCardsQtty,
    numberOfPacks,
    currentAlbum,
    cardInfoOpened,
    albumInfoOpened
  ]
  )

  const buyPacksContract = async (numberOfPacks) => {
    try {
      startLoading()

      const amountRequired = await gammaPacksContract.getAmountRequiredToBuyPacks(numberOfPacks)
      const amountRequiredFormatted = parseFloat(ethers.utils.formatUnits(amountRequired, 18))

      const userBalanceToken = await daiContract.balanceOf(walletAddress)
      const userBalanceTokenFormatted = parseFloat(ethers.utils.formatUnits(userBalanceToken, 18))

      if (userBalanceTokenFormatted < amountRequiredFormatted) {
        stopLoading()
        emitWarning(t('buy_pack_warning'))
        return
      }

      const meetQttyConditionsToBuy =
        await gammaPacksContract.meetQuantityConditionsToBuy(numberOfPacks)
      if (!meetQttyConditionsToBuy) {
        stopLoading()
        emitWarning(t('buy_pack_qtty_warning'))
        return
      }

      const approval = await checkApproved(
        daiContract,
        walletAddress,
        gammaPacksContract.address,
        amountRequired
      )
      if (!approval) {
        await authorizeDaiContract(daiContract, gammaPacksContract.address, amountRequired)
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

  const handleSwitchBook = useCallback(async () => {
    setCardInfoOpened(false)
    setAlbumInfoOpened(false)

    switch (currentAlbum) {
      case ALBUMS.ALBUM_INVENTORY:
        switchAlbum(ALBUMS.ALBUM_120)
        break
      case ALBUMS.ALBUM_120:
        switchAlbum(ALBUMS.ALBUM_INVENTORY)
        break
      case ALBUMS.ALBUM_BURN_SELECTION:
        switchAlbum(ALBUMS.ALBUM_TO_BURN)
        break
      case ALBUMS.ALBUM_TO_BURN:
        switchAlbum(ALBUMS.ALBUM_BURN_SELECTION)
        break
    }
  }, [currentAlbum])

  const handleBuyPack = useCallback(async () => {
    const price = await getPackPrice(gammaPacksContract)

    const result = await Swal.fire({
      text: `${t('buy_pack_title_1')} (${t('buy_pack_title_2')} ${price || '1'} DAI)`,
      input: 'number',
      inputValue: 1,
      inputPlaceholder: `${t('quantity')}`,
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
        input: 'alertinput gamma_validators_centered_input'
      }
    })

    if (result.isConfirmed) {
      const packsToBuy = result.value
      await buyPacksContract(packsToBuy)
    }
  }, [walletAddress, gammaPacksContract, cardInfoOpened, albumInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleBurnCards = useCallback(async () => {
    if (cardsQttyToBurn === 0) {
      emitInfo(t('burn_no_cards_selected', 2000))
      return
    }

    console.log('cardstoburn', cardsToBurn)

    const result = await Swal.fire({
      title: `${t('burn_title')}`,
      text: `${t('burn_text').replace('{CARDS_TO_BURN}', cardsQttyToBurn)}`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `${t('confirm')}`,
      cancelButtonText: `${t('cancel')}`,
      confirmButtonColor: '#005EA3',
      color: 'black',
      background: 'white',
      customClass: {
        image: 'cardalertimg',
        input: 'alertinput gamma_validators_centered_input'
      }
    })

    if (result.isConfirmed) {
      try {
        startLoading()

        await burnCards(gammaCardsContract, cardsToBurn)

        setCardsToBurn([])
        setCardsQttyToBurn(0)
        switchAlbum(ALBUMS.ALBUM_INVENTORY)
        stopLoading()
        emitSuccess(t('confirmado'), 2000)
      } catch (ex) {
        stopLoading()
        console.error({ ex })
        emitError(t('burn_error'))
      }
    }
  }, [currentAlbum, walletAddress, gammaPacksContract])

  const handleCancelBurning = useCallback(async () => {
    switchAlbum(ALBUMS.ALBUM_INVENTORY)
    setCardsToBurn([])
    setCardsQttyToBurn(0)
  }, [currentAlbum])

  const NotConnected = () => (
    <div className='alpha'>
      <div className='main_buttons_container'>
        {!isConnected && (
          <button
            className='alpha_button alpha_main_button'
            id='connect_wallet_button'
            onClick={() => connectWallet()}
          >
            {t('connect_wallet')}
          </button>
        )}
        {isConnected && !isValidNetwork && (
          <div className='invalid__network__div'>
            <span className='invalid__network'>
              {t('account_invalid_network').replace('{NETWORK}', NETWORK.chainName)}
            </span>
          </div>
        )}
        {/*isConnected && !isValidNetwork && (
          <button
            className='alpha_button alpha_main_button'
            id='switch_network_button'
            onClick={() => switchOrCreateNetwork()}
          >
            {t('account_switch')}
          </button>
        )*/}
        <button
          className='alpha_button alpha_main_button'
          id='show_rules_button'
          onClick={() => setShowRules(true)}
        >
          {t('reglas')}
        </button>
      </div>
    </div>
  )

  const InfofoRightInventory = () => (
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
          {numberOfPacks === 0 || cardInfoOpened || albumInfoOpened ? (
            <>
              {cardInfoOpened || albumInfoOpened ? (
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
                <Image src={'/images/gamma/buyPackOn.png'} alt='buy pack' height='40' width='40' />
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

  const InfoRightAlbum120 = () => {
    if (uniqueCardsQtty > 0) {
      return (
        <div className='gammaComplete'>
          <div className={albums120Qtty > 0 ? 'qtty_complete' : 'qtty_incomplete'}>
            <h3>{`A: ${albums120Qtty || 0}/1`}</h3>
          </div>
          <div className={uniqueCardsQtty >= 120 ? 'qtty_complete' : 'qtty_incomplete'}>
            <h3>{`C: ${uniqueCardsQtty || 0}/120`}</h3>
          </div>
          <div className={canCompleteAlbum120() ? 'title_complete' : 'title_incomplete'}>
            <h3>{canCompleteAlbum120() ? `(${t('completo')})` : `(${t('incompleto')})`}</h3>
          </div>
          {canCompleteAlbum120() && (
            <div
              onClick={() => {
                handleFinishAlbum()
              }}
              className={canCompleteAlbum120() ? 'completeAlbum' : 'completeAlbum_disabled'}
            >
              <h3>{t('reclamar_premio')}</h3>
            </div>
          )}
        </div>
      )
    } else {
      return <></>
    }
  }

  const InfoRightAlbumToBurn = () => (
    <div className='gammaComplete'>
      <div className={albums60Qtty > 0 ? 'qtty_complete' : 'qtty_incomplete'}>
        <h3>{`A: ${albums60Qtty || 0}`}</h3>
      </div>
      <div className={cardsQttyToBurn > 0 ? 'qtty_complete' : 'qtty_incomplete'}>
        <h3>{`C: ${cardsQttyToBurn || 0}/${repeatedCardsQtty || 0}`}</h3>
      </div>
    </div>
  )

  const InfoRightAlbumBurnSelection = () => (
    <div className='gammaComplete'>
      <div className={albums60Qtty > 0 ? 'qtty_complete' : 'qtty_incomplete'}>
        <h3>{`A: ${albums60Qtty || 0}`}</h3>
      </div>
      <div className={cardsQttyToBurn > 0 ? 'qtty_complete' : 'qtty_incomplete'}>
        <h3>{`C: ${cardsQttyToBurn || 0}/${repeatedCardsQtty || 0}`}</h3>
      </div>
    </div>
  )

  const GammaPackInfoRight = () => {
    switch (currentAlbum) {
      case ALBUMS.ALBUM_INVENTORY:
        return <InfofoRightInventory />
      case ALBUMS.ALBUM_120:
        return <InfoRightAlbum120 />
      case ALBUMS.ALBUM_BURN_SELECTION:
        return <InfoRightAlbumBurnSelection />
      case ALBUMS.ALBUM_TO_BURN:
        return <InfoRightAlbumToBurn />
      default:
        return <InfofoRightInventory />
    }
  }

  const BookImageLeft = () => {
    let _className = ''

    switch (currentAlbum) {
      case ALBUMS.ALBUM_INVENTORY:
        _className = `${'gammaAlbums'}${cardInfoOpened || albumInfoOpened ? '-disabled' : ''}`
        break
      case ALBUMS.ALBUM_120:
        _className = `${'gammaAlbums120'}${cardInfoOpened || albumInfoOpened ? '-disabled' : ''}`
        break
      case ALBUMS.ALBUM_BURN_SELECTION:
        _className = `${'gammaAlbums'}${cardInfoOpened || albumInfoOpened ? '-disabled' : ''}`
        break
      case ALBUMS.ALBUM_TO_BURN:
        _className = `${'gammaAlbumsToBurn'}${cardInfoOpened || albumInfoOpened ? '-disabled' : ''}`
        break
    }

    return (
      <div
        onClick={() => {
          handleSwitchBook()
        }}
        className={_className}
      />
    )
  }

  return (
    <div className='gamma_main'>
      {(!isConnected || !isValidNetwork) && <NotConnected />}

      {showRules && <Rules type='gamma' setShowRules={setShowRules} />}

      {isConnected && isValidNetwork && packIsOpen && (
        <GammaPackOpen
          setPackIsOpen={setPackIsOpen}
          cardsNumbers={openPackCardsNumbers}
          setOpenPackage={setOpenPackage}
          openPackage={openPackage}
        />
      )}

      {isConnected && isValidNetwork && <BookImageLeft />}

      {isConnected && isValidNetwork && (
        <GammaAlbum
          updateUserData={updateUserData}
          setCardInfoOpened={setCardInfoOpened}
          setAlbumInfoOpened={setAlbumInfoOpened}
        />
      )}

      {isConnected && isValidNetwork && <GammaPackInfoRight />}
    </div>
  )
}

export default GammaMain
