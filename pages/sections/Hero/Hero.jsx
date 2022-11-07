import React from 'react'
import Image from 'next/image'

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
        <div className='hero__bot__cards'>
          <div className='hero__bot__cards__1'>
            <Image
              src='/../public/nof-icon/wolverine.png'
              alt='nof-image'
              width={200}
              height={200}
            />
          </div>
          <div className='hero__bot__cards__2'>
            <Image
              src='/../public/nof-icon/yu-gi.png'
              alt='nof-image'
              width={200}
              height={200}
            />
          </div>
          <div className='hero__bot__cards__3'>
            <Image
              src='/../public/nof-icon/sailor-neptuno.png'
              alt='nof-image'
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
