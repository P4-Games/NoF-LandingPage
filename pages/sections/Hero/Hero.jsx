import React from 'react'
import Image from 'next/image'
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
      <div className='hero__top__box'>
        <Image
          src='/../public/nof-icon/textbox.png'
          alt='text box'
          width={505}
          height={160}
        />
      </div>
      <div className='hero__bot'>
        <div className='hero__bot__nof'>
          <Image
            src='/../public/nof-icon/logo-nof.png'
            alt='text box'
            width={250}
            height={300}
          />
        </div>
        <Link href='https://opensea.io/collection/noftoken' target='_blank' rel='noreferrer'>
          <div className='hero__bot__market'>
            <button>
              Marketplace
            </button>
          </div>
        </Link>
        <div className='hero__bot__swiper'>
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
              className='hero__bot__swiper__slide'
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
