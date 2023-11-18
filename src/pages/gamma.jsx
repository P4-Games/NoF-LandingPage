import { GammaMain } from '../sections/Gamma'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import  NofHead from '../components/Head'

const Gamma = () => (
  <div className='gamma_main'>
  <NofHead />
  <GammaMain />
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

