import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import { FcCheckmark } from 'react-icons/fc'
import { MdOutlineLocalOffer } from "react-icons/md"
import { storageUrlGamma } from '../../config'
import { useLayoutContext } from '../../hooks'
import CustomImage from '../../components/CustomImage'

const GammaAlbum =  (props) => {
  const { paginationObj, setImageNumber, setCardInfo, showInventory } = props
  const { bookRef, windowSize } = useLayoutContext()

  const getStyle = (item) => (
    (paginationObj.user[item]?.quantity === 0 || !paginationObj.user[item]?.quantity)
      ? { filter: 'grayscale(1)' }
      : {}
  );
  
  const PageContentInventory = ({ page, pageNumber}) => {
    let divWrapperClassName = 'grid-wrapper-left'
    if (pageNumber % 2 === 0) { // par
      divWrapperClassName = 'grid-wrapper-right'
    }

    return (
      <div className={divWrapperClassName}>
        {page && page.map((item, index) => (
          <div 
            onClick={() => { setCardInfo(true), setImageNumber(item) }}
            style={getStyle(item)} 
            key={index}
            className='grid-item'
          >
            <CustomImage src={`${storageUrlGamma}/T1/${item}.png`} alt='img' /> 
            { paginationObj.user[item]?.stamped && <FcCheckmark /> }
            { paginationObj.user[item]?.offered && <MdOutlineLocalOffer className = 'image-offered ' /> }

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
  );

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
      )
  }

  return (
    windowSize?.mobile 
    ?  <div className='hero__top__album'><Book /> </div>
    : <Book />
  )

}

GammaAlbum.propTypes = {
  paginationObj: PropTypes.object,
  setImageNumber: PropTypes.func,
  setCardInfo: PropTypes.func,
  showInventory: PropTypes.bool
}

export default React.memo(GammaAlbum)
