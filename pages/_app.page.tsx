import { AppProps } from "next/dist/next-server/lib/router/router";
import { TinaCMS, TinaProvider } from "tinacms";
import { Banner } from "../components/Banner";
import { ImageStore } from "../ImageStore/ImageStore";
import "../styles/globals.scss";

function App({ Component, pageProps }: AppProps) {
  const cms = new TinaCMS({
    enabled: true,
    sidebar: {
      position: "overlay",
    },
    media: new ImageStore(),
  });

  const Tina = ({ children }: { children: JSX.Element }) => {
    if (cms.enabled) {
      return <TinaProvider cms={cms}>{children}</TinaProvider>;
    }
    return <>{children}</>;
  };

  return (
    <Tina>
      <>
        <Banner />
        <main>
          <Component {...pageProps} />
        </main>
      </>
    </Tina>
  );
}

export default App;
