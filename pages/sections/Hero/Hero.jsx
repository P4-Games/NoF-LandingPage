import React from 'react'
import Image from 'next/image'
import HTMLFlipBook from 'react-pageflip'
import Link from 'next/link'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-cards'

// import required modules
import { EffectCards, Autoplay, Pagination } from 'swiper'
// eslint-disable-next-line
import 'swiper/css/bundle'

function Hero () {
  return (
    <div className='hero' id='Hero'>
      <div className='hero__top'>
        <div className='hero__top__nof'>
          <Image
            src='/../public/nof-icon/logo-nof.gif'
            alt='text box'
            width={210}
            height={380}
          />
        </div>
        <div className='hero__top__album'>
          <HTMLFlipBook width={400} height={500} className='hero__top__album__book'>
            <div className='hero__top__album__book__page' data-density='hard'>
              <h3>BIENVENIDOS!</h3>
              <div className='navbar__icon__coin'>
                <Image
                  src='/../public/nof-icon/logo-coin.png'
                  alt='/'
                  width={142}
                  height={139}
                />
              </div>
              <p>Al primer collect-to-earn <br />
                <br />del mundo web3 <br />
                <br />donde los más fanáticos <br />
                <br />obtienen recompensas<br />
                <br />por crear su propia <br />
                <br />colección de álbumes NFT.
              </p>
            </div>
            <div className='hero__top__album__book__page0' data-density='hard'>
              <p> <br /> <br /> <br />
                El objetivo de NOF es<br />
                <br />convertirse en el mayor<br />
                <br />punto de encuentro<br />
                <br />de los grupos de fans<br />
                <br />y revivir la afición<br />
                <br />por coleccionar figutitas.
              </p> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
              <Link
                href='https://opensea.io/collection/noftoken'
                target='_blank'
                rel='noreferrer'
                spy='true' smooth='true' offset={-80} duration={500}
              >
                <button className='navbar__ul__li__whitepaper'>
                  Market
                </button>
              </Link>
            </div>
            <div className='hero__top__album__book__page1' data-density='hard'>Page 3</div>
            <div className='hero__top__album__book__page2' data-density='hard'>Page 4</div>
            <div className='hero__top__album__book__page3' data-density='hard'>Page 5</div>
            <div className='hero__top__album__book__page4' data-density='hard'>Page 6</div>
            <div className='hero__top__album__book__page4' data-density='hard'>Page 7</div>
          </HTMLFlipBook>
        </div>
        <div className='hero__top__swiper'>
          <>
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
          </>
        </div>
      </div>
    </div>
  )
}

export default Hero
