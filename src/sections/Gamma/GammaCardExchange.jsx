import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import CustomImage from '../../components/CustomImage'
import { storageUrlGamma } from '../../config'
import { emitWarning, emitSuccess } from '../../utils/alert'
import { useTranslation } from 'next-i18next'
import { useWeb3Context, useLayoutContext } from '../../hooks'
import { confirmOfferExchange } from '../../services/gamma'
import { getAccountAddressText } from '../../utils/stringUtils'

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

      startLoading()

      await confirmOfferExchange(
        gammaOffersContract,
        walletFrom,
        cardNumberFrom,
        walletTo,
        cardNumberTo
      )

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

  const CardItem = ({ cardNumber, text, wallet }) => (
    <div className='gamma__cards__exchange__item'>
      <p className='gamma__cards__exchange__text'>{`${t(text)} (#${cardNumber})`}</p>
      <div className='gamma__cards__exchange__image_container'>
        <CustomImage
          alt='gamma-exchange-from-image'
          src={`${storageUrlGamma}/T1/${cardNumber}.png`}
          className='gamma__cards__exchange__image'
        />
      </div>
      {wallet && (
        <p className='gamma__cards__exchange__wallet'>{`${t('owner')}: ${getAccountAddressText(
          wallet
        )}`}</p>
      )}
    </div>
  )

  CardItem.propTypes = {
    text: PropTypes.string,
    cardNumber: PropTypes.number,
    wallet: PropTypes.string
  }

  return (
    <div className='gamma__cards__exchange__main'>
      <div className='gamma__cards__exchange'>
        <div className='gamma__cards__exchange__container'>
          <CardItem
            cardNumber={selectedCardNumber}
            text={'exhange_cards_to_send'}
            wallet={walletAddress}
          />
          <div className='gamma__cards__exchange__center'>
            <p className='gamma__cards__exchange__transfer'>{`${t('offer_exchange_title')}`}</p>
          </div>
          <CardItem
            cardNumber={offerData[0].offerCard}
            text={'exhange_cards_to_receive'}
            wallet={offerData[0].offerWallet}
          />
        </div>
      </div>
    </div>
  )
}

GammaCardExchange.propTypes = {
  handleFinishCardExchange: PropTypes.func,
  offerData: PropTypes.array,
  selectedCardNumber: PropTypes.number
}

export default GammaCardExchange
