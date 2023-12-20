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
import { fetchPackData } from '../../services/gamma'
import {
  checkPacksByUser,
  finishAlbum,
  openPack,
  openPacks,
  getMaxPacksAllowedToOpenAtOnce,
  getPackPrice,
  getUserAlbums120Qtty
} from '../../services/gamma'

import { useWeb3Context, useLayoutContext, useGammaDataContext } from '../../hooks'

const GammaMain = () => {
  const { t } = useTranslation()
  const [openPackCardsNumbers, setOpenPackCardsNumbers] = useState([])
  const [numberOfPacks, setNumberOfPacks] = useState(0)
  const [openPackage, setOpenPackage] = useState(false)
  const [inventory, setInventory] = useState(true)
  const [packIsOpen, setPackIsOpen] = useState(false)
  const { paginationObj, refreshPaginationObj } = useGammaDataContext()
  const {
    walletAddress,
    daiContract,
    gammaCardsContract,
    gammaPacksContract,
    web3Error,
    connectWallet,
    switchOrCreateNetwork,
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
  const [cardsQtty, setCardsQtty] = useState(0)
  const [albums120Qtty, setAlbums120Qtty] = useState(0)
  const [showRules, setShowRules] = useState(false)
  const [cardInfoOpened, setCardInfoOpened] = useState(false)
  const [albumInfoOpened, setAlbumInfoOpened] = useState(false)

  const canCompleteAlbum120 = () => cardsQtty >= 120 && albums120Qtty > 0

  const getCardsQtty = (_userdata) => {
    let total = 0
    if (!_userdata) return
    for (let key in _userdata.user) {
      if (
        _userdata.user[key].quantity > 0 &&
        _userdata.user[key].name != 120 &&
        _userdata.user[key].name != 121
      ) {
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

  const updateUserData = async () => {
    refreshPaginationObj()
    // TODO :ver de optimizar, no hace falta llamar al contrato, ya queda en paginationObj
    const userAlbums120 = await getUserAlbums120Qtty(gammaCardsContract, walletAddress)
    setAlbums120Qtty(userAlbums120)
    setCardsQtty(getCardsQtty(paginationObj))
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
    setCardsQtty(getCardsQtty(paginationObj))
  }, [paginationObj]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchInventory()
  }, [walletAddress, gammaCardsContract]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!walletAddress) return
    checkNumberOfPacks()
  }, [walletAddress, gammaPacksContract]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (walletAddress && !cardInfoOpened && !albumInfoOpened) {
      ToggleShowDefaultButtons(false)

      if (inventory) {
        updateShowButtons([true, true, true, true])
        updateFooterButtonsClasses([
          'footer__buttons__bluebtn_custom_switch_album',
          'footer__buttons__greenbtn_custom_shop',
          'footer__buttons__redbtn_custom_open',
          'footer__buttons__yellowbtn_custom_transfer'
        ])
      } else {
        updateShowButtons([true, true, false, false])
        updateFooterButtonsClasses([
          'footer__buttons__bluebtn_custom_switch_inventory',
          'footer__buttons__greenbtn_custom_claim',
          null,
          null
        ])
      }

      updateButtonFunctions(0, handleSwitchBook)
    }
  }, [walletAddress, gammaPacksContract, inventory, cardInfoOpened, albumInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (walletAddress && !cardInfoOpened && !albumInfoOpened) {
      if (inventory) updateButtonFunctions(1, handleBuyPack)
      else updateButtonFunctions(1, handleFinishAlbum)
    }
  }, [walletAddress, gammaPacksContract, inventory, cardInfoOpened, albumInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      if (walletAddress && inventory && !cardInfoOpened && !albumInfoOpened) {
        updateButtonFunctions(2, handleOpenPack)
      }
    },
    // prettier-ignore
    [ // eslint-disable-line react-hooks/exhaustive-deps
    walletAddress,
    gammaPacksContract,
    openPackage,
    packIsOpen,
    cardsQtty,
    numberOfPacks,
    inventory,
    cardInfoOpened,
    albumInfoOpened
  ]
  )

  useEffect(() => {
    if (walletAddress && inventory) {
      updateButtonFunctions(3, handleTransferPack)
    }
  }, [walletAddress, gammaPacksContract, numberOfPacks, inventory, cardInfoOpened, albumInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleFinishAlbum = useCallback(
    async () => {
      try {
        if (cardsQtty < 120) {
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
    inventory,
    cardInfoOpened,
    albumInfoOpened,
    cardsQtty,
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
  }, [walletAddress, gammaPacksContract, numberOfPacks, inventory, cardInfoOpened, albumInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

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
    cardsQtty,
    numberOfPacks,
    inventory,
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
    setInventory(!inventory)
  }, [inventory])

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
  }, [walletAddress, gammaPacksContract, inventory, cardInfoOpened, albumInfoOpened]) //eslint-disable-line react-hooks/exhaustive-deps

  const NotConnected = () => (
    <div className='alpha'>
      <div className='main_buttons_container'>
        <span>{t(web3Error)}</span>
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
          <button
            className='alpha_button alpha_main_button'
            id='switch_network_button'
            onClick={() => switchOrCreateNetwork()}
          >
            {t('account_switch')}
          </button>
        )}
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
          <div className={albums120Qtty > 0 ? 'qtty_complete' : 'qtty_incomplete'}>
            <h3>{`A: ${albums120Qtty}/1`}</h3>
          </div>
          <div className={cardsQtty >= 120 ? 'qtty_complete' : 'qtty_incomplete'}>
            <h3>{`C: ${cardsQtty}/120`}</h3>
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
    }

    return <></>
  }

  const BookImageLeft = () => (
    <div
      onClick={() => {
        handleSwitchBook()
      }}
      className={
        cardInfoOpened || albumInfoOpened
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
          showInventory={inventory}
          updateUserData={updateUserData}
          setCardInfoOpened={setCardInfoOpened}
          setAlbumInfoOpened={setAlbumInfoOpened}
        />
      )}

      {isConnected && isValidNetwork && <GammaPackInfo />}
    </div>
  )
}

export default GammaMain
