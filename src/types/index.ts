export type BundleLoader<T> = () => Promise<T>;
export type BackoffOptions = {
  delay: number;
  retryAttempts: number;
};
