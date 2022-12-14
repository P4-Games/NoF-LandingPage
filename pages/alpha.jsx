import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import Footer from '../components/Footer'
// import EthersProvider from '../context/EthersContext'
import AlphaCards from '../components/AlphaCards'

const Alpha = () => {

  return (
    <div className='alpha_main'>
      <Head>
        <title>Number One Fan</title>
        <meta name='description' content='NoF Alpha' />
        <Link rel='icon' href='./public/favicon.ico' />
      </Head>  
      <AlphaCards />
      <Navbar />
      <Footer />
    </div>
  )
}

export default Alpha
