import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../pages/sections/Hero'
import Book from '../pages/sections/Book'

function Home () {
  return (
    <div className='home'>
      <Head>
        <title>Number One Fan</title>
        <meta name='description' content='Generated by create next app' />
        <Link rel='icon' href='./public/favicon.ico' />
      </Head>
      <Navbar />
      <Hero />
      <Book />
      <Footer />
    </div>
  )
}

export default Home
