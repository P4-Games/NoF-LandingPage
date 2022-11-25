import React from 'react'
import { Link } from 'react-scroll'
import Links from './Links.jsx'
import Image from 'next/image'
// import Music from './Music.jsx'

import Whitepaper from './Whitepaper.jsx'

import Coin from './icons/logo-coin.png'
import Nof from './icons/logo-1.png'

function Navbar () {
  return (
    <header>
      <div className='navbar'>
        <div className='navbar__icon'>
          <Link
            to='Hero'
            spy='true'
            smooth='true'
            offset={-100}
            duration={500}
          >
            <div className='navbar__icon__coin'>
              <Image
                src={Coin}
                alt='Icon-Coin'
                width={210}
                height={380}
                layout='responsive'
              />
            </div>
          </Link>
          <Link
            to='Hero'
            spy='true'
            smooth='true'
            offset={-100}
            duration={500}
          >
            <div className='navbar__icon__nof'>
              <Image
                src={Nof}
                alt='NOF-Icon'
                width={246}
                height={102}
                layout='responsive'
              />
            </div>
          </Link>
        </div>
        <ul className='navbar__ul'>
          <li className='navbar__ul__li'>
            <Link
              to='Nosotros'
              spy='true'
              smooth='true'
              offset={-80}
              duration={500}
            >
              <button className='navbar__ul__li__nosotros'>
                Nosotros
              </button>
            </Link>
            <Link
              to='Contacto'
              spy='true'
              smooth='true'
              offset={-80}
              duration={500}
            >
              <button className='navbar__ul__li__contacto'>
                Contacto
              </button>
            </Link>
            <Whitepaper />
          </li>
        </ul>
        <div className='navbar__corner'>
          <div className='navbar__corner__audio'>
            <></>
          </div>
          <Links />
        </div>
      </div>
    </header>
  )
}

export default Navbar
