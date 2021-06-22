import { Provider } from "next-auth/client"
import { AppProps } from "next/dist/next-server/lib/router/router"
import { Banner } from "../components/Banner"
import { usePreserveScroll } from "../components/hooks/usePreserveScroll"
import "../styles/globals.scss"


function App({ Component, pageProps }: AppProps) {
  usePreserveScroll()

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
