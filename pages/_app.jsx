import "../styles/index.scss";
import "../styles/alpha.scss";
import "../styles/gamma.scss";
import "../styles/admin.scss";
// import 'sweetalert2/src/sweetalert2.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
