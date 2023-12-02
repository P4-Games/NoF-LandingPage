import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FcCheckmark } from 'react-icons/fc'
import { storageUrlGamma } from '../../config'
import { useLayoutContext } from '../../hooks'
import CustomImage from '../../components/CustomImage'
import FlipBook from '../../components/FlipBook'
import { useWeb3Context } from '../../hooks'
import { useTranslation } from 'next-i18next'
import { createOffer } from '../../services/offers'
import { emitError, emitInfo, emitSuccess, emitWarning } from '../../utils/alert'

const GammaAlbumPublish = (props) => {
  const { t } = useTranslation()
  const { paginationObj, cardNumberOffered, handleFinishPublish } = props
  const { gammaOffersContract } = useWeb3Context()
  const [selectedCards, setSelectedCards] = useState([])
  const {
    loading,
    startLoading,
    stopLoading,
    ToggleShowDefaultButtons,
    updateShowButtons,
    updateButtonFunctions
  } = useLayoutContext()

  useEffect(() => {
    ToggleShowDefaultButtons(false)
    updateShowButtons([false, true, true, false])
    updateButtonFunctions(2, handleCancelClick)
  }, [handleCancelClick]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateButtonFunctions(1, handleConfirmClick)
  }, [handleConfirmClick, selectedCards]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirmClick = useCallback(async () => {
    if (selectedCards.length === 0) {
      emitInfo(t('publish_offer_no_cards_selected'))
      return
    }

    try {
      startLoading()
      await createOffer(gammaOffersContract, cardNumberOffered, selectedCards)
      ToggleShowDefaultButtons(true)
      handleFinishPublish(true)
      stopLoading()
      emitSuccess(t('confirmado'), 2000)
    } catch (ex) {
      stopLoading()
      console.error(ex.message)
      if (ex.message == 'publish_offer_error_own_card_number')
        emitWarning(t('publish_offer_error_own_card_number'))
      else emitError(t('publish_offer_error'))
    }
  }, [gammaOffersContract, cardNumberOffered, selectedCards]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleCancelClick = useCallback(() => {
    ToggleShowDefaultButtons(true)
    handleFinishPublish(false)
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = async (selectedCard) => {
    if (parseInt(selectedCard) === parseInt(cardNumberOffered)) {
      emitWarning(t('publish_offer_error_own_card_number'))
    } else {
      if (selectedCards.includes(selectedCard)) {
        setSelectedCards((pevSelectedCards) =>
          pevSelectedCards.filter((card) => card !== selectedCard)
        )
      } else {
        if (selectedCards.length < 10) {
          setSelectedCards((pevSelectedCards) => [...pevSelectedCards, selectedCard])
        }
      }
    }
  }

  const getStyle = (item) =>
    paginationObj.user[item]?.quantity === 0 || !paginationObj.user[item]?.quantity
      ? 'img_missing'
      : ''

  const PageContentCard = ({ item, index }) => (
    <div
      onClick={() => {
        handleCardClick(item)
      }}
      key={index}
      className='grid-item'
    >
      <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' className={getStyle(item)} />
      {selectedCards.includes(item) && <FcCheckmark />}
      {paginationObj.user[item]?.quantity > 1 && (
        <div className='quantity'>X:{paginationObj.user[item]?.quantity}</div>
      )}
      {<div className='number'>{paginationObj.user[item]?.name || '0'}</div>}
    </div>
  )

  PageContentCard.propTypes = {
    item: PropTypes.number,
    index: PropTypes.number
  }

  const PageContent = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left'
    if (pageNumber % 2 === 0) {
      // par
      divWrapperClassName = 'grid-wrapper-right'
    }

    return (
      <div className={divWrapperClassName}>
        {page &&
          page.map((item, index) => <PageContentCard key={index} item={item} index={index} />)}
      </div>
    )
  }

  PageContent.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  return !paginationObj || loading ? (
    <></>
  ) : (
    <FlipBook
      showClose={false}
      onCloseClick={undefined}
      disableFlipByClick={true}
      pages={Array.from({ length: 10 }, (_, index) => (
        <PageContent key={index} page={paginationObj[`page${index + 1}`]} pageNumber={index + 1} />
      ))}
    />
  )
}

GammaAlbumPublish.propTypes = {
  paginationObj: PropTypes.object,
  cardNumberOffered: PropTypes.string,
  handleFinishPublish: PropTypes.func
}

export default GammaAlbumPublish
