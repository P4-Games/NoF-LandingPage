/* eslint-disable react/no-unstable-nested-components */
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useCallback } from 'react'

import { storageUrlGamma } from '../../config'
import CustomImage from '../../components/CustomImage'
import { useWeb3Context, useLayoutContext } from '../../hooks'
import { getAccountAddressText } from '../../utils/stringUtils'
import { hasCard, confirmOfferExchange } from '../../services/gamma'
import { emitError, emitSuccess, emitWarning } from '../../utils/alert'

const GammaCardExchange = (props) => {
  const { handleFinishCardExchange, offerData, selectedOfferId, selectedCardNumber } = props
  const { t } = useTranslation()
  const {
    startLoading,
    stopLoading,
    ToggleShowDefaultButtons,
    updateShowButtons,
    updateFooterButtonsClasses,
    updateButtonFunctions
  } = useLayoutContext()
  const { gammaOffersContract, gammaCardsContract, walletAddress } = useWeb3Context()

  useEffect(() => {
    ToggleShowDefaultButtons(false)
    updateShowButtons([false, true, true, false])
    updateFooterButtonsClasses([
      null,
      'footer__buttons__greenbtn_custom_confirm',
      'footer__buttons__redbtn_custom_cancel',
      null
    ])
    updateButtonFunctions(2, handleCancelClick)
  }, [handleCancelClick]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateButtonFunctions(1, handleConfirmClick)
  }, [handleConfirmClick]) // eslint-disable-line react-hooks/exhaustive-deps

  const userOfferHasCard = (item, userOfferWalletAddress) => {
    let result = false
    try {
      startLoading()
      result = hasCard(gammaCardsContract, userOfferWalletAddress, item)
    } catch (e) {
      stopLoading()
      console.error({ e })
      emitError(t('user_has_card_error'))
    }
    stopLoading()
    return result
  }

  const getSelectedOffer = useCallback(
    (offerId) => {
      const offer = offerData.filter((item) => item.offerId === offerId)
      return offer[0]
    },
    [offerData]
  )

  const handleConfirmClick = useCallback(async () => {
    try {
      const offer = getSelectedOffer(selectedOfferId)
      const walletFrom = walletAddress
      const cardNumberFrom = selectedCardNumber
      const walletTo = offer.offerWallet
      const cardNumberTo = offer.offerCard
      const auto = offer.offerAuto

      startLoading()

      if (auto) {
        const _userOfferHasCard = await userOfferHasCard()
        if (_userOfferHasCard) {
          emitWarning(t('offer_user_card_alredy_have'))
          return
        }
      }

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
    } catch (e) {
      stopLoading()
      console.error({ e })
      emitError(t('offer_exchange_error'))
    }
  }, [selectedOfferId, selectedCardNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancelClick = useCallback(() => {
    ToggleShowDefaultButtons(true)
    handleFinishCardExchange(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const CardItem = ({ cardNumber, text, wallet, you = false }) => (
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
        <p className='gamma__cards__exchange__wallet'>
          {`${t('owner')}: ${getAccountAddressText(wallet)} ${you ? `(${t('you')})` : ''}`}
        </p>
      )}
    </div>
  )

  CardItem.propTypes = {
    text: PropTypes.string,
    cardNumber: PropTypes.number,
    wallet: PropTypes.string,
    you: PropTypes.bool
  }

  return (
    <div className='gamma__cards__exchange__main'>
      <div className='gamma__cards__exchange'>
        <div className='gamma__cards__exchange__container'>
          <CardItem
            cardNumber={selectedCardNumber}
            text='exhange_cards_to_send'
            wallet={walletAddress}
            you
          />
          <div className='gamma__cards__exchange__center'>
            <p className='gamma__cards__exchange__transfer'>{`${t('offer_exchange_title')}`}</p>
          </div>
          {selectedOfferId && (
            <CardItem
              cardNumber={getSelectedOffer(selectedOfferId).offerCard}
              text='exhange_cards_to_receive'
              wallet={getSelectedOffer(selectedOfferId).offerWallet}
            />
          )}
        </div>
      </div>
    </div>
  )
}

GammaCardExchange.propTypes = {
  handleFinishCardExchange: PropTypes.func,
  offerData: PropTypes.array,
  selectedOfferId: PropTypes.string,
  selectedCardNumber: PropTypes.number
}

export default GammaCardExchange
