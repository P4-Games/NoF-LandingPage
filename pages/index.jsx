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
  function onFlip() {
    page.onFlip()
  }
  function goToCollections(number) {
    book.current.pageFlip().flip(number)
  }

  return (
    <div className='home'>
      <Head>
        <title>Number One Fan</title>
        <meta name='description' content='Number One Fan' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <link rel='icon' href='./favicon.ico' />
      </Head>
      <Navbar onFlip={onFlip} goToCollections={goToCollections} />
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
