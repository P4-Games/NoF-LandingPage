import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'
import CustomImage from '../../components/CustomImage'
import { storageUrlGamma } from '../../config'
import { emitWarning } from '../../utils/alert'
import FlipBook from '../../components/FlipBook'
import { useLayoutContext, useGammaDataContext } from '../../hooks'
import GammaCardExchange from './GammaCardExchange'

const GammaCardOffers = (props) => {
  const { handleFinishInfoCard, offerData } = props
  const { t } = useTranslation()
  const [showExchangeCards, setShowExchangeCards] = useState(false)
  const [selectedCardNumber, setSelectedCardNumber] = useState(null)
  const { loading } = useLayoutContext()
  const { paginationObj } = useGammaDataContext()

  const existInSomeOfferWantedCards = (cardNumber) => {
    // verifica si una card esta en alguna de la colección de wantedCards de
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

  const handleFinishCardExchange = (confirmed) => {
    setSelectedCardNumber(null)
    setShowExchangeCards(false)
    if (confirmed) {
      handleFinishInfoCard(true)
    }
  }

  const userHasCard = (item) => {
    if (!paginationObj) return false
    return paginationObj.user[item]?.quantity && paginationObj.user[item]?.quantity !== 0
  }

  const handleCardClick = async (item) => {
    try {
      if (!userHasCard(item)) {
        emitWarning(t('offer_card_no_la_tienes'))
        return
      }
      setSelectedCardNumber(item)
      setShowExchangeCards(true)
    } catch (ex) {
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
                  handleCardClick(item)
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

  return loading ? (
    <></>
  ) : (
    <React.Fragment>
      {!showExchangeCards && <BookOffer />}

      {showExchangeCards && (
        <GammaCardExchange
          handleFinishCardExchange={handleFinishCardExchange}
          offerData={offerData}
          selectedCardNumber={selectedCardNumber}
        />
      )}
    </React.Fragment>
  )
}

GammaCardOffers.propTypes = {
  offerData: PropTypes.array,
  handleFinishInfoCard: PropTypes.func,
  cardNumber: PropTypes.number
}

export default GammaCardOffers
