import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import Swal from 'sweetalert2'
import {useTranslation} from 'next-i18next'
import { MdOutlineLocalOffer } from "react-icons/md"

import { useWeb3Context } from '../../hooks'
import { storageUrlGamma, openSeaUrlGamma } from '../../config'
import { hasCard } from '../../services/gamma'
import { removeOfferByCardNumber } from '../../services/offers'
import { useLayoutContext } from '../../hooks'
import { checkInputAddress } from '../../utils/InputValidators'
import GammaAlbumPublish from './GammaAlbumPublish'
import { canUserPublishOffer, canAnyUserPublishOffer } from '../../services/offers'

const GammaCardInfo = (props) => {
  const {t} = useTranslation()
  const { bookRef, windowSize, loading, startLoading, stopLoading } = useLayoutContext()
  const { gammaCardsContract, gammaOffersContract, walletAddress } = useWeb3Context()
  const { handleFinishInfoCard, handleOpenCardOffers, userCard, paginationObj } = props
  const [ userHasCard, setUserHasCard ] = useState(false)
  const [ cardPublish, setCardPublish ] = useState(false)

  function emitError (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: 5000
    })
  }

  function emitInfo (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'info',
      showConfirmButton: true,
      timer: 6700
    })
  }

  const verifyUserHasCard = async () => {
    try {
      startLoading()
      const result = await hasCard(gammaCardsContract, walletAddress, userCard.name)
      // console.log('verifyUserHasCard', result)
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
    handleOpenCardOffers()
  }

  const handleFinishPublish = (update) => {
    setCardPublish(false) 
    if (update) {
      handleFinishInfoCard(update)
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
        await removeOfferByCardNumber(gammaOffersContract, userCard.name)
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
        const transaction = await gammaCardsContract.transferCard(result.value, userCard.name)
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

  const handleMintClick = async () => {
    try {
      startLoading()
      const transaction = await gammaCardsContract.mintCard(userCard.name)
      await transaction.wait()
      handleFinishInfoCard(true)
      stopLoading()
      Swal.fire({
        title: '',
        html: `${t('carta_minteada')} 
        <a target='_blank' href=${openSeaUrlGamma}/${userCard.name}'>
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

  const handlePublishClick = async () => {
    startLoading()

    const canUserPublishResult = await canUserPublishOffer(gammaOffersContract, walletAddress)
    if (!canUserPublishResult) {
      emitInfo(t('offer_user_limit'))
    } else {
      const canAnyUserPublishResult = await canAnyUserPublishOffer(gammaOffersContract)
      if (!canAnyUserPublishResult) {
        emitInfo(t('offer_game_limit'))
      } else {
        setCardPublish(true)
      }
    }
    stopLoading()    
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
      onClick={() => handleFinishInfoCard(true)}
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
   
  const BookCard = () => (
    <div className='hero__top'>
      <div className='hero__top__album'>
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
                    src={`${storageUrlGamma}/T1/${userCard.name}.png`}
                    alt='img'
                  />
                { userCard.offered && <MdOutlineLocalOffer className='cardinfoimg-offered' /> }
                </div>
                <h3>#{userCard.name}</h3>
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
            </div>
          </div>
        </HTMLFlipBook>
      </div>
    </div>
  )

  return (
    loading 
      ? <></>
      : <>
          {!cardPublish && <BookCard /> }
          {cardPublish &&
          <GammaAlbumPublish
            paginationObj={paginationObj}
            cardNumberOffered={userCard.name}
            handleFinishPublish={handleFinishPublish}
          />}
        </>
  )
}

GammaCardInfo.propTypes = {
  userCard: PropTypes.object,
  paginationObj: PropTypes.object,
  handleOpenCardOffers: PropTypes.func,
  handleFinishInfoCard: PropTypes.func
}

export default GammaCardInfo

