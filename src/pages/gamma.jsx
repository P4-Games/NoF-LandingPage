import GammaInventory from '../sections/Gamma'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

const Gamma = () => <GammaInventory />

export default Gamma

export async function getStaticProps ({locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}

