import { AppProps } from "next/dist/next-server/lib/router/router";
import { Banner } from "../components/Banner";
import "../styles/globals.scss";

import { Provider } from "next-auth/client";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider session={pageProps.session}>
        <Banner />
        <main>
          <Component {...pageProps} />
        </main>
      </Provider>
    </>
  );
}

export default App;
