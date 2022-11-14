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
          <Link to='Hero' spy='true' smooth='true' offset={-100} duration={500}>
            <div className='navbar__icon__nof'>
              <Image
                src='/../public/nof-icon/logo-coin.png'
                alt='/'
                width={142}
                height={139}
              />
            </div>
          </Link>
          <Link to='Hero' spy='true' smooth='true' offset={-100} duration={500}>
            <div className='navbar__icon__coin'>
              <Image
                src='/../public/nof-icon/logo-1.png'
                alt='/'
                width={246}
                height={102}
              />
            </div>
          </Link>
        </div>
        <ul className='navbar__ul'>
          <li className='navbar__ul__li'>
            <Link to='Nosotros' spy='true' smooth='true' offset={-80} duration={500}>
              <button className='navbar__ul__li__btn'>
                Nosotros
              </button>
            </Link>
            <Link to='Contacto' spy='true' smooth='true' offset={-80} duration={500}>
              <button className='navbar__ul__li__btn'>
                Contacto
              </button>
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
