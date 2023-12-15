import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import Whitepaper from './Whitepaper.jsx'
import NofTown from './NofTown.jsx'
import AccountInfo from './AccountInfo.jsx'
import NotificationInfo from './NotificationInfo.jsx'
import LanguageSelection from '../LanguageSelection'
import { useLayoutContext, useWeb3Context, useNotificationContext } from '../../hooks'

function Navbar() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [click, setClick] = useState(false)
  const { goToCollectionsPage } = useLayoutContext()
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const [showAccountInfo, setShowAccountInfo] = useState(false)
  const [showNotificationInfo, setShowNotificationInfo] = useState(false)
  const [notificationsNbr, setNotificationsNbr] = useState(0)
  const [notificationsNbrClass, setNotificationsNbrClass] = useState('notification__badge__1')
  const { notifications, getNotificationsByUser } = useNotificationContext()
  const { walletAddress } = useWeb3Context()

  const accountRef = useRef(null)
  const notificationRef = useRef(null)

  const handleAudioClick = () => {
    setClick(!click)
    if (!click) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }

  const handleNotificationClick = () => {
    setShowNotificationInfo(!showNotificationInfo)
  }

  const handleAccountClick = () => {
    setShowAccountInfo(!showAccountInfo)
  }

  const handleClickOutside = (event) => {
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setShowAccountInfo(false)
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotificationInfo(false)
    }
  }

  useEffect(() => {
    const notif = getNotificationsByUser(walletAddress) || []
    const unreadNotifications = notif.filter((notification) => !notification.read)
    setNotificationsNbr(unreadNotifications.length)
    setNotificationsNbrClass(
      unreadNotifications.length > 9 ? 'notification__badge__2' : 'notification__badge__1'
    )
    // setNotificationsNbr(20)
    // setNotificationsNbrClass(20 > 9 ? 'notification__badge__2' : 'notification__badge__1')
  }, [notifications, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

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

  const ButtonNotification = () => (
    <React.Fragment>
      <div onClick={() => handleNotificationClick()} className='navbar__right__notif'>
        {notificationsNbr > 0 && <div className={notificationsNbrClass}>{notificationsNbr}</div>}
        <Image src={'/images/notifications/message2.png'} alt='coin' height='60' width='60' />
      </div>
    </React.Fragment>
  )

  const ButtonAccount = () => (
    <div onClick={() => handleAccountClick()} className='navbar__right__account'>
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
          <div ref={notificationRef} className='navbar__right__account'>
            <ButtonNotification onClick={handleNotificationClick} />
            <NotificationInfo
              showNotificationInfo={showNotificationInfo}
              setShowNotificationInfo={setShowNotificationInfo}
            />
          </div>
          <div ref={accountRef} className='navbar__right__account'>
            <ButtonAccount onClick={handleAccountClick} />
            <AccountInfo
              showAccountInfo={showAccountInfo}
              setShowAccountInfo={setShowAccountInfo}
            />
          </div>
        </div>
      </div>
      <audio src={'/music/Dungeon.mp3'} ref={ref} loop />
    </>
  )
}

export default Navbar
