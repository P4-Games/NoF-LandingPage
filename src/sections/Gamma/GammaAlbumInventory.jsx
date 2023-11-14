import React from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import { FcCheckmark } from 'react-icons/fc'
import gammaCardsPages from './gammaCardsPages'
import { storageUrlGamma } from '../../config'
import { useLayoutContext } from '../../hooks'

const GammaAlbumInventory = React.forwardRef((props, book) => {
  const { paginationObj, setImageNumber, setCardInfo } = props
  const { size } = useLayoutContext()

  const getStyle = (item, pageNumber) => {
    if (pageNumber === 1) {
      return (paginationObj.user[item]?.quantity == 0 || !paginationObj.user[item]?.quantity) 
        ? { filter: 'grayscale(1)' } 
        : {} 
    } else {
      return gammaCardsPages.user[item]?.quantity == 0 ? { filter: 'grayscale(1)' } : {}
    }
  }

  const PageContent = ({ page, pageNumber}) => {
    let divWrapperClassName = 'grid-wrapper'

    if (pageNumber % 2 === 0) { // par
      divWrapperClassName = 'grid-wrapperright'
    }

    return (
      <div className={divWrapperClassName}>
        {page.map((item, index) => (
          <div 
            onClick={() => { setCardInfo(true), setImageNumber(item) }}
            style={getStyle(item, pageNumber)} 
            key={index}
            className='grid-item'
          >
            <img src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
            {paginationObj.user[item]?.stamped && <FcCheckmark />}
            <div className='number'>{paginationObj.user[item]?.name}</div>
            {
              paginationObj.user[item]?.quantity != 0 && 
              paginationObj.user[item]?.quantity != 1 &&
              <div className='quantity'>X:{paginationObj.user[item]?.quantity}</div>
            }
          </div>))
        }
      </div>
    )
  }

  return paginationObj && paginationObj.page1
    ? (
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
        usePortrait={size}
        ref={book}
        className='hero__top__album__book'
      >
        <div
          className='hero__top__album__book__page' data-density='hard' number='1'>
          <div className='hero__top__album__book__page__page-content'>
            <PageContent page={paginationObj.page1} pageNumber={1} />
          </div>
        </div>
        <div className='hero__top__album__book__page0' data-density='hard' number='2'>
            <PageContent page={paginationObj.page2} pageNumber={2} />
        </div>

        <div className='hero__top__album__book__page' data-density='hard' number='3'>
          <PageContent page={paginationObj.page3} pageNumber={3} />
        </div>
        
        <div className='hero__top__album__book__page0' data-density='hard' number='4'>
            <PageContent page={paginationObj.page4} pageNumber={4} />
        </div>
  
        <div className='hero__top__album__book__page' data-density='hard' number='5'>
            <PageContent page={paginationObj.page5} pageNumber={5} />
        </div>
  
        <div className='hero__top__album__book__page0' data-density='hard' number='6'>
            <PageContent page={paginationObj.page6} pageNumber={6} />
        </div>
  
        <div className='hero__top__album__book__page' data-density='hard' number='7'>
            <PageContent page={paginationObj.page7} pageNumber={7} />
        </div>
  
        <div className='hero__top__album__book__page0' data-density='hard' number='8'>
            <PageContent page={paginationObj.page8} pageNumber={8} />
        </div>
  
        <div className='hero__top__album__book__page' data-density='hard' number='9'>
            <PageContent page={paginationObj.page9} pageNumber={9}/>
        </div>
  
        <div className='hero__top__album__book__page0' data-density='hard' number='10'>
            <PageContent page={paginationObj.page10} pageNumber={10} />
        </div>
      </HTMLFlipBook>
      ) : null
})

GammaAlbumInventory.propTypes = {
  paginationObj: PropTypes.object,
  setImageNumber: PropTypes.func,
  setCardInfo: PropTypes.func
}

export default GammaAlbumInventory
