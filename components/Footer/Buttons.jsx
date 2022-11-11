import React from 'react'
import Link from 'next/link'

function Buttons () {
  return (
    <div className='footer__buttons'>
      <Link href='https://twitter.com/NOFtoken' target='_blank' rel='noreferrer'>
        <div className='footer__buttons__blue' target='_blank'>
          <></>
        </div>
      </Link>
      <Link href='https://discord.gg/4Bvp5bVmCz' target='_blank' rel='noreferrer'>
        <div className='footer__buttons__red'>
          <></>
        </div>
      </Link>
      <Link href='https://www.instagram.com/nof.token/' target='_blank' rel='noreferrer'>
        <div className='footer__buttons__green'>
          <></>
        </div>
      </Link>
      <Link href='https://t.me/+8BH1tsgrPmo1M2Zh' target='_blank' rel='noreferrer'>
        <div className='footer__buttons__yellow'>
          <></>
        </div>
      </Link>
    </div>
  )
}

export default Buttons
