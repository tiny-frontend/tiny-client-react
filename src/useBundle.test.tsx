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
      describe("and there are options configured", () => {
        it("should exaust retries", async () => {
          const retryAttempts = 3;
          const loader = jest.fn(() => Promise.reject("error"));

          try {
            await renderHook(() =>
              useBundle({ loader, options: { retryAttempts, delay: 200 } })
            );
          } catch (err) {
            expect(loader).toBeCalledTimes(retryAttempts);
          }
        });

        it("throws an error after exausting the retries", async () => {
          const retryAttempts = 3;
          const errorMessage = "Oh no, there was an error!";
          const loader = jest.fn(() => Promise.reject(errorMessage));

          await renderHook(() =>
            useBundle({ loader, options: { retryAttempts, delay: 200 } })
          );

          expect(loader).rejects.toThrow(errorMessage);
        });
      });
    });
  });
});
