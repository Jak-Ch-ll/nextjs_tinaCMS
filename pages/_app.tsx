import { AppProps } from "next/dist/next-server/lib/router/router";
import { Banner } from "../components/Banner";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Banner />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
