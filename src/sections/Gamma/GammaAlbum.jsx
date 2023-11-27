import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import Swal from 'sweetalert2'
import { FcCheckmark } from 'react-icons/fc'
import { MdOutlineLocalOffer } from "react-icons/md"
import { storageUrlGamma } from '../../config'
import { useLayoutContext } from '../../hooks'
import CustomImage from '../../components/CustomImage'
import GammaCardInfo from './GammaCardInfo'
import GammaCardOffers from './GammaCardOffers'

import { getOffersByCardNumber /*, getOffers*/ } from '../../services/offers'
import { useWeb3Context } from '../../hooks'
import {useTranslation} from 'next-i18next'

const GammaAlbum =  (props) => {
  const {t} = useTranslation()
  const { paginationObj, showInventory, updateUserData, setCardInfoOpened } = props
  const { startLoading, stopLoading , bookRef, windowSize } = useLayoutContext()
  const [ cardInfo, setCardInfo ] = useState(false)
  const [ cardOffers, setCardOffers ] = useState(false)
  const [ imageNumber, setImageNumber ] = useState(0)
  const [offersObj, setOffersObj] = useState(null)
  const { gammaOffersContract, walletAddress } = useWeb3Context()
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
      console.log ({ex})
      emitError('error')
    }
  }
  
  useEffect(() => {
    fetchAlloffers()
  }, [])

  function emitError (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: 5500
    })
  }

  */

  function emitInfo (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'info',
      showConfirmButton: true,
      timer: 5500
    })
  }
  
  const handleOpenCardOffers = async () => {
    if(!offersObj || offersObj.length === 0) {
      const myOffer = paginationObj.user[imageNumber]?.offered
      if (myOffer) 
        emitInfo(t('offer_only_own_offer'))
      else
        emitInfo(t('offer_card_number_empty'))
      return
    }

    setCardInfo(false)
    setCardOffers(true)
    // setCardInfoOpened(true)
  }

  const handleFinishInfoCard = async (update = true) => {
    startLoading()
    if (update) {
      await updateUserData()
    }
    setCardInfo(false)
    setCardOffers(false)
    setCardInfoOpened(false)
    stopLoading()
  }

  const handleCardClick = async (cardNumber) => {
    setCardInfoOpened(true)
    startLoading()
    setImageNumber(cardNumber)
    setCardInfo(true)
    const offers = await getOffersByCardNumber(gammaOffersContract, cardNumber)

    // filtro mis ofertas
    if (offers && offers.length > 0) {
      // Saca mis ofertas 
      const filterMyoffes = offers.filter(item => item.offerWallet !== walletAddress)
      setOffersObj(filterMyoffes)
    }
    stopLoading()
  }
   
  const getStyle = (item) => (
    (paginationObj.user[item]?.quantity === 0 || !paginationObj.user[item]?.quantity)
      ? { filter: 'grayscale(1)' }
      : {}
  );
  
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

  const PageContentInventory = ({ page, pageNumber}) => {

    let divWrapperClassName = 'grid-wrapper-left'
    if (pageNumber % 2 === 0) { // par
      divWrapperClassName = 'grid-wrapper-right'
    }

    return (
      <div className={divWrapperClassName}>
        {page && page.map((item, index) => (
          <div 
            onClick={() => { 
              handleCardClick(item)
            }}
            style={getStyle(item)} 
            key={index}
            className='grid-item'
          >
            <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' /> 
            { paginationObj.user[item]?.stamped && <FcCheckmark /> }
            { paginationObj.user[item]?.offered && <MdOutlineLocalOffer className = 'image-my-offer' /> }
            {/* allOffers &&  (getCardNumberOffersQtty(item)) && <Offer2 className = 'image-other-offer' /> */}

            { paginationObj.user[item]?.quantity > 1 && 
              <div className='quantity'>X:{paginationObj.user[item]?.quantity}</div>
            }

            <div className='number'>{paginationObj.user[item]?.name || '0'}</div>
          </div>))
        }
      </div>
    )
  }

  const PageContentAlbum = ({ page, pageNumber}) => {
    let divWrapperClassName = 'grid-wrapper-left-album'
    if (pageNumber % 2 === 0) { // par
      divWrapperClassName = 'grid-wrapper-right-album'
    }

    return (
      <div className={divWrapperClassName}>
        {page && page.map((item, index) => (
          <div 
            style={{ background: 'none' }}
            key={index}
            className='grid-item'
          >
            { paginationObj.user[item]?.stamped
              ? <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
              : <CustomImage src='/images/gamma/Nofy.png' alt='img' /> 
            }
          </div>))
        }
      </div>
    )
  }

  const PageContent = ({ page, pageNumber }) => (
    showInventory
      ? <PageContentInventory page={page} pageNumber={pageNumber}/>
      : <PageContentAlbum page={page} pageNumber={pageNumber}/>
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

  const Book = () => {
    const [isClassesReplaced, setIsClassesReplaced] = useState(false)
    useEffect(() => {
      // Cambiar las clases después de un tiempo de carga simulado (0.5 mSeg),
      // es para evitar un efecto de parpadeo no deseado por htmlFlipBook
      const timer = setTimeout(() => {
        setIsClassesReplaced(true);
      }, 0.5)
  
      // Limpiar el temporizador para evitar fugas de memoria
      return () => clearTimeout(timer)
    }, [])

    if (!paginationObj)
      return (<></>)
    else
      return (
        <div className='hero__top'>
          <div className={showInventory ? 'hero__top__album' : 'hero__top__album__gamma'}>
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
              className='hero__top__album__book'
            >
              {Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className={
                        index % 2 === 0
                        ? (isClassesReplaced ? 'hero__top__album__book__page' : '')
                        : (isClassesReplaced ? 'hero__top__album__book__page0' : '')
                    }
                    data-density='hard'
                    number={index + 1}
                  >
                    <PageContent page={paginationObj[`page${index + 1}`]} pageNumber={index + 1} />
                  </div>
                ))}
            </HTMLFlipBook>
          </div>
        </div>
      )
  }

  const getuserCardObject = (imageNumber) => {
    const data = paginationObj 
              ? Object.values(paginationObj.user).find(entry => entry.name === imageNumber.toString())
              : {}
    // console.log('getuserCardObject', imageNumber, data)
    return data
  }


  return (
    <>
      {!cardInfo && !cardOffers && <Book />}
      
      {cardInfo &&
        <GammaCardInfo 
          paginationObj={paginationObj}  
          userCard={getuserCardObject(imageNumber)}
          handleOpenCardOffers={handleOpenCardOffers}
          handleFinishInfoCard={handleFinishInfoCard}
        />
      }

      {cardOffers && offersObj && offersObj.length > 0 &&
        <GammaCardOffers
          paginationObj={paginationObj}
          offerData={offersObj}
          cardNumber={imageNumber}
          handleFinishInfoCard={handleFinishInfoCard}
        />
      }
    </>
  )
}

GammaAlbum.propTypes = {
  paginationObj: PropTypes.object,
  showInventory: PropTypes.bool,
  updateUserData: PropTypes.func,
  setCardInfoOpened: PropTypes.func
}

export default GammaAlbum
