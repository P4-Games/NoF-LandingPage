import React from 'react'
import Image from 'next/image'

import Cards from '../../../components/Cards'

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
        <div className='hero__bot__market'>
          <button to='https://opensea.io/collection/noftoken' className='hero__bot__market__Button'>
            Marketplace
          </button>
        </div>
        <div>
          Lorem ipsum dolor sit, <br /> amet consectetur adipisicing elit.
        </div>
      </div>
    </div>
  )
}

export default Hero
