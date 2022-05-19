import { render } from "@testing-library/react";
import { TinyFrontendSsrConfig } from "@tiny-frontend/client";
import React from "react";

import { TinyHead } from "./TinyHead";

const renderTinyHead = (config?: Partial<TinyFrontendSsrConfig>) => {
  const mergedConfig = {
    jsBundle: "http://some-js-url.xyz/",
    moduleConfigScript: `window["tinyFrontendFrontendConfig"] = {"umdBundle":"some-umd.js","cssBundle":"some-css.css"}`,
    cssBundle: "http://some-css-url.xyz/",
    ...config,
  };

  return render(<TinyHead config={mergedConfig} />);
};

describe("[TinyHead]", () => {
  describe("cssBundle", () => {
    it("should render a link with the provided cssBundle", () => {
      const expected = "http://other-css-url.css/";
      const { container } = renderTinyHead({ cssBundle: expected });

      const link = container.querySelector(
        "link[rel=stylesheet]"
      ) as HTMLLinkElement;
      const result = link.href;

      expect(result).toBe(expected);
    });

    describe("when there is not a cssBundle", () => {
      it("should not render a link with the provided cssBundle", () => {
        const { container } = renderTinyHead({ cssBundle: undefined });

        const result = container.querySelector(
          "link[rel=stylesheet]"
        ) as HTMLLinkElement;

        expect(result).toBe(null);
      });
    });
  });
  describe("jsBundle", () => {
    it("should render a link with the provided jsBundle", () => {
      const expected = "http://other-js-url.js/";
      const { container } = renderTinyHead({ jsBundle: expected });

      const link = container.querySelector("link[as=script]") as HTMLLinkElement;
      const result = link.href;

      expect(result).toBe(expected);
    });
  });
  describe("moduleConfigScript", () => {
    it("should render a script with the provided module config script", () => {
      const expected = `window["anotherTinyFrontendFrontendConfig"] = {"umdBundle":"some-other-umd.js","cssBundle":"some-other-css.css"}`;
      const { container } = renderTinyHead({ moduleConfigScript: expected });

      const link = container.querySelector("script") as HTMLScriptElement;
      const result = link.textContent;

      expect(result).toBe(expected);
    });
  });
});
