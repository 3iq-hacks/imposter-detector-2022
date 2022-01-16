import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} id="wrapper" />;
}

export default MyApp;
