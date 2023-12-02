import React from 'react'
import Link from 'next/link'
import { useLayoutContext } from '../../hooks'

function FooterButtons() {
  const { showDefaultButtons, showButtons, buttonFunctions, footerButtonsClasses } =
    useLayoutContext()

  const DefaultButtons = () => (
    <div className='footer__buttons'>
      <Link
        href='https://twitter.com/NOFtoken'
        target='_blank'
        rel='noreferrer'
        className='footer__buttons__bluebtn_default'
      />
      <Link
        href='https://www.instagram.com/nof.token/'
        target='_blank'
        rel='noreferrer'
        className='footer__buttons__greenbtn_default'
      />
      <Link
        href='https://discord.gg/4Bvp5bVmCz'
        target='_blank'
        rel='noreferrer'
        className='footer__buttons__redbtn_default'
      />
      <Link
        href='https://t.me/+8BH1tsgrPmo1M2Zh'
        target='_blank'
        rel='noreferrer'
        className='footer__buttons__yellowbtn_default'
      />
    </div>
  )

  const CustomButtons = () => (
    <div className='footer__buttons'>
      {showButtons[0] && buttonFunctions && buttonFunctions[0] && (
        <div
          onClick={() => {
            buttonFunctions[0]()
          }}
          className={footerButtonsClasses[0] ?? 'footer__buttons__bluebtn_custom'}
        >
          <></>
        </div>
      )}
      {showButtons[1] && buttonFunctions && buttonFunctions[1] && (
        <div
          onClick={() => {
            buttonFunctions[1]()
          }}
          className={footerButtonsClasses[1] ?? 'footer__buttons__greenbtn_custom'}
        >
          <></>
        </div>
      )}
      {showButtons[2] && buttonFunctions && buttonFunctions[2] && (
        <div
          onClick={() => {
            buttonFunctions[2]()
          }}
          className={footerButtonsClasses[2] ?? 'footer__buttons__redbtn_custom'}
        >
          <></>
        </div>
      )}
      {showButtons[3] && buttonFunctions && buttonFunctions[3] && (
        <div
          onClick={() => {
            buttonFunctions[3]()
          }}
          className={footerButtonsClasses[3] ?? 'footer__buttons__yellowbtn_custom'}
        >
          <></>
        </div>
      )}
    </div>
  )

  return showDefaultButtons ? <DefaultButtons /> : <CustomButtons />
}

export default FooterButtons
