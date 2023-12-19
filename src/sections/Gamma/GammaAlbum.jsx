import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FcCheckmark } from 'react-icons/fc'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { useTranslation } from 'next-i18next'
import { storageUrlGamma } from '../../config'
import CustomImage from '../../components/CustomImage'
import FlipBook from '../../components/FlipBook'
import GammaCardInfo from './GammaCardInfo'
import GammaAlbumInfo from './GammaAlbumInfo'
import GammaCardOffers from './GammaCardOffers'
import { emitInfo } from '../../utils/alert'

import { getOffersByCardNumber } from '../../services/offers'
import { useWeb3Context, useLayoutContext, useGammaDataContext } from '../../hooks'

const GammaAlbum = (props) => {
  const { t } = useTranslation()
  const { showInventory, updateUserData, setCardInfoOpened, setAlbumInfoOpened } = props
  const { startLoading, stopLoading, getCurrentPage } = useLayoutContext()
  const { gammaOffersContract, walletAddress } = useWeb3Context()
  const { paginationObj } = useGammaDataContext()
  const [cardInfo, setCardInfo] = useState(false)
  const [albumInfo, setAlbumInfo] = useState(false)
  const [cardOffers, setCardOffers] = useState(false)
  const [imageNumber, setImageNumber] = useState(0)
  const [offersObj, setOffersObj] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)

  // const [ allOffers, setAllOffers ] = useState(null)

  /*
  const fetchAlloffers = async () => {
    try {
      startLoading()
      if (!gammaOffersContract) return 
      const offers = await getOffers(gammaOffersContract)
      setAllOffers(offers)
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error({ex})
      emitError('error')
    }
  }
  
  useEffect(() => {
    fetchAlloffers()
  }, [])

  */

  const handleOpenCardOffers = async () => {
    if (!offersObj || offersObj.length === 0) {
      const myOffer = paginationObj.user[imageNumber]?.offered
      if (myOffer) emitInfo(t('offer_only_own_offer'), 5500)
      else emitInfo(t('offer_card_number_empty'), 5500)
      return
    }

    setCardInfo(false)
    setCardOffers(true)
  }

  const handleFinishInfoCard = async (update = true) => {
    startLoading()
    if (update) {
      await updateUserData()
    }
    setCardInfo(false)
    setAlbumInfo(false)
    setCardOffers(false)
    setCardInfoOpened(false)
    setAlbumInfoOpened(false)
    stopLoading()
  }

  const updateCardOffers = async (cardNumber) => {
    const offers = await getOffersByCardNumber(gammaOffersContract, cardNumber)
    if (offers && offers.length > 0) {
      // filtro mis ofertas
      const filterMyoffes = offers.filter(
        (item) => item.offerWallet.toUpperCase() !== walletAddress.toUpperCase()
      )
      setOffersObj(filterMyoffes)
    } else {
      setOffersObj(null)
      /* Si el usuario2 confirma el intercambio de la carta X y el usuario1 abre el cardInfo
      de la carta X, va a tener objeto.offered = true (porque no tiene el update del usuario1)
      A diferencia de ello, el OffersObj está actualizado, por lo que es nulo, se quida 
      el offered. del paginationObj */
      paginationObj.user[cardNumber].offered = false
    }
  }

  const handleCardClick = async (cardNumber) => {
    startLoading()
    setCurrentPage(getCurrentPage())

    setImageNumber(cardNumber)
    updateCardOffers(cardNumber)

    if (cardNumber === 120 || cardNumber === 121) {
      setAlbumInfoOpened(true)
      setAlbumInfo(true)
    } else {
      setCardInfoOpened(true)
      setCardInfo(true)
    }

    stopLoading()
  }

  const getStyleInventory = (item) =>
    paginationObj.user[item]?.quantity === 0 || !paginationObj.user[item]?.quantity
      ? { filter: 'grayscale(1)' }
      : {}

  const getStyleAlbum120 = (item) =>
    paginationObj.user[item]?.quantity === 0 || !paginationObj.user[item]?.quantity
      ? { background: 'none', filter: 'grayscale(1)' }
      : { background: 'none' }

  /*
  const getCardNumberOffersQtty = (cardNumber) => {
    if (!allOffers) return 0
    let totalCardNumberOffers = 0
    allOffers.forEach(offer => {
      const offerCardNumber = offer[1]
      if (parseInt(offerCardNumber) === parseInt(cardNumber)) {
        totalCardNumberOffers += 1
      }
    })
    return totalCardNumberOffers
  }
  */

  const PageContentInventory = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left'
    if (pageNumber % 2 === 0) {
      // par
      divWrapperClassName = 'grid-wrapper-right'
    }

    return (
      <div className={divWrapperClassName}>
        {page &&
          page.map((item, index) => (
            <div
              onClick={() => {
                handleCardClick(item)
              }}
              style={getStyleInventory(item)}
              key={index}
              className='grid-item'
            >
              <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
              {paginationObj.user[item]?.stamped && <FcCheckmark />}
              {paginationObj.user[item]?.offered && (
                <MdOutlineLocalOffer className='image-my-offer' />
              )}
              {/* allOffers &&  (getCardNumberOffersQtty(item)) && <Offer2 className = 'image-other-offer' /> */}

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

  const PageContentAlbum = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left-album'
    if (pageNumber % 2 === 0) {
      // par
      divWrapperClassName = 'grid-wrapper-right-album'
    }

    return (
      <div className={divWrapperClassName}>
        {page &&
          page.map((item, index) => (
            <div style={getStyleAlbum120(item)} key={index} className='grid-item'>
              {paginationObj.user[item]?.stamped ? (
                <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
              ) : item === 120 || item === 121 ? (
                <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
              ) : (
                <CustomImage src='/images/gamma/Nofy.png' alt='img' />
              )}
            </div>
          ))}
      </div>
    )
  }

  const PageContent = ({ page, pageNumber }) =>
    showInventory ? (
      <PageContentInventory page={page} pageNumber={pageNumber} />
    ) : (
      <PageContentAlbum page={page} pageNumber={pageNumber} />
    )

  PageContent.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentInventory.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentAlbum.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  const getuserCardObject = (imageNumber) => {
    const data = paginationObj
      ? Object.values(paginationObj.user).find((entry) => entry.name === imageNumber.toString())
      : {}
    return data
  }

  const Book = () => {
    if (!paginationObj) return <></>
    else
      return (
        <FlipBook
          startPage={currentPage}
          showClose={false}
          onCloseClick={undefined}
          pages={Array.from({ length: 11 }, (_, index) => (
            <PageContent
              page={paginationObj[`page${index + 1}`]}
              key={index}
              pageNumber={index + 1}
            />
          ))}
          mainClassName={showInventory ? 'hero__top__album' : 'hero__top__album__gamma'}
        />
      )
  }

  return (
    <>
      {!cardInfo && !albumInfo && !cardOffers && <Book />}

      {cardInfo && (
        <GammaCardInfo
          userCard={getuserCardObject(imageNumber)}
          handleOpenCardOffers={handleOpenCardOffers}
          handleFinishInfoCard={handleFinishInfoCard}
        />
      )}

      {albumInfo && (
        <GammaAlbumInfo
          userCard={getuserCardObject(imageNumber)}
          handleOpenCardOffers={handleOpenCardOffers}
          handleFinishInfoCard={handleFinishInfoCard}
        />
      )}

      {cardOffers && offersObj && offersObj.length > 0 && (
        <GammaCardOffers
          offerData={offersObj}
          cardNumber={imageNumber}
          handleFinishInfoCard={handleFinishInfoCard}
        />
      )}
    </>
  )
}

GammaAlbum.propTypes = {
  showInventory: PropTypes.bool,
  updateUserData: PropTypes.func,
  setCardInfoOpened: PropTypes.func,
  setAlbumInfoOpened: PropTypes.func
}

export default GammaAlbum
