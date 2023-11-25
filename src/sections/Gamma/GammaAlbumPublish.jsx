import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import Swal from 'sweetalert2'
import { FcCheckmark } from 'react-icons/fc'
import { storageUrlGamma } from '../../config'
import { useLayoutContext } from '../../hooks'
import CustomImage from '../../components/CustomImage'
import { useWeb3Context } from '../../hooks'
import {useTranslation} from 'next-i18next'
import { createOffer, getOffersByUserCounter, getOffersCounter } from '../../services/offers'

const GammaAlbumPublish =  (props) => {
  const {t} = useTranslation()
  const { paginationObj, cardNumberOffered, handleFinishPublish } = props
  const { gammaOffersContract } = useWeb3Context()
  const [ selectedCards, setSelectedCards ] = useState([])
  const { 
    startLoading, stopLoading , bookRef, windowSize, 
    updateShowButtons, updateButtonFunctions, ToggleShowDefaultButtons 
  } = useLayoutContext()

  useEffect(() => {
    ToggleShowDefaultButtons(false)
    updateShowButtons([false, true, true, false])
    updateButtonFunctions(1, handleConfirmClick)
    updateButtonFunctions(2, handleCancelClick)
  }, [handleConfirmClick, handleCancelClick])
    
  function emitInfo (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'info',
      showConfirmButton: true,
      timer: 5500
    })
  }
  
  function emitError (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: 5000
    })
  }

  function emitWarning (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'warning',
      showConfirmButton: true,
      timer: 5000
    })
  }
  
  const validToConfirm = () => {
    if (selectedCards.length === 0) {
      emitInfo (t('publish_offer_no_cards_selected'))
      return false
    }
    return true
  }
    
  const handleConfirmClick = useCallback(async () => {
    if (!validToConfirm) return
    
    try {
      startLoading()
      await createOffer(gammaOffersContract, cardNumberOffered, selectedCards)
      stopLoading()
      Swal.fire({
        title: '',
        text: t('confirmado'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      })
      ToggleShowDefaultButtons(true)
      handleFinishPublish(true)
    } catch (ex) {
      stopLoading()
      console.error(ex.message)
      if (ex.message == 'publish_offer_error_own_card_number')
        emitWarning(t('publish_offer_error_own_card_number'))
      else
        emitError(t('publish_offer_error'))
    }
  }, [gammaOffersContract, selectedCards])

  const handleCancelClick = useCallback(() => {
    ToggleShowDefaultButtons(true)
    handleFinishPublish()
  }, [])


  const handleCardClick = async (selectedCard) => {
    // const page = bookRef.current.pageFlip().getCurrentPageIndex()

    // console.log(selectedCards, selectedCards.length)

    if (parseInt(selectedCard) === parseInt(cardNumberOffered)) {
      emitWarning (t('publish_offer_error_own_card_number'))
    } else {
      if (selectedCards.includes(selectedCard)) {
        setSelectedCards(pevSelectedCards => pevSelectedCards.filter (card => card !== selectedCard))
      } else {
        if (selectedCards.length < 10) {
          setSelectedCards(pevSelectedCards => [...pevSelectedCards, selectedCard])
        }
      }
    }
    // bookRef.current.pageFlip().turnToPage(page)
  }

  const getStyle = (item) => (
    (paginationObj.user[item]?.quantity === 0 || !paginationObj.user[item]?.quantity)
      ?  'img_missing'
      : ''
  );

  const PageContentCard = ({ item, index }) => (
    <div 
      onClick={() => { handleCardClick(item)}}
      key={index}
      className='grid-item'
    >
      <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' className={getStyle(item)}  /> 
      { selectedCards.includes(item) && <FcCheckmark /> }
      { paginationObj.user[item]?.quantity > 1 && 
        <div className='quantity'>X:{paginationObj.user[item]?.quantity}</div>
      }
      { <div className='number'>{paginationObj.user[item]?.name || '0'}</div> }
    </div>
  )

  const PageContent = ({ page, pageNumber }) => {
    let divWrapperClassName = 'grid-wrapper-left'
    if (pageNumber % 2 === 0) { // par
      divWrapperClassName = 'grid-wrapper-right'
    }

    return (
      <div className={divWrapperClassName}>
        {page && page.map((item, index) => (<PageContentCard key={index} item={item} index={index} /> ))}
      </div>
    )
  }

  PageContent.propTypes = {
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

    /*
    const changePage = (pageNumber) => {
      setCurrentPage(pageNumber)
    }
    
    const onFlip = (data) => {
      setCurrentPage(data)
      console.log('Current page: ' + data, bookRef.current.pageFlip.current)
    }
    */
    if (!paginationObj)
      return (<></>)
    else
      return (
        <div className='hero__top'>
          <div className={'hero__top__album'}>
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
              // startAtPage={5} 
              // onChangePage={(e) => setCurrentPage(e.data)}
              // onFlip={(e) => onFlip(e.data)}
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
                    <PageContent key={index} page={paginationObj[`page${index + 1}`]} pageNumber={index + 1} />
                  </div>
                ))}
            </HTMLFlipBook>
          </div>
        </div>
      )
  }


  return (
    <Book />
  )
}

GammaAlbumPublish.propTypes = {
  paginationObj: PropTypes.object,
  cardNumberOffered: PropTypes.string,
  handleFinishInfoCard: PropTypes.func
}

export default GammaAlbumPublish
