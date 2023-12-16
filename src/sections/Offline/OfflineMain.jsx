import React from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const OfflineMain = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className='offline'>
      <div className='offline_main_buttons_container'>
        <h5 className='offline_message'>{t('offline_msg')}</h5>
        <button
          className='offline_button offline_main_button'
          id='offline_action'
          onClick={() => router.push('/')}
        >
          {t('offline_action')}
        </button>
      </div>
    </div>
  )
}

export default OfflineMain
