import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useTranslation} from 'next-i18next'
import { useRouter } from 'next/router'

import Whitepaper from './Whitepaper.jsx'
import NofTown from './NofTown.jsx'
import LanguageSelection from '../LanguageSelection'
import { useLayoutContext } from '../../hooks'

function Navbar () {
  const {t} = useTranslation()
  const ref = useRef(null)
  const [click, setClick] = useState(false)
  const { goToCollectionsPage } = useLayoutContext()
  const router = useRouter()
  const isHomePage = router.pathname === '/'


  const audioHandleClick = () => {
    setClick(!click)
    if (!click) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }

  const MidButton = () => (
    <button 
      onClick={() => {goToCollectionsPage()}}
      className='navbar__ul__li__collections'>
      {t('collections')}
    </button>
  )

  const ButtonAudio = () => (
    <div onClick={() => audioHandleClick()} className='navbar__corner__audio'>
      <Image 
        src={`${'/images/navbar'}/${click ? 'soundOn' : 'soundOff'}.png`}
        alt='soundimg'
        height='60'
        width='60'/>
    </div>
  )

  /*
  const ButtonShop = () => (
    showShop ?
    <div onClick={() => handleBuyPackClick()} className='navbar__corner__shop'>
      <Image src={'/images/navbar/shop.png'} alt='shop' height='60' width='60'/>
    </div> : null
  )
  */
    
  return (
    <>
      <div className='navbar'>
        <div className='navbar__icon'>
          <div className='hover' id='coin'>
            <Link href='/'>
              <Image alt='coin' src={'/images/navbar/logo-coin.png'} id='coin' fill/>
            </Link>
          </div>
          <div className='hover' id='nof'>
            <Link href='/'>
              <Image alt='nof' src={'/images/navbar/logo-1.png'} fill/>
            </Link>
          </div>
        </div>
        <ul className='navbar__ul'>
          {/*<li className={showShop ? 'navbar__ul__li__shop' : 'navbar__ul__li'}>*/}
          <li className={'navbar__ul__li'}>
            <NofTown />
            {isHomePage && <MidButton />}
            <Whitepaper />
          </li>
        </ul>
        <div className='navbar__corner'>
          {/*<ButtonShop />*/}
          <ButtonAudio />
          <LanguageSelection />
        </div>
      </div>
      <audio src={'/music/Dungeon.mp3'} ref={ref} loop />
    </>
  )
}

export default Navbar
