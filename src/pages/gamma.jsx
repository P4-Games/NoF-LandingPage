import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GammaMain } from '../sections/Gamma'

const Gamma = () => <GammaMain />

export default Gamma

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
