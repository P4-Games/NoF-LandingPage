import Head from 'next/head'
import GammaInventory from '../sections/Gamma'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

const Gamma = () => {
  return (
    <div className='gamma_main'>
    <Head>
        <title>Number One Fan</title>
        <meta name='description' content='NoF Gamma' />
        <link rel='icon' href='/favicon.ico' />
    </Head>
    <GammaInventory />
  </div>
  )
}


export default Gamma

export async function getStaticProps ({locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}

