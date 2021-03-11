import { render, screen } from "@testing-library/react";
import { Banner } from "./Banner";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
}));

describe("Banner component", () => {
  beforeEach(() => {
    render(<Banner />);
  });

  it("has at exactly one banner element", () => {
    const banners = screen.getAllByRole("banner");
    expect(banners.length).toBe(1);
  });

  it("has at least one nav-element", () => {
    const nav = screen.queryByRole("navigation");

    expect(nav).toBeInTheDocument();
  });

  it("gives the active site the class styles.active and the others not", () => {
    const homeLink = screen.getByRole("link", {
      name: /home/i,
    });
    expect(homeLink).toHaveClass("active");

    const blogLink = screen.getByRole("link", {
      name: /^Blog$/i,
    });
    expect(blogLink).not.toHaveClass("active");
  });
});
