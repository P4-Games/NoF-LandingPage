import React from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import {useTranslation} from 'next-i18next'
import { useLayoutContext } from '../../hooks'

const Rules = ({ type, setShowRules }) => { 
  const { bookRef, windowSize } = useLayoutContext()
  const {t} = useTranslation()

  const ContentPageLeft = () => (
    type === 'gamma' ?
     (
      <div className='rules_text_left'>
        <p>{t('rules_gamma_left_text_1')}</p>
        <p>{t('rules_gamma_left_text_2')}</p>
        <p>{t('rules_gamma_left_text_3')}</p>
        <p>{t('rules_gamma_left_text_4')}</p>
      </div>
    )
    :
    (
      <div className='rules_text_left'>
        <p>{t('rules_alpha_left_text_1')}</p>
        <p>{t('rules_alpha_left_text_2')}</p>
        <p>{t('rules_alpha_left_text_3')}</p>
        <p>{t('rules_alpha_left_text_4')}</p>
        <p>{t('rules_alpha_left_text_5')}</p>
      </div>
    ) 
  )

  const ContentPageRight = () => (
    type === 'gamma' ?
     (
      <div className='rules_text_right'>
        <p>{t('rules_gamma_right_text_1')}</p>
        <p>{t('rules_gamma_right_text_2')}</p>
        <p>{t('rules_gamma_right_text_3')}</p>
        <p>{t('rules_gamma_right_text_4')}</p>
      </div>
    )
    :
    (
      <div className='rules_text_right'>
        <p>{t('rules_alpha_right_text_1')}</p>
        <p>{t('rules_alpha_right_text_2')}</p>
        <p>{t('rules_alpha_right_text_3')}</p>
        <p>{t('rules_alpha_right_text_4')}</p>
        <p>{t('rules_alpha_right_text_5')}</p>
      </div>
    ) 
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
        <div
          className='hero__top__album__book__page'
          data-density='hard'
          number='1'
        >
          <div className='hero__top__album__book__page__page-content'>
            <h3> {t ? t('reglas') : ''}</h3>
            <ContentPageLeft />
          </div>
        </div>
        <div
          className='hero__top__album__book__page0'
          data-density='hard'
          number='2'
        >
          <div className='hero__top__album__book__page__page-content'>
            <div
              className='gamma_info_card_close'
              onClick={() => setShowRules(false)}
            >
              X
            </div>
            <div className='rules_text_right'>
            <ContentPageRight />
            </div>
          </div>
        </div>
        
      </HTMLFlipBook>
    </div>
  )
}

Rules.propTypes = {
  type: PropTypes.string,
  setShowRules: PropTypes.func
}

export default Rules
