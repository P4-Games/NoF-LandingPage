import Head from 'next/head'
import Navbar from '../components/Navbar'
// import Link from 'next/link'
import Footer from '../components/Footer'
// import EthersProvider from '../context/EthersContext'
import AlphaCards from '../components/AlphaCards'
import AlphaAlbums from '../components/AlphaAlbums'

const Alpha = () => {

  function alphaMidButton() {}

  return (
    <div className='alpha_main'>
      <Head>
        <title>Number One Fan</title>
        <meta name='description' content='NoF Alpha' />
        <link rel='icon' href='./favicon.ico' />
      </Head>
      <Navbar alphaMidButton={alphaMidButton}/>
      <AlphaCards />
      {/* <AlphaAlbums /> */}
      <Footer />
    </div>
  )
}

export default Alpha
