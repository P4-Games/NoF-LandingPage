import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

function NofTown({ defaultClassName = 'navbar__center__li__noftown' }) {
  return (
    <Link
      href='https://app.gather.town/app/YzUVkrf98XW8wz4a/Number%20One%20Fan'
      target='_blank'
      rel='noreferrer'
    >
      <button className={defaultClassName}>NoF Town</button>
    </Link>
  )
}

NofTown.propTypes = {
  defaultClassName: PropTypes.string
}

export default NofTown
