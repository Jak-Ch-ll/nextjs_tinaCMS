import { AppProps } from "next/dist/next-server/lib/router/router";
import { Banner } from "../components/Banner";
import "../styles/globals.scss";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Banner />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;
