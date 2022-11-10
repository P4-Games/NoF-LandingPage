import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function Whitepaper () {
  return (
    <Link
      href='https://discord.gg/4Bvp5bVmCz'
      target='_blank'
      rel='noreferrer'
      spy smooth offset={-80} duration={500}
    >
      <Image
        src='/../public/nof-icon/whitepaper.png'
        alt='Whitepaper'
        width={190}
        height={50}
      />
    </Link>
  )
}

export default Whitepaper
