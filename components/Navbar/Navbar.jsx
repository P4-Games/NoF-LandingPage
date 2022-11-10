import React from 'react'
import Image from 'next/image'
import { Link } from 'react-scroll'
import Links from './Links.jsx'
import Whitepaper from './Whitepaper.jsx'

function Navbar () {
  return (
    <>
      <div className='navbar'>
        <div className='navbar__icon'>
          <Link to='Hero' spy smooth offset={-100} duration={500}>
            <div className='navbar__icon__nof'>
              <Image
                src='/../public/nof-icon/logo-1.png'
                alt='/'
                width={175}
                height={75}
              />
            </div>
          </Link>
          <Link to='Hero' spy smooth offset={-100} duration={500}>
            <div className='navbar__icon__coin'>
              <Image
                src='/../public/nof-icon/logo-coin.png'
                alt='/'
                width={60}
                height={60}
              />
            </div>
          </Link>
        </div>
        <ul className='ul-items'>
          <li className='li-items'>
            <Link to='Nosotros' spy smooth offset={-80} duration={500}>
              <Image
                src='/../public/nof-icon/nosotros.png'
                alt='About us'
                width={160}
                height={50}
              />
            </Link>
            <Link to='Contacto' spy smooth offset={-80} duration={500}>
              <Image
                src='/../public/nof-icon/contacto.png'
                alt='Contact'
                width={160}
                height={50}
              />
            </Link>
            <Whitepaper />
          </li>
        </ul>
        <Links />
      </div>
    </>
  )
}

export default Navbar
