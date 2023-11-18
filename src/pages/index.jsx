import React from 'react'
import NofHead from '../components/Head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Main from '../sections/Main'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

function Home () {

  return (
    <div className='home'>
      <NofHead/>
      <Navbar/>
      <Main/>
      <Footer />
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
