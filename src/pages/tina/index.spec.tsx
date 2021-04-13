import { render } from "@testing-library/react";
import React from "react";

import TinaPage from "./index.page";

const mockArticles = [
  {
    id: 1,
    title: "Some title",
    createdAt: "01/01/2021",
    updatedAt: "01/01/2021",
  },
];

describe("_app.page.tsx", () => {
  it.skip("should have exactly 1 main section", () => {
    const { getByRole } = render(<TinaPage articles={mockArticles} />);
    const main = getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
