import React from 'react'
import Image from 'next/image'

function Footer () {
  return (
    <section className='footer' id='Contacto'>
      <div className='footer__coiner'>
        <Image
          src='/../public/footer/insert-coin.png'
          alt=''
          width={200}
          height={100}
        />
      </div>
      <div className='footer__coiner'>
        <Image
          src='/../public/footer/palanca-verde-hover.png'
          alt=''
          width={100}
          height={150}
        />
      </div>
      <div className='footer__coiner'>
        <Image
          src='/../public/footer/boton-azul.png'
          alt=''
          width={100}
          height={60}
        />
      </div>
      <div className='footer__coiner'>
        <Image
          src='/../public/footer/boton-rojo.png'
          alt=''
          width={100}
          height={60}
        />
      </div>
      <div className='footer__coiner'>
        <Image
          src='/../public/footer/boton-verde.png'
          alt=''
          width={100}
          height={60}
        />
      </div>
      <div className='footer__coiner'>
        <Image
          src='/../public/footer/boton-amarillo.png'
          alt=''
          width={100}
          height={60}
        />
      </div>
      <div className='footer__coiner'>
        <Image
          src='/../public/footer/palanca-roja.png'
          alt=''
          width={100}
          height={150}
        />
      </div>
      <div>
        <p>
          Number One Fan <br />
          Copyright © 2022 <br />
          all rights reserved.
        </p>
      </div>
    </section>
  )
}

export default Footer
