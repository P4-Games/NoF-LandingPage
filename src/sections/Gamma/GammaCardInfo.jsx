import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Swal from 'sweetalert2'
import {useTranslation} from 'next-i18next'
import { MdOutlineLocalOffer } from "react-icons/md"

import { useWeb3Context } from '../../hooks'
import { storageUrlGamma, openSeaUrlGamma } from '../../config'
import { hasCard } from '../../services/gamma'
import { createOffer, removeOfferByCardNumber } from '../../services/offers'
import { useLayoutContext } from '../../hooks'
import { checkInputAddress, checkInputArrayCardNumbers } from '../../utils/InputValidators'

const GammaCardInfo = (props) => {
  const { imageNumber, handleFinishInfoCard, userCard } = props
  const {t} = useTranslation()
  const { bookRef, windowSize, loading, startLoading, stopLoading } = useLayoutContext()
  const { gammaCardsContract, gammaOffersContract, walletAddress } = useWeb3Context()
  const [ userHasCard, setUserHasCard ] = useState(false)
   
  console.log('userCard', userCard)

  function emitError (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: 5000
    })
  }

  function emitWarning (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'warning',
      showConfirmButton: true,
      timer: 5000
    })
  }
  
  const verifyUserHasCard = async () => {
    try {
      startLoading()
      const result = await hasCard(gammaCardsContract, imageNumber)
      setUserHasCard(result)
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error(ex)
      emitError (t('user_has_card_error'))
    }
  }

  useEffect(() => {
    verifyUserHasCard()
  }, [gammaCardsContract]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOfferClick = async () => {
    Swal.fire({
      title: 'Work in Progress',
      text: 'Nada por aquí aún. Estamos trabajando en ello. Próximamente, podŕas ver las ofertas de cartas publicadas e intercambiar.',
      icon: 'information',
      showConfirmButton: true,
      timer: 5500
    })
  }

  const handlePublishClick = async () => {

    try {
      const result = await Swal.fire({
        text: `${t('cartas_a_cambio')}`,
        input: 'text',
        inputPlaceholder: '3, 23, 44, 55, 119, 2',
        inputAttributes: {
          min: 1,
          max: 60
        },
        inputValidator: (value) => {
          if (!checkInputArrayCardNumbers(value, imageNumber))
            return `${t('publish_offer_error_invalid_numbers')}`
        },
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('publicar')}`,
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
        await createOffer(gammaOffersContract, gammaCardsContract, imageNumber, result.value)
        handleFinishInfoCard(true)
        stopLoading()
        Swal.fire({
          title: '',
          text: t('confirmado'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
      }

    } catch (ex) {
      stopLoading()
      console.log(ex.message)
      if (ex.message == 'publish_offer_error_own_card_number')
        emitWarning(t('publish_offer_error_own_card_number'))
      else
        emitError(t('publish_offer_error'))
    }
  }

  const handleUnPublishClick = async () => {
    try {
      const result = await Swal.fire({
        text: `${t('unpublish_offer_dialog')}`,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('despublicar')}`,
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
        await removeOfferByCardNumber(gammaOffersContract, imageNumber)
        handleFinishInfoCard(true)
        stopLoading()
        Swal.fire({
          title: '',
          text: t('confirmado'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
      }

    } catch (ex) {
      stopLoading()
      console.log(ex.message)
      emitError(t('unpublish_offer_error'))
    }
  }

  const handleTransferClick = async () => {
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
        const transaction = await gammaCardsContract.transferCard(result.value, imageNumber)
        await transaction.wait()
        handleFinishInfoCard(true)
        stopLoading()
        Swal.fire({
          title: '',
          text: t('confirmado'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
      }
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('transfer_card_error'))
    }
  }

  const handleTransferModalClick = async () => {
    // TODO
  }

  const handleMintClick = async () => {
    try {
      startLoading()
      const transaction = await gammaCardsContract.mintCard(imageNumber)
      await transaction.wait()
      handleFinishInfoCard(true)
      stopLoading()
      Swal.fire({
        title: '',
        html: `${t('carta_minteada')} 
        <a target='_blank' href=${openSeaUrlGamma}/${imageNumber}'>
          ${t('aqui')}
        </a>`,
        icon: 'success',
        showConfirmButton: true,
        timer: 3000
      })
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('mint_error'))
    }
  }

  const OfferButton = () => (
    <div className= {'option'}
    onClick={() => handleOfferClick()}
    >
      {t('ofertas')}
    </div>
  )

  const CloseButton = () => (
    <div
      className='gamma_info_card_close'
      onClick={() => handleFinishInfoCard(false)}
    >
      X
    </div>
  )

  const MintButton = () => (
    <div
    /* Solo se puede tener una oferta para una carta, por lo que si tengo quantity > 1,
       tengo que poder mintear la otra carta que tenga.*/
      className= {userHasCard && (!userCard.offered || userCard.quantity > 1) ? 'option' : 'option_disabled' }
      onClick={() => handleMintClick()}
    >
      {t('mintear')}
    </div>
  )

  const PublishButton = () => (
    <div
      className= {userHasCard ? 'option' : 'option_disabled' }
      onClick={() => handlePublishClick()}
    >
      {t('publicar')}
    </div>
  )

  const UnPublishButton = () => (
    <div
      className= {userCard.offered ? 'option' : 'option_disabled' }
      onClick={() => handleUnPublishClick()}
    >
      {t('despublicar')}
    </div>
  )

  const TransferButton = () => (
    <div
      /* Solo se puede tener una oferta para una carta, por lo que si tengo quantity > 1,
         tengo que poder mintear la otra carta que tenga.*/
      className= {userHasCard && (!userCard.offered || userCard.quantity > 1)  ? 'option' : 'option_disabled' }
      onClick={() => handleTransferClick()}
    >
      {t('transferir')}
    </div>
  )

  const TrasnferModal = () => (
    <div className='gamma_transfer_modal gamma_display_none'>
      <button
        className='gamma_transfer_modal_close gamma_modal_close'
        onClick={() => {
          const modal = document.getElementsByClassName(
            'gamma_transfer_modal'
          )[0]
          modal.setAttribute(
            'class',
            'gamma_transfer_modal gamma_display_none'
          )
          // setTransferError('')
          // setReceiverAccount('')
        }}
      >
        X
      </button>
      <span style={{ fontSize: '0.9rem' }}>
        {t('carta_de_coleccion')}{' '}
        {/*cards[cardIndex]
          ? ethers.BigNumber.from(
            cards[cardIndex].collection
          ).toNumber()
          : ethers.BigNumber.from(
            cards[cardIndex - 1].collection
          ).toNumber()*/}
      </span>
      <input
        placeholder={t('wallet_destinatario')}
        // value={receiverAccount}
        // onChange={(e) => setReceiverAccount(e.target.value)}
      />
      <button
        className='gamma_button'
        onClick={() => handleTransferModalClick()}
        // disabled={disableTransfer}
      >
        {t('transferir')}
      </button>
      {/*<span className='gamma_transfer_error'>{transferError}</span>*/}
    </div>
  )
    
  const BookCard = () => (
    <HTMLFlipBook
      id='Book'
      size='stretch'
      width={360}
      height={500}
      minWidth={300}
      maxWidth={800}
      minHeight={350}
      maxHeight={800}
      autoSize
      drawShadow={false}
      usePortrait={windowSize.size}
      ref={bookRef}
      className='hero__top__album__book'>
      <div
        className='hero__top__album__book__page'
        data-density='hard'
        number='1'>
        <div className='hero__top__album__book__page__page-content'>
          <div className='cardinfo'>
            <div className='cardinfoimg'>
              <img
                src={`${storageUrlGamma}/T1/${props.imageNumber}.png`}
                alt='img'
              />
             { userCard.offered && <MdOutlineLocalOffer className='cardinfoimg-offered' /> }
            </div>
            <h3>#{props.imageNumber}</h3>
            <div className='cardnof' />
          </div>
        </div>
      </div>
      <div
        className='hero__top__album__book__page0'
        data-density='hard'
        number='2'>
        <div className='cardinfo'>
          <div className='transactions'>
            <CloseButton/>
            <MintButton/>
            <TransferButton/>
            {!userCard.offered && <PublishButton/>}
            {userCard.offered && <UnPublishButton/>}
            <OfferButton/>
          </div>
          <div className='modals'>
            <TrasnferModal/>
          </div>
        </div>
      </div>
    </HTMLFlipBook>
  )

  return (
    loading ? <></>: (
      windowSize?.mobile 
      ?  <div className='hero__top__album'><BookCard /> </div>
      : <BookCard />
    )
  )
}

GammaCardInfo.propTypes = {
  imageNumber: PropTypes.number,
  userCard: PropTypes.object,
  handleFinishInfoCard: PropTypes.func
}

export default GammaCardInfo

