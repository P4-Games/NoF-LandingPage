import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'
import FlipBook from '../../components/FlipBook'

const Rules = ({ type, setShowRules }) => {
  const { t } = useTranslation()

  const ContentPageLeft = () => (
    <>
      <h3> {t ? t('reglas') : ''}</h3>
      {type === 'gamma' ? (
        <div className='rules_text_left'>
          <p>{t('rules_gamma_left_text_1')}</p>
          <p>{t('rules_gamma_left_text_2')}</p>
          <p>{t('rules_gamma_left_text_3')}</p>
          <p>{t('rules_gamma_left_text_4')}</p>
        </div>
      ) : (
        <div className='rules_text_left'>
          <p>{t('rules_alpha_left_text_1')}</p>
          <p>{t('rules_alpha_left_text_2')}</p>
          <p>{t('rules_alpha_left_text_3')}</p>
          <p>{t('rules_alpha_left_text_4')}</p>
          <p>{t('rules_alpha_left_text_5')}</p>
        </div>
      )}
    </>
  )

  const ContentPageRight = () =>
    type === 'gamma' ? (
      <div className='rules_text_right'>
        <p>{t('rules_gamma_right_text_1')}</p>
        <p>{t('rules_gamma_right_text_2')}</p>
        <p>{t('rules_gamma_right_text_3')}</p>
        <p>{t('rules_gamma_right_text_4')}</p>
      </div>
    ) : (
      <div className='rules_text_right'>
        <p>{t('rules_alpha_right_text_1')}</p>
        <p>{t('rules_alpha_right_text_2')}</p>
        <p>{t('rules_alpha_right_text_3')}</p>
        <p>{t('rules_alpha_right_text_4')}</p>
        <p>{t('rules_alpha_right_text_5')}</p>
      </div>
    )

  const handleCloseButton = () => {
    setShowRules(false)
  }

  return (
    <FlipBook
      showClose={true}
      onCloseClick={handleCloseButton}
      pages={[<ContentPageLeft key={'page-1'} />, <ContentPageRight key={'page-1'} />]}
    />
  )
}

Rules.propTypes = {
  type: PropTypes.string,
  setShowRules: PropTypes.func
}

export default Rules
