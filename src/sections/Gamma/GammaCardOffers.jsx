import React from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import Swal from 'sweetalert2'
import {useTranslation} from 'next-i18next'
import CustomImage from '../../components/CustomImage'
import { useWeb3Context } from '../../hooks'
import { storageUrlGamma  } from '../../config'
import { confirmOfferExchange } from '../../services/gamma'
import { useLayoutContext } from '../../hooks'

const GammaCardOffers = (props) => {
  const { handleFinishInfoCard, offerData, cardNumber, paginationObj } = props
  const {t} = useTranslation()
  const { bookRef, windowSize, loading, startLoading, stopLoading } = useLayoutContext()
  const { gammaOffersContract, walletAddress } = useWeb3Context()
  
  function emitWarning (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'warning',
      showConfirmButton: true,
      timer: 5000
    })
  }

  const CloseButton = () => (
    <div
      className='gamma_info_card_close'
      onClick={() => handleFinishInfoCard(true)}
    >
      X
    </div>
  )

  const existInSomeOfferWantedCards = (cardNumber) => {
    // verifica si una card estas en alguna de la colección de wantedCards de 
    // las ofertas
    for (let index = 0; index < offerData.length; index++) {
      const offer = offerData[index]
      for (let index2 = 0; index2 < offer.wantedCards.length; index2++) {
        const wantedCard = offer.wantedCards[index2]
        if (wantedCard === cardNumber) 
          return true
      }
    }

    return false
  }
  
  function findFirstOfferByCardNumber(cardNumber) {
    // Busca el elemento que contiene el cardNumber en wantedCards
    // deveulve el primero
    const offers = offerData.filter(item => item.wantedCards.includes(cardNumber))
    return offers[0] // puede haber mas de una oferta con el mismo cardNumber en wantedCards
  }

  const userHasCard = (item) => {
    if (!paginationObj) return false
    return (paginationObj.user[item]?.quantity 
      && paginationObj.user[item]?.quantity !== 0)
  }

  const handleExchangeClick = async (item) => {
    try {
      if (!userHasCard(item)) {
        emitWarning(t('offer_card_no_la_tienes'))
        return
      }

      const offer = findFirstOfferByCardNumber(item)
      const walletFrom = walletAddress
      const cardNumberFrom = item
      const walletTo = offer.offerWallet
      const cardNumberTo = cardNumber
      let msg = `${t('offer_exchange_message')}`
      msg = msg.replaceAll('{CARD_NUMBER_FROM}', cardNumberFrom)
      msg = msg.replaceAll('{CARD_NUMBER_TO}', cardNumberTo)
      msg = msg.replaceAll('{WALLET_TO}', walletTo)
      
      const result = await Swal.fire({
        title: `${t('offer_exchange_title')}`,
        html: `${msg}`,
        icon: 'warning',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonColor: '#005EA3',
        confirmButtonText: `${t('exchange')}`,
        background: 'white',
        customClass: {
          image: 'cardalertimg',
          content: 'swal2-text-content'
        }
      })

      if (result.isConfirmed) {
        startLoading()
        await confirmOfferExchange(gammaOffersContract, walletFrom, cardNumberFrom, walletTo, cardNumberTo)
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
      console.error(ex.message)
      emitWarning(t('offer_exchange_error'))
    }
  }

  const getStyle = (item) => (
    userHasCard(item) ? {} : { filter: 'grayscale(1)' }
  )
  
  const OfferDetailPage = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left-album'
    const pagePar = pageNumber % 2 === 0
    if (pagePar) { 
      divWrapperClassName = 'grid-wrapper-right-album'
    }

    return (
      <div className={divWrapperClassName}>
        {page && page.map((item, index) => (
          <div 
            onClick={() => { 
              if (existInSomeOfferWantedCards(item)) {
                handleExchangeClick(item)
              }
            }}
            style={getStyle(item)} 
            key={index}
            className='grid-item'
          >
            { existInSomeOfferWantedCards(item)
              ? <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
              : <CustomImage src='/images/gamma/Nofy.png' alt='img' /> 
            }
            <div className='number'>{paginationObj.user[item]?.name || '0'}</div>
          </div>))
        }
      </div>
    )
  }
  
  OfferDetailPage.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  const BookOffer = () => (
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
          
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className={
                  index % 2 === 0
                  ? ('hero__top__album__book__page')
                  : ('hero__top__album__book__page0')
              }
              data-density='hard'
              number={index + 1}
            >
              {index % 2 !== 0 && <CloseButton/>}
              <OfferDetailPage page={paginationObj[`page${index + 1}`]} pageNumber={index + 1} />
            </div>
          ))}

        </HTMLFlipBook>
      </div>
    </div>
  )

  return (
    loading 
      ? <></>
      : <BookOffer />
  )
}

GammaCardOffers.propTypes = {
  offerData: PropTypes.array,
  handleFinishInfoCard: PropTypes.func,
  cardNumber: PropTypes.number,
  paginationObj: PropTypes.object
}

export default GammaCardOffers

