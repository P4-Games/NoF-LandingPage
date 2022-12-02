import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import Links from './Links.jsx'
import Image from 'next/image'
import audio from './music/Dungeon.mp3'
import Whitepaper from './Whitepaper.jsx'
import Coin from './icons/logo-coin.png'
import Nof from './icons/logo-1.png'
import SoundOn from './icons/sound.png'
import SoundOff from './icons/soundoff.png'
function Navbar() {
  const ref = useRef(null);
  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click);
    if (!click) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  };
  return (
    <>
      <div className='navbar'>
        <div className='navbar__icon'>
          <div id='coin'>
            <Image src={Coin} id='coin' layout='fill' />
          </div>
          <div id='nof'>
            <Image src={Nof} alt="" layout='fill' />
          </div>
        </div>
        <ul className='navbar__ul'>
          <li className='navbar__ul__li'>
            <Link
              to='Nosotros'
              // spy='true'
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
              // spy='true'
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
          <div onClick={() => handleClick()} className='navbar__corner__audio'>
            {/* <Image src={SoundOn} alt="" /> */}
            {click ?
              <Image src={SoundOn} alt="soundimg" />
              :
              <Image src={SoundOff} alt="soundimg" />}
            <></>
          </div>
          <Links />
        </div>
      </div>


      <audio src={audio} ref={ref} loop />
    </>
  )
}

export default Navbar
