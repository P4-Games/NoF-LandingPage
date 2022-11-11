import React from 'react'
import Link from 'next/link'

function Button () {
  return (
    <Link href='https://opensea.io/collection/noftoken' target='_blank' rel='noreferrer'>
      <ul className='hero__bot__mar'>
        <li className='hero__bot__mar__ket'>
          <button className='hero__bot__mar__ket__btn'>
            Marketplace
          </button>
        </li>
      </ul>
    </Link>
  )
}

export default Button
