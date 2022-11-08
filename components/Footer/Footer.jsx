import React from 'react'
import Image from 'next/image'

function Footer () {
  return (
    <section className='footer' id='Contacto'>
      <div className='footer'>
        <Image
          src='/../public/footer/insert-coin.png'
          alt=''
          width={200}
          height={100}
        />
      </div>
      <div className='footer__handle'>
        <Image
          src='/../public/footer/palanca-verde-hover.png'
          alt=''
          width={100}
          height={150}
        />
      </div>
      <div className='footer__buttons'>
        <div className='footer__buttons__blue'>
          <Image
            src='/../public/footer/blue-button.png'
            alt=''
            width={100}
            height={60}
            onMouseOver={e => (e.currentTarget.src = '/../public/footer/blue-button-hover.png')}
            onMouseOut={e => (e.currentTarget.src = '/../public/footer/blue-button.png')}
          />
        </div>
        <div className='footer__buttons__red'>
          <Image
            src='/../public/footer/red-button.png'
            alt=''
            width={100}
            height={60}
            onMouseOver={e => (e.currentTarget.src = '/../public/footer/red-button-hover.png')}
            onMouseOut={e => (e.currentTarget.src = '/../public/footer/red-button.png')}
          />
        </div>
        <div className='footer__buttons__green'>
          <Image
            src='/../public/footer/green-button.png'
            alt=''
            width={100}
            height={60}
            onMouseOver={e => (e.currentTarget.src = '/../public/footer/green-button-hover.png')}
            onMouseOut={e => (e.currentTarget.src = '/../public/footer/green-button.png')}
          />
        </div>
        <div className='footer__buttons__yellow'>
          <Image
            src='/../public/footer/yellow-button.png'
            alt=''
            width={100}
            height={60}
            onMouseOver={e => (e.currentTarget.src = '/../public/footer/yellow-button-hover.png')}
            onMouseOut={e => (e.currentTarget.src = '/../public/footer/yellow-button.png')}
          />
        </div>
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
