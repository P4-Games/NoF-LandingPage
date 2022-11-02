import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Navbar () {
  return (
    <>
      <div className='navbar'>
        <div>
          <Link href='#Hero'>
            <Image
              src='/../public/nof-icon/logo-1.png'
              alt='/'
              width={125}
              height={50}
            />
          </Link>
        </div>
        <ul className='ul-items'>
          <li className='li-items'>
            <Link href='#Nosotros'>Nosotros</Link>
            <Link href='#Contacto'>Contacto</Link>
            <Link href='/Whitepaper'>Whitepaper</Link>
          </li>
        </ul>
        <div className='navbar__social'>
          <Link href='/'>
            <Image
              src='/../public/nof-icon/Discord-logo.png'
              alt='Discord-logo'
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
