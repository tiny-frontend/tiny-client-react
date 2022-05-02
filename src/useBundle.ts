import { useEffect, useState } from "react";

import { BackoffOptions, BundleLoader } from "./types";

interface UseBundleProps<T> {
  loader: BundleLoader<T>;
  options?: BackoffOptions;
}

const wait = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const fetchRetry = async <T>({
  loader,
  options,
}: {
  loader: BundleLoader<T>;
  options: BackoffOptions;
}): Promise<T | undefined> => {
  const { retryAttempts, delay } = options;
  const onError = (error: Error) => {
    const triesLeft = retryAttempts - 1;
    if (!triesLeft) {
      throw error;
    }

    return wait(delay).then(() =>
      fetchRetry({
        options: {
          delay: Math.pow(delay, 2),
          retryAttempts: triesLeft,
        },
        loader,
      })
    );
  };
  try {
    return await loader();
  } catch (error) {
    return onError(error as Error);
  }
};

export const useBundle = <T>({ loader, options }: UseBundleProps<T>) => {
  const [bundle, setBundle] = useState<T>();

  useEffect(() => {
    const loadBundle = async () => {
      let remoteBundle;
      if (options) {
        remoteBundle = await fetchRetry({ loader, options });
      } else {
        remoteBundle = await loader();
      }
      setBundle(() => <T>remoteBundle);
    };
    loadBundle();
  }, [loader, options]);
  return bundle;
};
