import Home from "./index";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("The Home Page Component", () => {
  it("should have exactly 1 main section", () => {
    const { getByRole } = render(<Home />);
    const main = getByRole("main");

    expect(main).toBeInTheDocument();

    // expect(2).toBe(2);
  });
});
