import React from 'react'
import Link from 'next/link'

function Whitepaper () {
  return (
    <Link
      href='https://discord.gg/4Bvp5bVmCz'
      target='_blank'
      rel='noreferrer'
      spy='true' smooth='true' offset={-80} duration={500}
    >
      <button className='navbar__ul__li__btn'>
        Whitepaper
      </button>
    </Link>
  )
}

export default Whitepaper
