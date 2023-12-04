import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import Whitepaper from './Whitepaper.jsx'
import NofTown from './NofTown.jsx'
import AccountInfo from './AccountInfo.jsx'
import LanguageSelection from '../LanguageSelection'
import { useLayoutContext } from '../../hooks'

function Navbar() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [click, setClick] = useState(false)
  const { goToCollectionsPage } = useLayoutContext()
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const [showAccountInfo, setShowAccountInfo] = useState(false)
  const accountRef = useRef(null)

  const handleAudioClick = () => {
    setClick(!click)
    if (!click) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }

  const handleAccountClick = () => {
    setShowAccountInfo(!showAccountInfo)
  }

  const handleClickOutside = (event) => {
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setShowAccountInfo(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const MidButton = () => (
    <button
      onClick={() => {
        goToCollectionsPage()
      }}
      className='navbar__center__li__collections'
    >
      {t('collections')}
    </button>
  )

  const ButtonNof = () => (
    <div onClick={() => handleAudioClick()} className='navbar__left__nof'>
      <Link href='/'>
        <Image src={'/images/navbar/logo-1.png'} alt='nof' height='60' width='120' />
      </Link>
    </div>
  )

  const ButtonAudio = () => (
    <div onClick={() => handleAudioClick()} className='navbar__right__audio'>
      <Image
        src={`${'/images/navbar'}/${click ? 'soundOn' : 'soundOff'}.png`}
        alt='soundimg'
        height='60'
        width='60'
      />
    </div>
  )

  const ButtonAccount = () => (
    <div onClick={() => handleAccountClick()} className='navbar__right__coin'>
      <Image src={'/images/navbar/logo-coin.png'} alt='coin' height='60' width='60' />
    </div>
  )

  return (
    <>
      <div className='navbar'>
        <div className='navbar__left'>
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
          <div ref={accountRef} className='navbar__right__account'>
            <ButtonAccount onClick={handleAccountClick} />
            <AccountInfo showAccountInfo={showAccountInfo} setShowAccountInfo={setShowAccountInfo} />
          </div>
        </div>
      </div>
      <audio src={'/music/Dungeon.mp3'} ref={ref} loop />
    </>
  )
}

export default Navbar
