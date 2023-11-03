import React, { useState, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip'
import pagination from '../../../artifacts/utils/placeholders'

const GammaInventory = React.forwardRef((props, book) => {
  const [size, setSize] = useState(false)
  useEffect(() => {
    if (window.innerWidth < 600) {
      setSize(true)
    } else {
      setSize(false)
    }
    const updateMedia = () => {
      if (window.innerWidth < 600) {
        setSize(true)
      } else {
        setSize(false)
      }
    }
    window.addEventListener('resize', updateMedia)
    return () => window.removeEventListener('resize', updateMedia)
  }, []) 

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
                <div style={{ background: 'none' }} key={index} className='grid-item'>
                  {pagination.user[item]?.stamped
                    ? <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt='img' />
                    : <img src='assets/gamma/Nofy.png' alt='img' />}
                  {!pagination.user[item]?.stamped && <div className='numbershirt'>{pagination.user[item]?.name}</div>}
                </div>
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
              <div style={{ background: 'none' }} key={index} className='grid-item'>
                {pagination.user[item]?.stamped
                  ? <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt='img' />
                  : <img src='assets/gamma/Nofy.png' alt='img' />}
                {!pagination.user[item]?.stamped && <div className='numbershirt'>{pagination.user[item]?.name}</div>}
              </div>
            ))}
        </div>
      </div>
      {/* 
      <div
        className='hero__top__album__book__page'
        data-density='hard'
        number='3'
      >
        <div className="hero__top__album__book__page__page-content">
                    Prueba3
                </div> 
      </div>*/}
    </HTMLFlipBook>
  )
})

export default GammaInventory
