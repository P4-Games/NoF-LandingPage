import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AlphaMain } from '../sections/Alpha'

const Alpha = () => <AlphaMain />

export default Alpha

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
