import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

function Whitepaper() {
  const { t } = useTranslation()

  return (
    <Link
      href='https://number-one-fan.gitbook.io/doc/'
      target='_blank'
      rel='noreferrer'
      // spy='true'
    >
      <button className='navbar__center__li__whitepaper'>{t('whitepaper')}</button>
    </Link>
  )
}

export default Whitepaper
