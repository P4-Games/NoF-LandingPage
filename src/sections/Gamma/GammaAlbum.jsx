import React from 'react'
import HTMLFlipBook from 'react-pageflip'
import pagination from '../../utils/placeholders'
import { storageUrlGamma } from '../../config'
import { useLayoutContext } from '../../hooks'

const GammaInventory = React.forwardRef((_, book) => {
  const { size } = useLayoutContext()

  const PageContext = (index, item, ) => (
      <div style={{ background: 'none' }} key={index} className='grid-item'>
        {pagination.user[item]?.stamped
          ? <img src={`${storageUrlGamma}/T1/${item}.png`} alt='img' />
          : <img src='/gamma/Nofy.png' alt='img' />}
        {!pagination.user[item]?.stamped && <div className='numbershirt'>{pagination.user[item]?.name}</div>}
      </div>
    )

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
      usePortrait={size}
      ref={book}
      className='hero__top__album__book'
    >
      <div
        className='hero__top__album__book__page'
        data-density='hard'
        number='1'
      >
        <div className='hero__top__album__book__page__page-content'>
          <div className='grid-wrapper'>
            {pagination.page1.map((item, index) => (
                <PageContext key={index} item={item} index={index} />
              ))}
          </div>
        </div>
      </div>
      <div
        className='hero__top__album__book__page0'
        data-density='hard'
        number='2'
      >
        <div className='grid-wrapperright'>
          {pagination.page2.map((item, index) => (
            <PageContext key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </HTMLFlipBook>
  )
})

export default GammaInventory
