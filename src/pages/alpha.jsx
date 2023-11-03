import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AlphaCards } from '../sections/Alpha'
import { useState } from 'react'


const Alpha = () => {
  const [loadAlbums, setLoadAlbums] = useState(false)
  function alphaMidButton () {
    const albums = document.getElementsByClassName(
      'alpha_full_albums_container'
    )[0]
    const game = document.getElementsByClassName('alpha_inner_container')[0]
    if (game) {
      albums.classList.toggle('alpha_display_none')
      game.classList.toggle('alpha_display_none')
    }
  }

  return (
    <div className='alpha_main'>
      <Head>
        <title>Number One Fan</title>
        <meta name='description' content='NoF Alpha' />
        <link rel='icon' href='./favicon.ico' />
      </Head>
      <Navbar
        alphaMidButton={alphaMidButton}
        loadAlbums={loadAlbums}
        setLoadAlbums={setLoadAlbums}
      />
      <AlphaCards
        alphaMidButton={alphaMidButton}
        setLoadAlbums={setLoadAlbums}
        loadAlbums={loadAlbums}
      />
      <Footer />
    </div>
  )
}

export default Alpha
