/* eslint-disable react/no-unknown-property */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import HTMLFlipBook from './HtmlFlipBook'
import { useLayoutContext } from '../../hooks'

const FlipBook = (props) => {
  const {
    showClose,
    onCloseClick,
    pages,
    startPage = 0,
    mainClassName = 'hero__top__album',
    disableFlipByClick = true
  } = props

  const { windowSize, bookRef, turnPrevPage } = useLayoutContext()
  const [isClassesReplaced, setIsClassesReplaced] = useState(false)

  const CloseButton = () => (
    <div className='gamma_info_card_close' onClick={() => onCloseClick()}>
      X
    </div>
  )

  useEffect(() => {
    // Cambiar las clases después de un tiempo de carga simulado (0.5 mSeg),
    // es para evitar un efecto de parpadeo no deseado por htmlFlipBook
    const timer = setTimeout(() => {
      setIsClassesReplaced(true)
    }, 0.5)

    // Limpiar el temporizador para evitar fugas de memoria
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='hero__top'>
      <div className={mainClassName}>
        {/* just a hack to allow click-left in book required by flip-book issue */}
        <div onClick={() => turnPrevPage()} className='hero__top__album__book__button__top__hook' />
        <HTMLFlipBook
          id='Book'
          size='stretch'
          width={360}
          height={500}
          minWidth={300}
          maxWidth={800}
          minHeight={350}
          maxHeight={600}
          swipeDistance={30}
          showPageCorners
          autoSize
          startPage={startPage}
          ref={bookRef}
          usePortrait={windowSize.size}
          drawShadow={false}
          disableFlipByClick={disableFlipByClick}
          className='hero__top__album__book'
        >
          {pages.map((content, index) => (
            <div
              key={`page-${index}`}
              className={
                index % 2 === 0
                  ? isClassesReplaced
                    ? 'hero__top__album__book__page'
                    : ''
                  : isClassesReplaced
                    ? 'hero__top__album__book__page0'
                    : ''
              }
              data-density='hard'
              number={index + 1}
            >
              <div className='hero__top__album__book__page__page-content'>
                {index % 2 === 0 ? (
                  <>{content}</>
                ) : (
                  <>
                    {showClose && <CloseButton />}
                    {content}
                  </>
                )}
              </div>
            </div>
          ))}
        </HTMLFlipBook>
        {/* just a hack to allow click-left in book required by flip-book issue */}
        <div
          onClick={() => turnPrevPage()}
          className='hero__top__album__book__button__bottom__hook'
        />
      </div>
    </div>
  )
}

FlipBook.propTypes = {
  showClose: PropTypes.bool,
  onCloseClick: PropTypes.func,
  pages: PropTypes.array,
  mainClassName: PropTypes.string,
  startPage: PropTypes.number,
  disableFlipByClick: PropTypes.bool
}

export default FlipBook
