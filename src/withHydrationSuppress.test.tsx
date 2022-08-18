import { render, screen } from "@testing-library/react";
import React from "react";

import { withHydrationSuppress } from "./withHydrationSuppress";

const id = "my-tiny-id";
const ssrContent = "Hello from SSR!";
const bundleContent = "Hello from bundle!";

const renderElement = (textContent: string) => (
  <div id={id}>
    <span>{textContent}</span>
  </div>
);

const renderWithHydrationSuppress = (loader) => {
  const Component = withHydrationSuppress(loader, id);
  return render(<Component />);
};

const hybridRender = (shouldCleanSsr: boolean) => {
  // simulate ssr render
  const { unmount } = render(renderElement(ssrContent));

  // simulate csr render
  const promise = Promise.resolve(() => renderElement(bundleContent));
  const loader = () => promise;
  renderWithHydrationSuppress(loader);

  // simulate ssr content cleanup after renderWithHydrationSuppress had run
  shouldCleanSsr && unmount();
};

describe("[withHydrationSuppress]", () => {
  describe("loader", () => {
    describe("is resolving", () => {
      it("should render the previous ssr content by fetching the element by id", async () => {
        hybridRender(false);
        expect(await screen.findByText(ssrContent)).toBeInTheDocument();
      });
      describe("is resolved", () => {
        it("should render the result from the loader", async () => {
          hybridRender(true);
          expect(await screen.findByText(ssrContent)).not.toBeInTheDocument();
          expect(await screen.findByText(bundleContent)).toBeInTheDocument();
        });
      });
    });
  });
});
