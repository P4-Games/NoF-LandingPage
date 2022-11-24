import React from 'react'
import Link from 'next/link'

function Links () {
  return (
    <Link
      href='https://discord.gg/4Bvp5bVmCz'
      spy='true'
      smooth='true'
      target='_blank'
      rel='noreferrer'
    >
      <div className='navbar__corner__social'>
        <></>
      </div>
    </Link>
  )
}

export default Links
