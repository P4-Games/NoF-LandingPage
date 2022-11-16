import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function Links () {
  return (
    <Link href='https://discord.gg/4Bvp5bVmCz' spy='true' smooth='true' target='_blank' rel='noreferrer'>
      <div className='navbar__social'>
        <Image
          src='/../public/nof-icon/Discord-logo.png'
          alt='Discord-logo'
          width={65}
          height={50}
        />
      </div>
    </Link>
  )
}

export default Links
