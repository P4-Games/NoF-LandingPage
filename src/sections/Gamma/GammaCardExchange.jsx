
import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { emitWarning, emitSuccess } from '../../utils/alert'
import { useTranslation } from 'next-i18next'
import { useWeb3Context, useLayoutContext } from '../../hooks'

const GammaCardExchange = (props) => {
  const { handleFinishCardExchange, offerData, selectedCardNumber } = props
  const { t } = useTranslation()
  const { 
      startLoading,
      stopLoading,
      ToggleShowDefaultButtons,
      updateShowButtons,
      updateButtonFunctions
  } = useLayoutContext()
  const { gammaOffersContract, walletAddress } = useWeb3Context()

  useEffect(() => {
    ToggleShowDefaultButtons(false)
    updateShowButtons([false, true, true, false])
    updateButtonFunctions(2, handleCancelClick)
  }, [handleCancelClick]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateButtonFunctions(1, handleConfirmClick)
  }, [handleConfirmClick]) //eslint-disable-line react-hooks/exhaustive-deps

  function findFirstOfferByCardNumber(cardNumber) {
    // Busca el elemento que contiene el cardNumber en wantedCards
    // deveulve el primero
    const offers = offerData.filter((item) => item.wantedCards.includes(cardNumber))
    return offers[0] // puede haber mas de una oferta con el mismo cardNumber en wantedCards
  }

  const handleConfirmClick = useCallback(async () => {
    try {
      const offer = findFirstOfferByCardNumber(selectedCardNumber)
      const walletFrom = walletAddress
      const cardNumberFrom = selectedCardNumber
      const walletTo = offer.offerWallet
      const cardNumberTo = offer.offerCard

      console.log(offer, walletFrom, cardNumberFrom, walletTo, cardNumberTo)

      startLoading()
      /*
      await confirmOfferExchange(
        gammaOffersContract,
        walletFrom,
        cardNumberFrom,
        walletTo,
        cardNumberTo
      )
      */
      ToggleShowDefaultButtons(true)
      handleFinishCardExchange(true)
      stopLoading()
      emitSuccess(t('confirmado'), 2000)
    } catch (ex) {
      stopLoading()
      console.error(ex.message)
      emitWarning(t('offer_exchange_error'))
    }
  }, [selectedCardNumber]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleCancelClick = useCallback(() => {
    ToggleShowDefaultButtons(true)
    handleFinishCardExchange(false)
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <div>HOLA</div>
    </React.Fragment>
  )
}

GammaCardExchange.propTypes = {
  handleFinishCardExchange: PropTypes.func,
  offerData: PropTypes.array,
  selectedCardNumber: PropTypes.number
}

export default GammaCardExchange
