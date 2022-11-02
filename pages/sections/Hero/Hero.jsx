import React from 'react'
import Image from 'next/image'

function Hero () {
  return (
    <div className='hero' id='Hero'>
      <div className='hero__box'>
        <Image
          src='/../public/nof-icon/textbox.png'
          alt='text box'
          width={505}
          height={160}
        />
        <div className='hero__text'>
          <p>Colecciona, intercambia y gana completando tus álbumes favoritos!
            <br />
            Únete a la comunidad más fanática de coleccionistas en internet!.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero
