import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AlphaCards } from '../sections/Alpha'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import  NofHead from '../components/Head'

const Alpha = () => {
  
  function alphaMidButton () {
    const albums = document.getElementsByClassName(
      'alpha_full_albums_container'
    )
    const game = document.getElementsByClassName('alpha_inner_container')
    if (game && game.length > 0) {
      albums[0].classList.toggle('alpha_display_none')
      game[0].classList.toggle('alpha_display_none')
    }
  }

  return (
    <div className='alpha_main'>
      <NofHead />
      <Navbar alphaMidButton={alphaMidButton}/>
      <AlphaCards alphaMidButton={alphaMidButton}/>
      <Footer />
    </div>
  )
}

export default Alpha

export async function getStaticProps ({locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
