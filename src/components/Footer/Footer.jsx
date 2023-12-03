import React from 'react'
import FooterButtons from './FooterButtons'
import { useLayoutContext } from '../../hooks'

function Footer() {
  const { mobile, turnNextPage, turnPrevPage } = useLayoutContext()

  const openNewWindow = () => {
    window.open('https://tama.nof.town/', '_blank')
  }

  return (
    <div className='footer'>
      {!mobile && (
        <>
          <div className='footer__insert' onClick={openNewWindow}>
            <></>
          </div>
          <div className='footer__handle__green' onClick={turnPrevPage}>
            <></>
          </div>
        </>
      )}
      <FooterButtons />
      {!mobile && (
        <>
          <div className='footer__handle__red' onClick={turnNextPage}>
            <></>
          </div>
          <div className='footer__text'>
            <p>
              Number One Fan &<br />
              <br />
              P4 Tech Solutions <br />
              <br />
              Copyright © 2022 <br />
              <br />
              all rights reserved.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Footer
