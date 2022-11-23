import Head from 'next/head'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import Footer from '../components/Footer'
import EthersProvider from '../context/EthersContext'

const Alpha = () => {
  return (
    <div className='alpha'>
      <EthersProvider>
        <Head>
          <title>Number One Fan</title>
          <meta name='description' content='Generated by create next app' />
          <Link rel='icon' href='./public/favicon.ico' />
        </Head>
        <Navbar />
        <Footer />
      </EthersProvider>
    </div>
  )
}

export default Alpha
