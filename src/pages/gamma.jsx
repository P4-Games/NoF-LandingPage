import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import { GammaMain } from '../sections/Gamma'
import Navbar from '../components/Navbar'
import  NofHead from '../components/Head'
import Footer from '../components/Footer'

const Gamma = () => (
  <div className='gamma_main'>
  <NofHead />
  <Navbar/>
  <GammaMain />
  <Footer />
</div>
)

export default Gamma

export async function getStaticProps ({locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}

