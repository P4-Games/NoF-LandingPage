import React from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import { useLayoutContext } from '../../hooks'

const FlipBook = ({ showClose, onCloseClick, pagesContent }) => {
  const { bookRef, windowSize } = useLayoutContext()

  const CloseButton = () => (
    <div
      className='gamma_info_card_close'
      onClick={() => onCloseClick()}>
      X
    </div>
  )

  return (
    <div className='hero__top__album'>
      <HTMLFlipBook
        id='Book'
        size='stretch'
        width={360}
        height={500}
        minWidth={300}
        maxWidth={800}
        minHeight={350}
        maxHeight={600}
        autoSize
        ref={bookRef}
        usePortrait={windowSize.size}
        drawShadow={false}
        className= 'hero__top__album__book'
      >

        {pagesContent.map((content, index) => (
          <div
            key={`page-${index}`}
            className={index % 2 === 0 ? 'hero__top__album__book__page' : 'hero__top__album__book__page0'}
            data-density='hard'
            number={index + 1}
          >
            <div className='hero__top__album__book__page__page-content'>
              {index % 2 === 0 ? (
                <React.Fragment>
                 { content }
                </React.Fragment>
              ) : (
                <React.Fragment>
                  { showClose && <CloseButton /> }
                  { content }
                </React.Fragment>
              )}
            </div>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  )
}

FlipBook.propTypes = {
  showClose: PropTypes.bool,
  onCloseClick: PropTypes.func,
  pagesContent: PropTypes.array
}

export default FlipBook
