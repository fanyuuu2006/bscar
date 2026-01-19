export const fetcher = async <T,>(...arg: Parameters<typeof fetch>) =>
  fetch(...arg).then((res) => res.json() as Promise<T>);
