import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FcCheckmark } from 'react-icons/fc'
import { FaTrash } from 'react-icons/fa'
import { FaUndo } from 'react-icons/fa'
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
  const { setCardInfoOpened, setAlbumInfoOpened } = props
  const { startLoading, stopLoading, getCurrentPage } = useLayoutContext()
  const { gammaOffersContract, gammaCardsContract, walletAddress } = useWeb3Context()
  const {
    ALBUMS,
    currentAlbum,
    paginationObj,
    cardsQttyToBurn,
    setCardsQttyToBurn,
    cardsToBurn,
    setCardsToBurn,
    paginationObjBurn,
    refreshPaginationObj,
    setPaginationObjBurn
  } = useGammaDataContext()

  const [cardInfo, setCardInfo] = useState(false)
  const [albumInfo, setAlbumInfo] = useState(false)
  const [cardOffers, setCardOffers] = useState(false)
  const [imageNumber, setImageNumber] = useState(0)
  const [offersObj, setOffersObj] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)

  // const [paginationObjBurn, setPaginationObjBurn] = useState({})
  // const [cardsQttyToBurn, setCardsQttyToBurn] = useState(0)
  // const [cardsToBurn, setCardsToBurn] = useState([])

  // const [ allOffers, setAllOffers ] = useState(null)

  /*
  const fetchAlloffers = async () => {
    try {
      startLoading()
      if (!gammaOffersContract) return 
      const offers = await getOffers(gammaOffersContract)
      setAllOffers(offers)
      stopLoading()
    } catch (e) {
      stopLoading()
      console.error({ e })
      emitError('error')
    }
  }
  
  useEffect(() => {
    fetchAlloffers()
  }, [])

  */

  /*
  useEffect(() => {
    if (!paginationObj) return
    const _cloneObject = JSON.parse(JSON.stringify(paginationObj))
    setPaginationObjBurn(_cloneObject)
  }, [paginationObj]) //eslint-disable-line react-hooks/exhaustive-deps
*/

  function isCardNumberInCardsToBurn(cardNumber) {
    return cardsToBurn.includes(parseInt(cardNumber))
  }

  const handleOpenCardOffers = async () => {
    if (!offersObj || offersObj.length === 0) {
      const myOffer = paginationObj.user[imageNumber]?.offered
      if (myOffer) emitInfo(t('offer_only_own_offer'), 5500)
      else emitInfo(t('offer_card_number_empty'), 5500)
      return
    }

    // verifico que las ofertas sean válidas (wantedCards != [])
    const filteredResult = offersObj.filter((item) => item.valid)
    if (filteredResult.length === 0) {
      emitInfo(t('offer_card_number_empty'), 5500)
      return
    }

    setCardInfo(false)
    setCardOffers(true)
  }

  const handleFinishInfoCard = async (update = true) => {
    startLoading()
    if (update) {
      await refreshPaginationObj()
    }
    setCurrentPage(getCurrentPage())
    setCardInfo(false)
    setAlbumInfo(false)
    setCardOffers(false)
    setCardInfoOpened(false)
    setAlbumInfoOpened(false)
    stopLoading()
  }

  const updateCardOffers = async (cardNumber) => {
    try {
      const offers = await getOffersByCardNumber(
        gammaOffersContract,
        gammaCardsContract,
        cardNumber
      )
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
        A diferencia de ello, el OffersObj está actualizado, por lo que es nulo, se quita 
        el offered. del paginationObj */
        paginationObj.user[cardNumber].offered = false
      }
    } catch (ex) {
      // avoid show error
    }
  }

  const handleCardInventoryClick = async (cardNumber) => {
    startLoading()
    setCurrentPage(getCurrentPage())

    setImageNumber(cardNumber)

    if (parseInt(cardNumber) === 120 || parseInt(cardNumber) === 121) {
      setAlbumInfoOpened(true)
      setAlbumInfo(true)
    } else {
      updateCardOffers(cardNumber)
      setCardInfoOpened(true)
      setCardInfo(true)
    }

    stopLoading()
  }

  const handleCardBurnClick = (cardNumber) => {
    if (cardsQttyToBurn >= 60) {
      emitInfo(t('burn_select_all_info_60', 5000))
      return
    }

    if (
      paginationObjBurn.user[cardNumber]?.offered &&
      paginationObjBurn.user[cardNumber]?.quantity < 3
    ) {
      /* Si la carta tiene oferta, el usuario se tiene que quedar con
         un mínimo de 2 copias. 1 para Él, otra para la oferta. 
         A partir de la 3ra. puede quemar.
      */
      emitInfo(t('burn_select_cart_offered', 5000))
      return
    }

    setCurrentPage(getCurrentPage())

    // console.log('handleCardBurnClick', cardNumber)
    setCardsQttyToBurn((prevCardsQttyToBurn) => prevCardsQttyToBurn + 1)
    // setCardsQttyToBurn(cardsQttyToBurn + 1)

    setCardsToBurn((prevCardsToBurn) => [...prevCardsToBurn, cardNumber])
    // setCardsToBurn([...cardsToBurn, cardNumber])

    setPaginationObjBurn((prevPaginationObjBurn) => {
      const updatedUser = {
        ...prevPaginationObjBurn.user,
        [cardNumber]: {
          ...prevPaginationObjBurn.user[cardNumber],
          quantity: prevPaginationObjBurn.user[cardNumber].quantity - 1
        }
      }
      return {
        ...prevPaginationObjBurn,
        user: updatedUser
      }
    })
    // paginationObjBurn.user[cardNumber].quantity = paginationObjBurn.user[cardNumber].quantity - 1
  }

  const handleCardBurnUndoClick = (cardNumber) => {
    // console.log('handleCardBurnUndoClick', cardNumber)

    setCurrentPage(getCurrentPage())

    setCardsQttyToBurn(cardsQttyToBurn - 1)
    paginationObjBurn.user[cardNumber].quantity = paginationObjBurn.user[cardNumber].quantity + 1

    // se hace con index, dado que el array puede tener cardNumbers repetidos.
    const indexToRemove = cardsToBurn.indexOf(cardNumber)
    if (indexToRemove !== -1) {
      const updatedCardsToBurn = [...cardsToBurn]
      updatedCardsToBurn.splice(indexToRemove, 1)
      setCardsToBurn(updatedCardsToBurn)
    }
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
  const CardsToBurnCardItem = ({ pageNumber, index }) => {
    const value = index + 12 * (pageNumber - 1)
    return cardsToBurn && cardsToBurn.length > value ? (
      <CustomImage src={`${storageUrlGamma}/T1/${cardsToBurn[value]}.png`} alt='img' />
    ) : (
      <CustomImage src='/images/gamma/Nofy.png' alt='img' />
    )
  }

  const PageContentAlbumToBurn = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left-album'
    if (pageNumber % 2 === 0) {
      // par
      divWrapperClassName = 'grid-wrapper-right-album'
    }

    return (
      <div className={divWrapperClassName}>
        {page &&
          page.map((item, index) => (
            <div style={{ background: 'none' }} key={index} className='grid-item'>
              <CardsToBurnCardItem pageNumber={pageNumber} index={index} />
            </div>
          ))}
      </div>
    )
  }

  const PageContentCardUndo = ({ item }) =>
    paginationObjBurn.user[item]?.quantity > 1 && (
      <FaTrash
        className='image-burn-select'
        onClick={async (e) => {
          e.preventDefault()
          // setCurrentPage(getCurrentPage())
          handleCardBurnClick(item)
        }}
      />
    )

  const PageContentCardBurn = ({ item }) =>
    isCardNumberInCardsToBurn(item) && (
      <FaUndo
        className='image-burn-undo'
        onClick={(e) => {
          e.preventDefault()
          // setCurrentPage(getCurrentPage())
          handleCardBurnUndoClick(item)
        }}
      />
    )

  const PageContentCard = ({ item, index }) => (
    <div style={getStyleInventory(item)} key={index} className='grid-item'>
      <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
      {paginationObjBurn.user[item]?.quantity > 1 && (
        <div className='quantity'> X: {paginationObjBurn.user[item]?.quantity}</div>
      )}
      <PageContentCardBurn item={item} />
      <PageContentCardUndo item={item} />
      <div className='number'>{paginationObjBurn.user[item]?.name || '0'}</div>
    </div>
  )

  const PageContentAlbumBurnSelection = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left'
    if (pageNumber % 2 === 0) {
      // par
      divWrapperClassName = 'grid-wrapper-right'
    }

    return (
      <div className={divWrapperClassName}>
        {paginationObjBurn &&
          paginationObjBurn.user &&
          page &&
          page.map((item, index) => <PageContentCard key={index} item={item} index={index} />)}
      </div>
    )
  }

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
                handleCardInventoryClick(item)
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

  const PageContentAlbum120 = ({ page, pageNumber }) => {
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

  const PageContent = ({ page, pageNumber }) => {
    switch (currentAlbum) {
      case ALBUMS.ALBUM_INVENTORY:
        return <PageContentInventory page={page} pageNumber={pageNumber} />
      case ALBUMS.ALBUM_120:
        return <PageContentAlbum120 page={page} pageNumber={pageNumber} />
      case ALBUMS.ALBUM_BURN_SELECTION:
        return <PageContentAlbumBurnSelection page={page} pageNumber={pageNumber} />
      case ALBUMS.ALBUM_TO_BURN:
        return <PageContentAlbumToBurn page={page} pageNumber={pageNumber} />
      default:
        return <PageContentInventory page={page} pageNumber={pageNumber} />
    }
  }

  PageContent.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentInventory.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentAlbum120.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentAlbumBurnSelection.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentAlbumToBurn.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentAlbumBurnSelection.propTypes = {
    page: PropTypes.array,
    pageNumber: PropTypes.number
  }

  PageContentCard.propTypes = {
    item: PropTypes.number,
    index: PropTypes.number
  }

  PageContentCardBurn.propTypes = {
    item: PropTypes.number
  }

  PageContentCardUndo.propTypes = {
    item: PropTypes.number
  }

  CardsToBurnCardItem.propTypes = {
    pageNumber: PropTypes.number,
    index: PropTypes.number
  }

  const getUserCardObject = (imageNumber) => {
    const data = paginationObj
      ? Object.values(paginationObj.user).find((entry) => entry.name === imageNumber.toString())
      : {}
    return data
  }

  const Book = () => {
    if (!paginationObj || !paginationObjBurn || !currentAlbum) return <></>

    let qttyPages = 11
    let _className = 'hero__top__album'

    switch (currentAlbum) {
      case ALBUMS.ALBUM_INVENTORY:
        _className = 'hero__top__album'
        qttyPages = 11
        break
      case ALBUMS.ALBUM_120:
        _className = 'hero__top__album__120'
        qttyPages = 11
        break
      case ALBUMS.ALBUM_BURN_SELECTION:
        _className = 'hero__top__album'
        qttyPages = 10
        break
      case ALBUMS.ALBUM_TO_BURN:
        _className = 'hero__top__album__toburn'
        qttyPages = 5
        break
    }

    return (
      <FlipBook
        mainClassName={_className}
        startPage={currentPage}
        showClose={false}
        onCloseClick={undefined}
        pages={Array.from({ length: qttyPages }, (_, index) => (
          <PageContent
            page={paginationObj[`page${index + 1}`]}
            key={index}
            pageNumber={index + 1}
          />
        ))}
      />
    )
  }

  return (
    <>
      {!cardInfo && !albumInfo && !cardOffers && <Book />}

      {cardInfo && (
        <GammaCardInfo
          userCard={getUserCardObject(imageNumber)}
          handleOpenCardOffers={handleOpenCardOffers}
          handleFinishInfoCard={handleFinishInfoCard}
        />
      )}

      {albumInfo && (
        <GammaAlbumInfo
          userCard={getUserCardObject(imageNumber)}
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
  setCardInfoOpened: PropTypes.func,
  setAlbumInfoOpened: PropTypes.func
}

export default GammaAlbum
