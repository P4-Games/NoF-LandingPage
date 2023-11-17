import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link as LinkScroll } from 'react-scroll'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {useTranslation} from 'next-i18next'
import Whitepaper from './Whitepaper.jsx'
import NofTown from './NofTown.jsx'
import LanguageSelection from '../translation'
import { useWeb3Context } from '../../hooks'

function Navbar ({
  goToCollections,
  alphaMidButton,
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
  const { walletAddress } = useWeb3Context()
  const [inHome, setInHome] = useState(true)
  const [showShop, setShowShop] = useState(false)

  useEffect(() => {
    setPage(window.history.state.url)
    setShowShop(router?.pathname == '/gamma' && walletAddress)
    setMidButton(t('collections'))

    if (window.history.state.url.endsWith('/alpha')) {
      setInHome(false)
      setMidButton('Albums')
    } else if (window.history.state.url.endsWith('/gamma')) {
      setInHome(false)
      setMidButton('Inventory')
    }
  }, [page, t])

  const audioHandleClick = () => {
    setClick(!click)
    if (!click) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }

  const MidButton = () => (
    <LinkScroll to={t('contacto')}>
      { (walletAddress || inHome) && <button
        onClick={() => {
          if (page.endsWith('/alpha')) {
            alphaMidButton()
          } else if (page.endsWith('/gamma')) {
            if (cardInfo) {
              setCardInfo(false)
              setInventory(true)
            } else { 
              setInventory(true)
            }
          } else {
            goToCollections(5)
          }
        }}
        className='navbar__ul__li__contacto'
      >
        {midButton}
      </button>}
    </LinkScroll>
  )

  const ButtonShop = () => (
    showShop ?
    <div onClick={() => handleBuyPackClick()} className='navbar__corner__shop'>
      <Image src={'/images/navbar/shop.png'} alt='shop' height='60' width='60'/>
    </div> : null
  )
    
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
          <li className={showShop ? 'navbar__ul__li__shop' : 'navbar__ul__li'}>
            <NofTown />
            <MidButton />
            <Whitepaper />
          </li>
        </ul>
        <div className='navbar__corner'>
          <ButtonShop />
          <div onClick={() => audioHandleClick()} className='navbar__corner__audio'>
            <Image 
              src={`${'/images/navbar'}/${click ? 'soundOn' : 'soundOff'}.png`}
              alt='soundimg'
              height='60'
              width='60'/>
          </div>
          <LanguageSelection

          />
        </div>
      </div>

      <audio src={'/music/Dungeon.mp3'} ref={ref} loop />
    </>
  )
}

Navbar.propTypes = {
  goToCollections: PropTypes.func,
  alphaMidButton: PropTypes.func,
  setInventory: PropTypes.func,
  setCardInfo: PropTypes.func,
  cardInfo: PropTypes.bool,
  handleBuyPackClick: PropTypes.func
}

export default Navbar
