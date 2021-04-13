import { render } from "@testing-library/react";
import React from "react";

import NewBlogpost from "./new.page";

describe("_app.page.tsx", () => {
  it.skip("should have exactly 1 main section", () => {
    const { getByRole } = render(<NewBlogpost />);
    const main = getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
