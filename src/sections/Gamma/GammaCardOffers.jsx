/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'
import React, { useState, useEffect } from 'react'

import { storageUrlGamma } from '../../config'
import { hasCard } from '../../services/gamma'
import FlipBook from '../../components/FlipBook'
import GammaCardExchange from './GammaCardExchange'
import CustomImage from '../../components/CustomImage'
import { emitInfo, emitError } from '../../utils/alert'
import { getAccountAddressText } from '../../utils/stringUtils'
import { useWeb3Context, useLayoutContext, useGammaDataContext } from '../../hooks'

const GammaCardOffers = (props) => {
  const { handleFinishInfoCard, offerData } = props
  const { t } = useTranslation()
  const [showExchangeCards, setShowExchangeCards] = useState(false)
  const [selectedCardNumber, setSelectedCardNumber] = useState(null)
  const [selectedOfferId, setSelectedOfferId] = useState(null)
  const { loading, startLoading, stopLoading, getCurrentPage } = useLayoutContext()
  const { paginationObj } = useGammaDataContext()
  const [currentPage, setCurrentPage] = useState(0)
  const [pagedOffers, setPagedOffers] = useState([])
  const { gammaCardsContract } = useWeb3Context()

  function splitArray(array, chunkSize) {
    const arrayCopy = array.slice()
    const sortedArray = arrayCopy.sort((a, b) => a - b)
    const chunks = []

    for (let i = 0; i < sortedArray.length; i += chunkSize) {
      const chunk = sortedArray.slice(i, i + chunkSize)

      if (chunk.length < chunkSize) {
        while (chunk.length < chunkSize) {
          chunk.push(-1) // Completa con -1 si el chunk es menor que chunkSize
        }
      }

      chunks.push({ wantedCards: chunk })
    }
    return chunks
  }

  useEffect(() => {
    if (!paginationObj) return

    const _pagedOffers = []
    let _pagedOffer = {}

    for (let index = 0; index < offerData.length; index++) {
      const offer = offerData[index]
      _pagedOffer = {}
      _pagedOffer.offerId = offer.offerId
      _pagedOffer.offerWallet = offer.offerWallet
      _pagedOffer.offerCard = offer.offerCard
      _pagedOffer.offerId = offer.offerId
      _pagedOffer.pagedWantedCards = splitArray(offer.wantedCards, 12)
      _pagedOffer.offerAuto = offer.auto
      _pagedOffer.offerValid = offer.valid
      _pagedOffers.push(_pagedOffer)
    }

    _pagedOffers.user = paginationObj.user
    setPagedOffers(_pagedOffers)
  }, [paginationObj]) // eslint-disable-line react-hooks/exhaustive-deps

  const userHasCard = (item) => {
    if (!paginationObj) return false
    return paginationObj.user[item]?.quantity && paginationObj.user[item]?.quantity !== 0
  }

  const userOfferHasCard = async (item, userOfferWalletAddress) => {
    let result = false
    try {
      startLoading()
      result = await hasCard(gammaCardsContract, userOfferWalletAddress, item)
    } catch (e) {
      stopLoading()
      console.error({ e })
      emitError(t('user_has_card_error'))
    }
    stopLoading()
    return result
  }

  const handleFinishCardExchange = (confirmed) => {
    setSelectedCardNumber(null)
    setSelectedOfferId(null)
    setShowExchangeCards(false)
    if (confirmed) {
      handleFinishInfoCard(true)
    }
  }

  const handleCardClick = async (offerId, offerAuto, item) => {
    try {
      if (!userHasCard(item)) {
        emitInfo(t('offer_card_no_la_tienes'))
        return
      }

      if (offerAuto) {
        const _userOfferHasCard = await userOfferHasCard()
        if (_userOfferHasCard) {
          emitInfo(t('offer_user_card_alredy_have'))
          return
        }
      }

      setCurrentPage(getCurrentPage())
      setSelectedOfferId(offerId)
      setSelectedCardNumber(item)
      setShowExchangeCards(true)
    } catch (e) {
      console.error({ e })
      emitError(t('offer_exchange_error'))
    }
  }

  const handleCloseButtonClick = () => {
    handleFinishInfoCard(false)
  }

  const getStyle = (item) => (userHasCard(item) ? {} : { filter: 'grayscale(1)' })

  const OfferWantedCardsPage = ({ page, offerId, offerAuto, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-right-album'
    const pagePar = pageNumber % 2 === 0
    if (pagePar) {
      divWrapperClassName = 'grid-wrapper-left-album'
    }

    return (
      <div className={divWrapperClassName}>
        {page &&
          page.wantedCards &&
          page.wantedCards.map((item, index) => (
            <div
              onClick={() => {
                item === -1 ? {} : handleCardClick(offerId, offerAuto, item)
              }}
              style={getStyle(item)}
              key={index}
              className={item === -1 ? 'grid-item' : 'grid-item grid-item-exchange'}
            >
              {item === -1 ? (
                <CustomImage src='/images/gamma/Nofy.png' alt='img' />
              ) : (
                <>
                  <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
                  {paginationObj.user[item]?.quantity > 1 && (
                    <div className='quantity'>X: {paginationObj.user[item]?.quantity}</div>
                  )}
                  <div className='number'>{paginationObj.user[item]?.name || '0'}</div>
                </>
              )}
            </div>
          ))}
      </div>
    )
  }

  const OfferFirstPage = ({ offer, index }) => (
    <div className='cardinfo-exchange'>
      <h6 className='cardinfo-exchange-offer'>
        {t('oferta')}: #{index}
      </h6>
      <p className='cardinfo-exchange-wallet'>
        {t('wallet')}: #{getAccountAddressText(offer.offerWallet)}
      </p>
      <div className='cardinfo-exchange-img'>
        <img src={`${storageUrlGamma}/T1/${offer.offerCard}.png`} alt='img' />
      </div>
      <p>#{offer.offerCard}</p>
      <p className='cardinfo-exchange-leyend'>{t('exchange_cards_leyend')}</p>
    </div>
  )

  const getPages = () => {
    if (!pagedOffers || pagedOffers.length === 0) {
      return []
    }

    let pageIndex = 1
    const pages = pagedOffers.map((offer, index) => {
      const pagesArray = [
        <OfferFirstPage index={index + 1} key={`page${pageIndex}`} offer={offer} />
      ]

      if (offer.pagedWantedCards && offer.pagedWantedCards.length > 0) {
        offer.pagedWantedCards.forEach((page, pageWantedCardsIndex) => {
          pageWantedCardsIndex += 1
          pagesArray.push(
            <OfferWantedCardsPage
              key={`page${pageWantedCardsIndex}`}
              offerId={offer.offerId}
              offerAuto={offer.offerAuto}
              page={page}
              pageNumber={pageWantedCardsIndex}
            />
          )
        })
      }

      pageIndex += 1
      return pagesArray
    })
    return pages.flat() // para que todas las páginas estén en 1 solo array
  }

  const BookOffer = () => (
    <FlipBook
      startPage={currentPage}
      showClose
      onCloseClick={handleCloseButtonClick}
      pages={getPages()}
    />
  )

  return loading ? (
    <></>
  ) : (
    <>
      {!showExchangeCards && <BookOffer />}

      {showExchangeCards && (
        <GammaCardExchange
          handleFinishCardExchange={handleFinishCardExchange}
          offerData={offerData}
          selectedOfferId={selectedOfferId}
          selectedCardNumber={selectedCardNumber}
        />
      )}
    </>
  )
}

GammaCardOffers.propTypes = {
  offerData: PropTypes.array,
  handleFinishInfoCard: PropTypes.func
  // cardNumber: PropTypes.number
}

export default GammaCardOffers
