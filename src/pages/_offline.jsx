import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import OfflineMain from '../sections/Offline'

const Offline = () => <OfflineMain />

export default Offline

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
