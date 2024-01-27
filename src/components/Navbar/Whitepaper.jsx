import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

function Whitepaper({ defaultClassName = 'navbar__center__li__whitepaper' }) {
  const { t } = useTranslation()

  return (
    <Link href='https://number-one-fan.gitbook.io/doc/' target='_blank' rel='noreferrer'>
      <button className={defaultClassName}>{t('whitepaper')}</button>
    </Link>
  )
}

Whitepaper.propTypes = {
  defaultClassName: PropTypes.string
}

export default Whitepaper
