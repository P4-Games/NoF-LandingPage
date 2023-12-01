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
      className='navbar__center__li__collections'>
      {t('collections')}
    </button>
  )

  const ButtonCoin = () => (
    <div className='navbar__left__coin'>
      <Link href='/'>
        <Image 
          src={'/images/navbar/logo-coin.png'}
          alt='coin' 
          height='60'width='60'
        />
      </Link>      
    </div>
  )

  const ButtonNof = () => (
    <div onClick={() => audioHandleClick()} className='navbar__left__nof'>
      <Link href='/'>
        <Image 
          src={'/images/navbar/logo-1.png'}
          alt='nof' 
          height='60' width='120'
        />
      </Link>
    </div>
  )

  const ButtonAudio = () => (
    <div onClick={() => audioHandleClick()} className='navbar__right__audio'>
      <Image 
        src={`${'/images/navbar'}/${click ? 'soundOn' : 'soundOff'}.png`}
        alt='soundimg'
        height='60'
        width='60'/>
    </div>
  )
   
  return (
    <>
      <div className='navbar'>
        <div className='navbar__left'>
          <ButtonCoin />
          <ButtonNof />
        </div>
        <ul className='navbar__center'>
          <li className={'navbar__center__li'}>
            <NofTown />
            {isHomePage && <MidButton />}
            <Whitepaper />
          </li>
        </ul>
        <div className='navbar__right'>
          <ButtonAudio />
          <LanguageSelection />
        </div>
      </div>
      <audio src={'/music/Dungeon.mp3'} ref={ref} loop />
    </>
  )
}

export default Navbar
