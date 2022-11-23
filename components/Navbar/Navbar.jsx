import React from 'react'
import { Link } from 'react-scroll'
import Links from './Links.jsx'
import Whitepaper from './Whitepaper.jsx'

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
              <></>
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
              <></>
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
        <div className='navbar__audio'>
          <></>
        </div>
        <Links />
      </div>
    </header>
  )
}

export default Navbar
