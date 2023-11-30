import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import { useLayoutContext } from '../../hooks'

const FlipBook = ({ showClose, onCloseClick, pages, mainClassName = 'hero__top__album' }) => {
  const { bookRef, windowSize } = useLayoutContext()
  const [isClassesReplaced, setIsClassesReplaced] = useState(false)

  const CloseButton = () => (
    <div
      className='gamma_info_card_close'
      onClick={() => onCloseClick()}>
      X
    </div>
  )

  useEffect(() => {
    // Cambiar las clases después de un tiempo de carga simulado (0.5 mSeg),
    // es para evitar un efecto de parpadeo no deseado por htmlFlipBook
    const timer = setTimeout(() => {
      setIsClassesReplaced(true);
    }, 0.5)

    // Limpiar el temporizador para evitar fugas de memoria
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='hero__top'>
      <div className={mainClassName}>
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

          {pages.map((content, index) => (
            <div
              key={`page-${index}`}
              className={
                index % 2 === 0
                ? (isClassesReplaced ? 'hero__top__album__book__page' : '')
                : (isClassesReplaced ? 'hero__top__album__book__page0' : '')
              }
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
    </div>
  )
}

FlipBook.propTypes = {
  showClose: PropTypes.bool,
  onCloseClick: PropTypes.func,
  pages: PropTypes.array,
  mainClassName: PropTypes.string
}

export default FlipBook
