/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable import/no-unresolved */
import 'swiper/css'
import 'swiper/css/bundle'
import Link from 'next/link'
import Image from 'next/image'
import 'swiper/css/effect-cards'
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectCards } from 'swiper'

import Friends from './Friends.json'
import Profiles from './Profiles.json'
import { useLayoutContext } from '../../hooks'
import FlipBook from '../../components/FlipBook'
import NofTown from '../../components/Navbar/NofTown'
import Whitepaper from '../../components/Navbar/Whitepaper'

const Main = () => {
  const { windowSize, ToggleShowDefaultButtons, updateShowButtons } = useLayoutContext()
  const { t } = useTranslation()

  useEffect(() => {
    ToggleShowDefaultButtons(true)
    updateShowButtons([true, true, true, true])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const SwiperComp = () => (
    <div className='hero__top__swiper'>
      <Swiper
        effect='cards'
        grabCursor
        modules={[EffectCards, Autoplay, Pagination]}
        loop
        autoplay={{
          delay: 2000,
          disableOnInteraction: false
        }}
        pagination={{
          el: '.pagination',
          clickable: true
        }}
        className='hero__top__swiper__slide'
      >
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
        <SwiperSlide />
      </Swiper>
      <div className='pagination' />
    </div>
  )

  const Page1 = () => (
    <>
      <h3> {t ? t('WELCOME') : ''}</h3>
      <div className='nofi_container'>
        <div className='nofimg'>
          <Image src='/images/hero/logo-nof.gif' alt='text box' fill />
        </div>
      </div>
      <div className='coin_container'>
        <div className='coinimg'>
          <Image src='/images/hero/oro.png' alt='text box' fill />
        </div>
        <div className='coinimg2'>
          <Image src='/images/hero/plata.png' alt='text box' fill />
        </div>
        <div className='coinimg3'>
          <Image src='/images/hero/bronce.png' alt='text box' fill />
        </div>
      </div>

      <p className='hero__top__album__book__page__text2'>{t ? t('number one fan') : ''}</p>
      <div className='bookflip_container'>
        <div className='bookimg'>
          <Image src='/images/hero/book_flip.gif' alt='text box' fill />
        </div>
      </div>
    </>
  )

  const Page2 = () => (
    <>
      <p className='hero__top__album__book__page__text2'>{t ? t('our goal') : ''}</p>
      <div className='book_container'>
        <Image src='/images/hero/book-menu-1.png' alt='text box' fill />
      </div>
      <p className='hero__top__album__book__page__text2'>{t ? t('sustainable game') : ''}</p>
    </>
  )

  const Page3 = () => (
    <>
      <h3> {t ? t('CARDS') : ''}</h3>
      <p className='hero__top__album__book__page__text2'>{t ? t('our cards') : ''}</p>
      <div className='nof_container'>
        <div className='nof1'>
          <div className='nofimg'>
            <Image src='/images/hero/n.png' alt='N image' fill />
          </div>
          <div className='noftitle'>
            <p>{t ? t('gold') : ''}</p>
          </div>
        </div>
        <div className='nof2'>
          <div className='nofimg'>
            <Image src='/images/hero/o.png' alt='O image' fill />
          </div>
          <div className='noftitle'>
            <p>{t ? t('silver') : ''}</p>
          </div>
        </div>
        <div className='nof3'>
          <div className='nofimg'>
            <Image src='/images/hero/f.png' alt='F image' fill />
          </div>
          <div className='noftitle'>
            <p>{t ? t('bronze') : ''}</p>
          </div>
        </div>
      </div>
      <p className='hero__top__album__book__page__text2'>{t ? t('our NFTs') : ''}</p>
    </>
  )

  const Page4 = () => (
    <>
      <h3> {t ? t('ALBUMS') : ''}</h3>
      <p className='hero__top__album__book__page__text2'>{t ? t('Earn Money') : ''}</p>
      <div className='albums_container'>
        <div className='album1'>
          <div className='albumtitle'>
            <p>{t ? t('medal') : ''}</p>
          </div>
          <div className='albumimg'>
            <Image alt='imagenalbum' src='/images/hero/album3.png' fill />
          </div>
        </div>
        <div className='album2'>
          <div className='albumtitle'>
            <p>{t ? t('sticker') : ''}</p>
          </div>
          <div className='albumimg'>
            <Image alt='imagenalbum' src='/images/hero/album6.png' fill />
          </div>
        </div>
        <div className='album3'>
          <div className='albumtitle'>
            <p>{t ? t('showdown') : ''}</p>
          </div>
          <div className='albumimg'>
            <Image alt='imagenalbum' src='/images/hero/album12.png' fill />
          </div>
        </div>
      </div>
    </>
  )

  const Page5 = () => (
    <>
      <h3> {t ? t('COLLECTION') : ''}</h3>
      <p className='hero__top__album__book__page__text2 hero__top__album__book__page__collection-text'>
        {t ? t('alpha') : ''}
      </p>
      <Link href='/alpha'>
        <button type='button' className='hero__top__album__book__page__btn'>
          ALPHA
        </button>
      </Link>
      <p className='hero__top__album__book__page__text2 hero__top__album__book__page__collection-text'>
        {t ? t('gamma') : ''}
      </p>
      <Link href='/gamma'>
        <button type='button' className='hero__top__album__book__page__btn2'>
          GAMMA
        </button>
      </Link>
      <p className='hero__top__album__book__page__text2 hero__top__album__book__page__collection-text'>
        {/* {t("omega")} */}
        {t ? t('omega') : ''}
      </p>
      <Link href='https://opensea.io/collection/nofomega' target='_blank' rel='noreferrer'>
        <button type='button' className='hero__top__album__book__page__btn3'>
          OMEGA
        </button>
      </Link>
    </>
  )

  const Page6 = () => (
    <>
      <h3> {t ? t('ECONOMICS') : ''}</h3>
      <p className='hero__top__album__book__page__text2'>{t ? t('NoF economy') : ''}</p>
      <div className='season_container'>
        <div className='seasonimg'>
          <Image src='/images/hero/temporada.png' alt='text box' fill />
        </div>
      </div>
      <p className='hero__top__album__book__page__text2'>
        {t ? t('our goals') : ''}
        {t ? t('bring together') : ''}
        {t ? t('create a nice game') : ''}
      </p>
    </>
  )

  const Page7 = () => (
    <div className='hero__top__album__book__page__profiles'>
      <h3 className='hero__top__album__book__page__profiles__title'>{t ? t('TEAM') : ''}</h3>
      <div className='hero__top__album__book__page__profiles__content'>
        {Profiles &&
          Profiles.slice(0, 9).map((profile) => (
            <div className='hero__top__album__book__page__profiles__box' key={profile.id}>
              <Image fill alt='profile' className='img' src={profile.icon} />
              <p>
                {profile.caption}
                <br />
                {profile.position}
              </p>
            </div>
          ))}
      </div>
    </div>
  )

  const Page8 = () => (
    <div className='hero__top__album__book__page__profiles'>
      <h3 className='hero__top__album__book__page__profiles__title'>{t ? t('TEAM') : ''}</h3>
      <div className='hero__top__album__book__page__profiles__content'>
        {Profiles &&
          Profiles.slice(9).map((profile) => (
            <div className='hero__top__album__book__page__profiles__box' key={profile.id}>
              <Image fill alt='profile' className='img' src={profile.icon} />
              <p>
                {profile.caption}
                <br />
                {profile.position}
              </p>
            </div>
          ))}
      </div>
    </div>
  )

  const Page9 = () => (
    <div className='hero__top__album__book__page__profiles'>
      <h3 className='hero__top__album__book__page__profiles__title'>{t ? t('FRIENDS') : ''}</h3>
      <div className='hero__top__album__book__page__profiles__content'>
        {Friends &&
          Friends.map((friend) => (
            <div className='hero__top__album__book__page__profiles__box' key={friend.id}>
              <Image fill alt='profile' className='img' src={friend.icon} />
              <p>{friend.caption}</p>
            </div>
          ))}
      </div>
    </div>
  )

  const Page10 = () => (
    <>
      {!windowSize.mobile && (
        <>
          <div className='tech_container'>
            <div className='techimg'>
              <Image src='/images/hero/p4tech.png' alt='p4tech-solutions' fill />
            </div>
          </div>

          <div className='text-blocker'>
            <h4>Number One Fan & P4 Tech Solutions Copyright © 2022 all rights reserved.</h4>
          </div>
        </>
      )}
      {windowSize.mobile && (
        <div className='hero__top__container__mobile'>
          <h3 className='title'>{t ? t('cards') : ''}</h3>
          <SwiperComp />
          <br />
          <br />
          <Whitepaper defaultClassName='hero__top__album__book__page__btn' />
          <NofTown defaultClassName='hero__top__album__book__page__btn2' />
        </div>
      )}
    </>
  )

  const BookComp = () => (
    <FlipBook
      showClose={false}
      onCloseClick={undefined}
      pages={[
        <Page1 key='page-1' />,
        <Page2 key='page-2' />,
        <Page3 key='page-3' />,
        <Page4 key='page-4' />,
        <Page5 key='page-5' />,
        <Page6 key='page-6' />,
        <Page7 key='page-7' />,
        <Page8 key='page-8' />,
        windowSize.mobile ? <Page10 key='page-9' /> : <Page9 key='page-9' />,
        windowSize.mobile ? <Page9 key='page-10' /> : <Page10 key='page-10' />
      ]}
    />
  )

  return (
    <div className='home'>
      <div className='hero' id='Hero'>
        <div className='hero__top__nof'>
          <Image src='/images/hero/logo-nof.gif' alt='Nof-Icon' fill />
        </div>
        <BookComp />
        {!windowSize.mobile && (
          <div className='hero__top__container__swiper'>
            <SwiperComp />
          </div>
        )}
      </div>
    </div>
  )
}

export default Main
