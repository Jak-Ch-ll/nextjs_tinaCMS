import { AppProps } from "next/dist/next-server/lib/router/router"
import { Banner } from "../components/Banner"
import "../styles/globals.scss"

import { Provider } from "next-auth/client"
import Head from "next/head"

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider session={pageProps.session}>
        <Banner />
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default App
