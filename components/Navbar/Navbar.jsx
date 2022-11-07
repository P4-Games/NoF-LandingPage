import React from 'react'
import Image from 'next/image'
import { Link } from 'react-scroll'

function Navbar () {
  return (
    <>
      <div className='navbar'>
        <div className='navbar__icon'>
          <Link to='Hero' spy smooth offset={-100} duration={500}>
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
            <Link to='Nosotros' spy smooth offset={-80} duration={500}>Nosotros</Link>
            <Link to='Contacto' spy smooth offset={-80} duration={500}>Contactos</Link>
            <Link to='whitepaper' spy smooth offset={-80} duration={500}>Whitepaper</Link>
          </li>
        </ul>
        <div className='navbar__social'>
          <Link href='https://discord.gg/VubzQ9rq'>
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
