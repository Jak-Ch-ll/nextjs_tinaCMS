import { render } from "@testing-library/react";
import React from "react";

import TinaPage from "./index.page";

describe("_app.page.tsx", () => {
  it.skip("should have exactly 1 main section", () => {
    const { getByRole } = render(<TinaPage />);
    const main = getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
