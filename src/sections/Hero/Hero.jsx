import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards, Autoplay, Pagination } from 'swiper'
import 'swiper/css/bundle'
import Link from 'next/link'
import HTMLFlipBook from 'react-pageflip'

import Noficon from './images/logo-nof.gif'
import Bookflip from './images/book_flip.gif'
import Bookmenu from './images/book-menu-1.png'
import Gold from './images/oro.png'
import Plate from './images/plata.png'
import Bronce from './images/bronce.png'
import N from './images/n.png'
import O from './images/o.png'
import F from './images/f.png'
import Season from './images/temporada.png'
import Albumfirst from './images/album3.png'
import Albumsecond from './images/album6.png'
import Albumthird from './images/album12.png'
import Tech from './images/p4tech.png'
import Profiles from './Profiles.json'
import Friends from './Friends.json'

import Whitepaper from '../../components/Navbar/Whitepaper'
import NofTown from '../../components/Navbar/NofTown'
import {useTranslation} from 'next-i18next'
import { useLayoutContext } from '../../hooks'

const Hero = React.forwardRef((_, book) => {
  const [swipper, setSwipper] = useState(false)
  const { size, mobile } = useLayoutContext()
  const {t} = useTranslation()

  return (
    <div className='hero' id='Hero'>
      <div className='hero__top'>
        <div className='hero__top__nof'>
          <Image src={Noficon} alt='Nof-Icon' fill/>
        </div>
        <div className='hero__top__album'>
          <HTMLFlipBook
            id='Book'
            size='stretch'
            width={360}
            height={500}
            minWidth={300}
            maxWidth={800}
            minHeight={350}
            maxHeight={600}
            autoSize
            ref={book}
            usePortrait={size}
            drawShadow={false}
            className='hero__top__album__book'
          >
            <div
              className='hero__top__album__book__page'
              data-density='hard'
              number='1'
            >
              <div className='hero__top__album__book__page__page-content'>
                <h3> {t ? t('WELCOME') : ''}</h3>

                <div className='nofi_conteiner'>
                  <div className='nofimg'>
                    <Image src={Noficon} alt='text box' fill/>
                  </div>
                </div>
                <div className='coin_conteiner'>
                  <div className='coinimg'>
                    <Image src={Gold} alt='text box' fill/>
                  </div>
                  <div className='coinimg2'>
                    <Image src={Plate} alt='text box' fill/>
                  </div>
                  <div className='coinimg3'>
                    <Image src={Bronce} alt='text box' fill/>
                  </div>
                </div>

                <p className='hero__top__album__book__page__text2'>
                  {t ? t('number one fan') : ''}
                </p>
                <div className='bookflip_conteiner'>
                  <div className='bookimg'>
                    <Image src={Bookflip} alt='text box' fill/>
                  </div>
                </div>
              </div>
            </div>
            <div
              className='hero__top__album__book__page0'
              data-density='hard'
              number='2'
            >
              <div className='hero__top__album__book__page__page-content'>
                <p className='hero__top__album__book__page__text2'>
                  {t ? t('our goal') : ''}
                </p>
                <div className='book_container'>
                  <Image src={Bookmenu} alt='text box' fill/>
                </div>
                <p className='hero__top__album__book__page__text2'>
                  {t ? t('sustainable game') : ''}
                </p>
              </div>
            </div>
            <div
              className='hero__top__album__book__page'
              data-density='hard'
              number='3'
            >
              <div className='hero__top__album__book__page__page-content'>
                <h3> {t ? t('CARDS') : ''}</h3>
                <p className='hero__top__album__book__page__text2'>
                  {t ? t('our cards') : ''}
                </p>
                <div className='nof_container'>
                  <div className='nof1'>
                    <div className='nofimg'>
                      <Image src={N} alt='N image' fill/>
                    </div>
                    <div className='noftitle'>
                      <p>{t ? t('gold') : ''}</p>
                    </div>
                  </div>
                  <div className='nof2'>
                    <div className='nofimg'>
                      <Image src={O} alt='O image' fill/>
                    </div>
                    <div className='noftitle'>
                      <p>{t ? t('silver') : ''}</p>
                    </div>
                  </div>
                  <div className='nof3'>
                    <div className='nofimg'>
                      <Image src={F} alt='F image' fill/>
                    </div>
                    <div className='noftitle'>
                      <p>{t ? t('bronze') : ''}</p>
                    </div>
                  </div>
                </div>
                <p className='hero__top__album__book__page__text2'>
                  {t ? t('our NFTs') : ''}
                </p>
              </div>
            </div>
            <div
              className='hero__top__album__book__page0'
              data-density='hard'
              number='4'
            >
              <div className='hero__top__album__book__page__page-content'>
                <h3> {t ? t('ALBUMS') : ''}</h3>
                <p className='hero__top__album__book__page__text2'>
                  {/* {t("Earn Money")} */}
                  {t ? t('Earn Money') : ''}
                </p>
                <div className='albums_container'>
                  <div className='album1'>
                    <div className='albumtitle'>
                      <p>
                        {/* {t("medal")} */}
                        {t ? t('medal') : ''}
                      </p>
                    </div>
                    <div className='albumimg'>
                      <Image alt='imagenalbum' src={Albumfirst} fill/>
                    </div>
                  </div>
                  <div className='album2'>
                    <div className='albumtitle'>
                      <p>
                        {/* {t("sticker")} */}
                        {t ? t('sticker') : ''}
                      </p>
                    </div>
                    <div className='albumimg'>
                      <Image
                        alt='imagenalbum'
                        src={Albumsecond}
                        layout='fill'
                      />
                    </div>
                  </div>
                  <div className='album3'>
                    <div className='albumtitle'>
                      <p>
                        {/* {t("showdown")} */}
                        {t ? t('showdown') : ''}
                      </p>
                    </div>
                    <div className='albumimg'>
                      <Image alt='imagenalbum' src={Albumthird} fill/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className='hero__top__album__book__page'
              data-density='hard'
              number='5'
            >
              <div className='hero__top__album__book__page__page-content'>
                <h3> {t ? t('COLLECTION') : ''}</h3>
                <p className='hero__top__album__book__page__text2 hero__top__album__book__page__collection-text'>
                  {t ? t('alpha') : ''}
                </p>
                <Link href='/alpha'>
                  <button className='hero__top__album__book__page__btn'>
                    ALPHA
                  </button>
                </Link>
                <p className='hero__top__album__book__page__text2 hero__top__album__book__page__collection-text'>
                  {t ? t('gamma') : ''}
                </p>
                <Link
                  href='/gamma'>
                  <button className='hero__top__album__book__page__btn2'>
                    GAMMA
                  </button>
                </Link>
                <p className='hero__top__album__book__page__text2 hero__top__album__book__page__collection-text'>
                  {/* {t("omega")} */}
                  {t ? t('omega') : ''}
                </p>
                <Link
                  href='https://opensea.io/collection/nofomega'
                  target='_blank'
                  rel='noreferrer'
                >
                  <button className='hero__top__album__book__page__btn3'>
                    OMEGA
                  </button>
                </Link>
              </div>
            </div>

            <div
              className='hero__top__album__book__page0'
              data-density='hard'
              number='6'
            >
              <div className='hero__top__album__book__page__page-content'>
                <h3> {t ? t('ECONOMICS') : ''}</h3>
                <p className='hero__top__album__book__page__text2'>
                  {/* {t("NoF economy")} */}
                  {t ? t('NoF economy') : ''}
                </p>
                <div className='season_container'>
                  <div className='seasonimg'>
                    <Image src={Season} alt='text box' fill/>
                  </div>
                </div>
                <p className='hero__top__album__book__page__text2'>
                  {t ? t('our goals') : ''}
                  {t ? t('bring together') : ''}
                  {t ? t('create a nice game') : ''}
                </p>
              </div>
            </div>
            <div
              className='hero__top__album__book__page'
              data-density='hard'
              number='7'
            >
              <div className='hero__top__album__book__page__page-content'>
                <div className='hero__top__album__book__page__profiles'>
                  <h3 className='hero__top__album__book__page__profiles__title'>
                    {t ? t('TEAM') : ''}
                  </h3>
                  <div className='hero__top__album__book__page__profiles__content'>
                    {Profiles &&
                      Profiles.map((profile) => (
                          <div
                            className='hero__top__album__book__page__profiles__box'
                            key={profile.id}
                          >
                            <Image
                              alt='album_pack'
                              layout='fill'
                              className='img'
                              src={profile.icon}
                            />

                            <p>
                              {profile.caption}
                              <br />
                              {profile.position}
                            </p>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className='hero__top__album__book__page0'
              data-density='hard'
              number='8'
            >
              {' '}
              <div className='hero__top__album__book__page__page-content'>
                <div className='friends_container'>
                  <h3 className='title'>{t ? t('FRIENDS') : ''}</h3>
                  <div className='content'>
                    {Friends &&
                      Friends.map((friend) => (
                          <div className='box' key={friend.id}>
                            <Image
                              fill
                              alt='album_book'
                              className='img'
                              src={friend.icon}
                            />

                            <p>{friend.caption}</p>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className='hero__top__album__book__page'
              data-density='hard'
              number='9'
            >
              {!mobile && (
                <div className='hero__top__album__book__page__page-content'>
                  <div className='tech_container'>
                    <div className='techimg'>
                      <Image src={Tech} alt='p4tech-solutions' fill/>
                    </div>
                  </div>

                  <div className='text-blocker'>
                    <h4>
                      Number One Fan & P4 Tech Solutions Copyright © 2022 all
                      rights reserved.
                    </h4>
                  </div>
                </div>
              )}

              {mobile && swipper && (
                <div className='hero__top__conteiner__mobile'>
                  <h3 className='title'>{t ? t('collections') : ''}</h3>
                  {swipper && (
                    <div className='hero__top__swiper'>
                      <Swiper
                        effect='cards'
                        grabCursor
                        modules={[EffectCards, Autoplay, Pagination]}
                        loop
                        autoplay={{
                          delay: 3000,
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
                  )}
                  <Whitepaper />
                  <NofTown />
                </div>
              )}
            </div>
          </HTMLFlipBook>
        </div>
        {!mobile && (
          <div className='hero__top__conteiner__swiper'>
            <div className='hero__top__swiper'>
              {swipper && <Swiper
                effect='cards'
                grabCursor
                modules={[EffectCards, Autoplay, Pagination]}
                loop
                autoplay={{
                  delay: 3000,
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
              </Swiper>}
              <div className='pagination' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

Hero.propTypes = {
  book: PropTypes.object
}

export default Hero

