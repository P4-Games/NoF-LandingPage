import Head from 'next/head'
// import Link from 'next/link'
import Navbar from '../components/Navbar'
import Hero from './sections/Hero'
import Footer from '../components/Footer'
import { useRef } from 'react'

function Home() {
  const book = useRef()
  function turnNextPage() {
    book.current.pageFlip().flipNext()
  }
  function turnPrevPage() {
    book.current.pageFlip().flipPrev()
  }
  return (
    <div className='home'>
      <Head>
        <title>Number One Fan</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='./public/favicon.ico' />
      </Head>
      <Navbar />
      <Hero
        ref={book}
      />
      <Footer
        turnNextPage={turnNextPage}
        turnPrevPage={turnPrevPage}
      />
    </div>
  )
}

export default Home
