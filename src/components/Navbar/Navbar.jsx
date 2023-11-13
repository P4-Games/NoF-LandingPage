import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link as LinkScroll } from 'react-scroll'
import Link from 'next/link'
import Image from 'next/image'
import audio from './music/Dungeon.mp3'
import Whitepaper from './Whitepaper.jsx'
import NofTown from './NofTown.jsx'
import Coin from './images/logo-coin.png'
import Nof from './images/logo-1.png'
import SoundOn from './images/sound.png'
import SoundOff from './images/soundoff.png'
import Shopimg from './images/shop.png'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {useTranslation} from 'next-i18next'

const LanguageSelection = dynamic(
  () => import('../translation'),
  { ssr: false }
)

function Navbar ({
  goToCollections,
  alphaMidButton,
  walletAddress,
  setLoadAlbums,
  loadAlbums,
  setInventory,
  setCardInfo,
  cardInfo,
  handleBuyPackClick
}) {
  const {t} = useTranslation()
  const [midButton, setMidButton] = useState('')
  const [page, setPage] = useState('')
  const router = useRouter()
  const ref = useRef(null)
  const [click, setClick] = useState(false)
  
  useEffect(() => {
    setPage(window.history.state.url)
    window.history.state.url == '/alpha' ? setMidButton('Albums') : null
    window.history.state.url == '/gamma' ? setMidButton('Inventory') : null
  }, [])


  const audioHandleClick = () => {
    setClick(!click)
    if (!click) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }

  return (
    <>
      <div className='navbar'>
        <div className='navbar__icon'>
          <div className='hover' id='coin'>
            <Link href='/'>
              <Image alt='coin' src={Coin} id='coin' fill/>
            </Link>
          </div>
          <div className='hover' id='nof'>
            <Link href='/'>
              <Image alt='nof' src={Nof} fill/>
            </Link>
          </div>
        </div>
        <ul className='navbar__ul'>
          <li className='navbar__ul__li'>
            <NofTown />
            <LinkScroll
              to={t('contacto')}
            >
              <button
                onClick={() => {
                  if (page == '/alpha') {
                    alphaMidButton()
                    setLoadAlbums && setLoadAlbums(!loadAlbums)
                  } else if (page == '/gamma') {
                    if (cardInfo) {
                      setCardInfo(false)
                      setInventory(true)
                    } else setInventory(true)
                    // setLoadAlbums && setLoadAlbums(!loadAlbums);
                  } else {
                    goToCollections(5)
                    setLoadAlbums && setLoadAlbums(!loadAlbums)
                  }
                }}
                className='navbar__ul__li__contacto'
              >

                {t ? t('collections') : midButton}
              </button>
            </LinkScroll>
            <Whitepaper />
          </li>
        </ul>
        <div className='navbar__corner'>
          {(router?.pathname == '/gamma') && walletAddress &&
            <div onClick={() => handleBuyPackClick()} className='navbar__corner__audio'>
              <Image src={Shopimg} alt='shop' />
            </div>}
          <div onClick={() => audioHandleClick()} className='navbar__corner__audio'>
            {click
              ? (
                <Image src={SoundOn} alt='soundimg' />
                )
              : (
                <Image src={SoundOff} alt='soundimg' />
                )}
            <></>
          </div>
          <LanguageSelection

          />
        </div>
      </div>

      <audio src={audio} ref={ref} loop />
    </>
  )
}

Navbar.propTypes = {
  goToCollections: PropTypes.func,
  alphaMidButton: PropTypes.func,
  walletAddress: PropTypes.string,
  setLoadAlbums: PropTypes.func,
  loadAlbums: PropTypes.bool,
  setInventory: PropTypes.func,
  setCardInfo: PropTypes.func,
  cardInfo: PropTypes.bool,
  handleBuyPackClick: PropTypes.func
}

export default Navbar
