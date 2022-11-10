import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function handleMouseEnter (e) {
  console.log(e)
}

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
        <Link href='https://twitter.com/NOFtoken' target='_blank' rel='noreferrer'>
          <div className='footer__buttons__blue' target='_blank'>
            <Image
              id='img1'
              src='/../public/footer/blue-button.png'
              alt='Twitter-button'
              width={100}
              height={60}
              onMouseEnter={handleMouseEnter}
            />
          </div>
        </Link>
        <Link href='https://discord.gg/4Bvp5bVmCz' target='_blank' rel='noreferrer'>
          <div className='footer__buttons__red'>
            <Image
              src='/../public/footer/red-button.png'
              alt='Discord-button'
              width={100}
              height={60}
              onMouseOver={e => (e.currentTarget.src = '/../public/footer/red-button-hover.png')}
              onMouseOut={e => (e.currentTarget.src = '/../public/footer/red-button.png')}
            />
          </div>
        </Link>
        <Link href='https://www.instagram.com/nof.token/' target='_blank' rel='noreferrer'>
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
        </Link>
        <Link href='https://t.me/+8BH1tsgrPmo1M2Zh' target='_blank' rel='noreferrer'>
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
        </Link>
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
