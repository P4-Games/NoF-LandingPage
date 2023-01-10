import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import HTMLFlipBook from 'react-pageflip'
import Noficon from './background/logo-nof.gif'
import Bookflip from './background/book_flip.gif'
import Bookmenu from './background/book-menu-1.png'
import Gold from './background/oro.png'
import Plate from './background/plata.png'
import Bronce from './background/bronce.png'
import N from './background/n.png'
import O from './background/o.png'
import F from './background/f.png'
import Season from './background/temporada.png'
import Albumfirst from './background/album3.png'
import Albumsecond from './background/album6.png'
import Albumthird from './background/album12.png'
import Tech from './background/p4tech.png'
import Profiles from './Profiles.json'
import Friends from './Friends.json'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards, Autoplay, Pagination } from 'swiper'
import 'swiper/css/bundle'
import Link from 'next/link'

const Hero = React.forwardRef((props, book,) => {
  const { language, setLanguage, t } = props
  const [swipper, setSwipper] = useState(false)
  const [mobile, setMobile] = useState(false);
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const [size, setSize] = useState(false)
  // const width = mobile ? 360 : 360
  // const height = mobile ? 500 : 500
  // const size = mobile ? 'fixed' : 'stretch'
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true);
      setSize(true)
      setSwipper(true)
    } else {
      setMobile(false);
      setSize(false)
    }
    const updateMedia = () => {
      if (window.innerWidth < 600) {
        setMobile(true);
        setSwipper(true)
        setSize(true)
      } else {
        setMobile(false);
        setSize(false)
      }
    };
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);
  const onFlip = useCallback((e) => {
    console.log('Current page: ' + e.data);
    if (e.data === 8) {
      setSwipper(true)
      return
    }
    setSwipper(false)

  }, []);
  return (
    <div className='hero' id='Hero'>
      <div className='hero__top'>
        <div className='hero__top__nof'>
          <Image
            src={Noficon}
            alt='Nof-Icon'
            layout='fill'
          />
        </div>
        <div className='hero__top__album'>
          <HTMLFlipBook
            id='Book'
            size={'stretch'}
            width={360}
            height={500}
            minWidth={350}
            maxWidth={800}
            minHeight={500}
            maxHeight={800}
            autoSize={true}
            ref={book}
            usePortrait={size}
            drawShadow={false}
            className='hero__top__album__book'
          >
            <div className='hero__top__album__book__page' data-density='hard' number="1">
              <h3> {t("WELCOME")}</h3>
              <br />
              <div className='nofi_conteiner'>
                <div className='nofimg'>
                  <Image
                    src={Noficon}
                    alt='text box'
                    layout='fill'
                  />
                </div>
              </div>
              <div className='coin_conteiner'>
                <div className='coinimg'>
                  <Image
                    src={Gold}
                    alt='text box'
                    layout='fill'
                  />
                </div>
                <div className='coinimg2'>
                  <Image
                    src={Plate}
                    alt='text box'
                    layout='fill'
                  />
                </div>
                <div className='coinimg3'>
                  <Image
                    src={Bronce}
                    alt='text box'
                    layout='fill'
                  />
                </div>
              </div>
              <br />
              <p className='hero__top__album__book__page__text2'>
                {t("number one fan")}
                {/* collect-to-earn del mundo,<br />
                donde los jugadores<br />
                obtienen recompensas<br />
                mientras crean su propia<br />
                colección de álbumes NFT. */}
              </p>
              <div className='bookflip_conteiner'>
                <div className='bookimg'>
                  <Image
                    src={Bookflip}
                    alt='text box'
                    layout='fill'
                  />
                </div>
              </div>
            </div>
            <div className='hero__top__album__book__page0' data-density='hard' number="2">
              <div style={{
                position: 'relative', height: '100%', width: '100%',
                backGround: 'black',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                marginTop: '10%',
              }}
                className='hero__top__album__book__pagecontent'>
                <p className='hero__top__album__book__page__text2'>
                  {t("our goal")}
                </p>
                <div className='book_container'>
                  <Image
                    src={Bookmenu}
                    alt='text box'
                    layout='fill'
                  />
                </div>
                <p className='hero__top__album__book__page__text2'>
                  {t("sustainable game")}
                </p>
              </div>

            </div>
            <div className='hero__top__album__book__page' data-density='hard' number="3">
              <div style={{
                position: 'relative', height: '100%', width: '100%',
                backGround: 'black',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',

              }}>
                <h3> {t("CARDS")}</h3>
                <p className='hero__top__album__book__page__text2'>
                  {t("our cards")}
                </p>
                <div className='nof_container'>
                  <div className='nof1'>
                    <div className='nofimg'>
                      <Image
                        src={N}
                        alt='N image'
                        layout='fill'
                      />
                    </div>
                    <div className='noftitle'>
                      <p>
                        {t("gold")}
                      </p>
                    </div>
                  </div>
                  <div className='nof2'>
                    <div className='nofimg'>
                      <Image
                        src={O}
                        alt='O image'
                        layout='fill'
                      />
                    </div>
                    <div className='noftitle'>
                      {t("silver")}
                    </div>
                  </div>
                  <div className='nof3'>
                    <div className='nofimg'>
                      <Image
                        src={F}
                        alt='F image'
                        layout='fill'
                      />
                    </div>
                    <div className='noftitle'>
                      <p>
                        {t("bronze")}
                      </p>
                    </div>
                  </div>
                </div>
                <p>
                  {t("our NFTs")}
                </p>
              </div>
            </div>

            <div className='hero__top__album__book__page0' data-density='hard' number="4">
              <h3> {t("ALBUMS")}</h3>
              <p>
                {t("Earn money")}
              </p>
              <div className='albums_container'>
                <div className='album1'>
                  <div className='albumtitle'>
                    <p>
                      {t("medal")}
                    </p>
                  </div>
                  <div className='albumimg'>
                    <Image
                      alt='imagenalbum'
                      src={Albumfirst}
                      layout='fill' />
                  </div>
                </div>
                <div className='album2'>
                  <div className='albumtitle'>
                    <p>
                      {t("Sticker")}
                    </p>
                  </div>
                  <div className='albumimg'>
                    <Image alt='imagenalbum'
                      src={Albumsecond}
                      layout='fill' />
                  </div>
                </div>
                <div className='album3'>
                  <div className='albumtitle'>
                    <p>
                      {t("showdown")}
                    </p>
                  </div>
                  <div className='albumimg'>
                    <Image alt='imagenalbum'
                      src={Albumthird}
                      layout='fill' />
                  </div>
                </div>

              </div>
            </div>
            <div className='hero__top__album__book__page' data-density='hard' number="5">
              <h3> {t("COLLECTION")}</h3>
              <p className='hero__top__album__book__page__text2'>
                {t("alpha")}
              </p>
              <Link
                href='/alpha'
              >
                <button className='hero__top__album__book__page__btn'>
                  ALPHA
                </button>
              </Link>
              <p className='hero__top__album__book__page__text2'>
                {t("gamma")}
              </p>
              <Link
                href='https://opensea.io/collection/nof-gamma'
                target='_blank'
                rel='noreferrer'
              >
                <button className='hero__top__album__book__page__btn2'>
                  GAMMA
                </button>
              </Link>
              <p className='hero__top__album__book__page__text2'>
                {t("omega")}
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

            <div className='hero__top__album__book__page0' data-density='hard' number="6">
              <h3> {t("ECONOMICS")}</h3>
              <p className='hero__top__album__book__page__text2'>
                {t("NoF economy")}
              </p>
              <div className='season_container'>
                <div className='seasonimg'>
                  <Image
                    src={Season}
                    alt='text box'
                    layout='fill'
                  />
                </div>
              </div>
              <p className='hero__top__album__book__page__text2'>
                {t("our goals")}
                {t("bring together")}
                {t("create a nice game")}

              </p>
            </div>
            <div className='hero__top__album__book__page' data-density='hard' number="7">
              <div className='hero__top__album__book__page__profiles'>
                <h3 className='hero__top__album__book__page__profiles__title'>EQUIPO</h3>
                <div className='hero__top__album__book__page__profiles__content'>
                  {
                    Profiles && Profiles.map(profile => {
                      return (
                        <div className='hero__top__album__book__page__profiles__box' key={profile.id}>
                          <div className='img'>
                            <Image
                              layout='fill'
                              src={profile.icon}
                            />
                          </div>
                          <p>{profile.caption}
                            <br />{profile.position}</p>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='hero__top__album__book__page0' data-density='hard' number="8">
              <div className='friends_container'>
                <h3 className='title'>AMIGOS</h3>
                <div className='content'>
                  {
                    Friends && Friends.map(friend => {
                      return (
                        <div className='box' key={friend.id}>
                          <div className='img'>
                            <Image
                              layout='fill'
                              src={friend.icon}
                            />
                          </div>
                          <p>{friend.caption}</p>

                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='hero__top__album__book__page' data-density='hard' number="9">
              <div className='tech_container'>
                <div className='techimg'>
                  <Image
                    src={Tech}
                    alt='p4tech-solutions'
                    layout='fill'
                  />
                </div>
              </div>
              {!mobile && <div className='text-blocker'>
                <h4>
                  Number One Fan &<br />
                  <br />P4 Tech Solutions <br />
                  <br />Copyright © 2022 <br />
                  <br />all rights reserved.
                </h4>
              </div>}
              {mobile && <h3 >Mirá nuestros coleccionables!</h3>}
              {mobile && swipper &&
                <div className='hero__top__conteiner__mobile'>
                  {swipper && <div className='hero__top__swiper'>
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
                  </div>}
                </div>}
            </div>
          </HTMLFlipBook>
        </div>
        {
          !mobile && <div className='hero__top__conteiner__swiper'>
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
          </div>
        }
      </div >
    </div >
  )
}
)

export default Hero
