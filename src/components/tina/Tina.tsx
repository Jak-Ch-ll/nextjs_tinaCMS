import React, { ReactNode } from "react";
import { TinaCMS, TinaProvider } from "tinacms";
import { ImageStore } from "../../utils/ImageStore/ImageStore";

export interface TinaProps {
  children: ReactNode;
}

export const Tina = ({ children }: TinaProps): JSX.Element => {
  const cms = new TinaCMS({
    enabled: true,
    sidebar: {
      position: "overlay",
    },
    media: new ImageStore(),
  });

  return <TinaProvider cms={cms}>{children}</TinaProvider>;
};
