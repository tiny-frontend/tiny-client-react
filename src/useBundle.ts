import { useEffect, useState } from "react";

import { BundleLoader } from "./types";

interface UseBundleProps<T> {
  loader: BundleLoader<T>;
}

export const useBundle = <T>({ loader }: UseBundleProps<T>) => {
  const [bundle, setBundle] = useState<T>();

  useEffect(() => {
    const loadBundle = async () => {
      const remoteBundle = await loader();
      setBundle(() => <T>remoteBundle);
    };
    loadBundle();
  }, [loader]);

  return bundle;
};
