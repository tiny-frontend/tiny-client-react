import React, { ComponentType, HTMLAttributes } from "react";

import { BundleLoader } from "./types";
import { useBundle } from "./useBundle";

// The withHydrationSuppress HOC will prevent React from hydrating any SSR HTML until a client side
// component, received from a bundle, is made available.

// This is achieved by falling back to an empty element with suppressHydrationWarning enabled.
// You can find the documentation for suppressHydrationWarning at https://reactjs.org/docs/dom-elements.html#suppresshydrationwarning.
// RootElement has to be the same element type as the root of the loaded component!

// We got the idea from https://github.com/valcol/react-hydration-on-demand, but as the library provided
// many other capabilities that we don't require and also a big package dependency, we ported just the
// needed code.

export const withHydrationSuppress = function <T>(
  loader: BundleLoader<ComponentType<T>>,
  id?: HTMLAttributes<T>["id"]
) {
  let element;
  if (typeof window !== "undefined" && id) {
    element = document?.getElementById(id)?.children[0].outerHTML;
  }

  // eslint-disable-next-line react/display-name
  return ({ ...props }: T) => {
    const Component = useBundle<ComponentType<T>>({
      loader,
    });

    return Component ? (
      <Component {...props} />
    ) : (
      <div
        dangerouslySetInnerHTML={{
          __html: element ?? "",
        }}
        suppressHydrationWarning={true}
      />
    );
  };
};
