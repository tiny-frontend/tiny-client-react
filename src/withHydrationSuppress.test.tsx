import { render, screen } from "@testing-library/react";
import React from "react";

import { withHydrationSuppress } from "./withHydrationSuppress";

const renderWithHydrationSuppress = (loader) => {
  const Component = withHydrationSuppress(loader, "div");
  return render(<Component />);
};

describe("[withHydrationSuppress]", () => {
  describe("when the loader resolves", () => {
    it("should render the result from the loader", async () => {
      const promise = Promise.resolve(() => <span>Hello from bundle!</span>);
      const loader = () => promise;

      renderWithHydrationSuppress(loader);
      const expected = await screen.findByText("Hello from bundle!");

      expect(expected).toBeInTheDocument();
    });
  });
});
