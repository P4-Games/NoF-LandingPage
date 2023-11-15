import React, { useRef } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../sections/Hero'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

function Home () {
  const book = useRef(null)

  function turnNextPage () {
    book.current.pageFlip().flipNext()
  }

  function turnPrevPage () {
    book.current.pageFlip().flipPrev()
  }

  function goToCollections (number) {
    book.current.pageFlip().flip(number)
  }

  return (
    <div className='home'>
      <Head>
        <title>Number One Fan</title>
        <meta name='description' content='Number One Fan' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar
        goToCollections={goToCollections}
      />
      <Hero
        ref={book}
        turnNextPage={turnNextPage}
        turnPrevPage={turnPrevPage}
      />
      <Footer turnNextPage={turnNextPage} turnPrevPage={turnPrevPage} />
    </div>
  )
}

export default Home

export async function getStaticProps ({locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
