import { renderHook } from "@testing-library/react-hooks";
import React from "react";

import { useBundle } from "./useBundle";

describe("[useBundle]", () => {
  describe("when useBundle runs", () => {
    describe("and the loader call is resolved", () => {
      it("should return a bundle", async () => {
        const res = () => <div>Hello from bundle!</div>;
        const loader = () => Promise.resolve(res);

        const { result, waitForNextUpdate } = renderHook(() =>
          useBundle({ loader })
        );
        await waitForNextUpdate();

        expect(result.current).toBe(res);
      });
    });
    describe("and the loader call is rejected", () => {
      it("should return nothing", async () => {
        const loader = () => Promise.reject();

        const { result } = renderHook(() => useBundle({ loader }));
        expect(result.current).toBe(undefined);
      });
    });
  });
});
