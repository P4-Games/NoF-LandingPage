import React from 'react'
import FooterButtons from './FooterButtons'
import { useLayoutContext } from '../../hooks'

function Footer () {
  
  const { turnNextPage, turnPrevPage } = useLayoutContext()
  
  const openNewWindow = () => {
    window.open('https://tama.nof.town/', '_blank')
  }
  
  return (
    <div className='footer'>
      <div className='footer__insert' onClick={openNewWindow}>
        <></>
      </div>
      <div className='footer__handle__green' onClick={turnPrevPage}>
        <></>
      </div>
      <FooterButtons />
      <div className='footer__handle__red' onClick={turnNextPage}>
        <></>
      </div>
      <div>
        <p className='footer__text'>
          Number One Fan &<br />
          <br />P4 Tech Solutions <br />
          <br />Copyright © 2022 <br />
          <br />all rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
