import React from 'react'
import HTMLFlipBook from 'react-pageflip'
import { PageFlip } from 'page-flip'

function Album () {
  document.addEventListener('DOMContentLoaded', function () {
    const pageFlip = new PageFlip(
      document.getElementById('Book'),
      {
        width: 550,
        height: 733,

        size: 'stretch',
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,

        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false
      }
    )
  }
  )

  // FIXME:
  // pageFlip.loadFromHTML(document.querySelectorAll('.page'),

  return (
    <HTMLFlipBook width={400} height={500} id='Book'>
      <div className='hero__top__album__book__page' number={0} data-density='hard'>
        <h3>BIENVENIDOS!</h3>
        <p>Al primer collect-to-earn <br />
          <br />del mundo web3 <br />
          <br />donde los más fanáticos <br />
          <br />obtienen recompensas<br />
          <br />por crear su propia <br />
          <br />colección de álbumes NFT.
        </p>
      </div>
      <div className='Page' number={1} data-density='hard'>Page 2</div>
      <div className='Page' number={2} data-density='hard'>Page 3</div>
      <div className='Page' number={3} data-density='hard'>Page 4</div>
    </HTMLFlipBook>
  )
}

export default Album
