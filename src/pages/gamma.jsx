import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GammaMain } from '../sections/Gamma'
import { GammaDataContextProvider } from '../context/GammaDataContext'

const Gamma = () => (
  <GammaDataContextProvider>
    <GammaMain />
  </GammaDataContextProvider>
)

export default Gamma

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
