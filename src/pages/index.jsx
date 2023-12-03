import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Main from '../sections/Main'

const Home = () => <Main />

export default Home

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
