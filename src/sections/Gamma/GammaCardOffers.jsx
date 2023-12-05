import React from 'react'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import { useTranslation } from 'next-i18next'
import CustomImage from '../../components/CustomImage'
import { useWeb3Context } from '../../hooks'
import { storageUrlGamma } from '../../config'
import { confirmOfferExchange } from '../../services/gamma'
import { useLayoutContext } from '../../hooks'
import { emitWarning, emitSuccess } from '../../utils/alert'
import FlipBook from '../../components/FlipBook'

const GammaCardOffers = (props) => {
  const { handleFinishInfoCard, offerData, cardNumber, paginationObj } = props
  const { t } = useTranslation()
  const { loading, startLoading, stopLoading } = useLayoutContext()
  const { gammaOffersContract, walletAddress } = useWeb3Context()

  const existInSomeOfferWantedCards = (cardNumber) => {
    // verifica si una card estas en alguna de la colección de wantedCards de
    // las ofertas
    for (let index = 0; index < offerData.length; index++) {
      const offer = offerData[index]
      for (let index2 = 0; index2 < offer.wantedCards.length; index2++) {
        const wantedCard = offer.wantedCards[index2]
        if (wantedCard === cardNumber) return true
      }
    }

    return false
  }

  function findFirstOfferByCardNumber(cardNumber) {
    // Busca el elemento que contiene el cardNumber en wantedCards
    // deveulve el primero
    const offers = offerData.filter((item) => item.wantedCards.includes(cardNumber))
    return offers[0] // puede haber mas de una oferta con el mismo cardNumber en wantedCards
  }

  const userHasCard = (item) => {
    if (!paginationObj) return false
    return paginationObj.user[item]?.quantity && paginationObj.user[item]?.quantity !== 0
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
        await confirmOfferExchange(
          gammaOffersContract,
          walletFrom,
          cardNumberFrom,
          walletTo,
          cardNumberTo
        )
        handleFinishInfoCard(true)
        stopLoading()
        emitSuccess(t('confirmado'), 2000)
      }
    } catch (ex) {
      stopLoading()
      console.error(ex.message)
      emitWarning(t('offer_exchange_error'))
    }
  }

  const getStyle = (item) => (userHasCard(item) ? {} : { filter: 'grayscale(1)' })

  const OfferDetailPage = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left-album'
    const pagePar = pageNumber % 2 === 0
    if (pagePar) {
      divWrapperClassName = 'grid-wrapper-right-album'
    }

    return (
      <div className={divWrapperClassName}>
        {page &&
          page.map((item, index) => (
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
              {existInSomeOfferWantedCards(item) ? (
                <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
              ) : (
                <CustomImage src='/images/gamma/Nofy.png' alt='img' />
              )}
              {paginationObj.user[item]?.quantity > 1 && (
                <div className='quantity'>
                  X:
                  {paginationObj.user[item]?.quantity}
                </div>
              )}
              <div className='number'>{paginationObj.user[item]?.name || '0'}</div>
            </div>
          ))}
      </div>
    )
  }

  OfferDetailPage.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  const handleCloseButtonClick = () => {
    handleFinishInfoCard(false)
  }

  const BookOffer = () => (
    <FlipBook
      showClose={true}
      onCloseClick={handleCloseButtonClick}
      pages={Array.from({ length: 10 }, (_, index) => (
        <OfferDetailPage
          page={paginationObj[`page${index + 1}`]}
          key={index}
          pageNumber={index + 1}
        />
      ))}
    />
  )

  return loading ? <></> : <BookOffer />
}

GammaCardOffers.propTypes = {
  offerData: PropTypes.array,
  handleFinishInfoCard: PropTypes.func,
  cardNumber: PropTypes.number,
  paginationObj: PropTypes.object
}

export default GammaCardOffers
