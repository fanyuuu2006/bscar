export const fetcher = async <T,>(...arg: Parameters<typeof fetch>) =>
  fetch(...arg).then((res) => {
    return res.json() as Promise<T>;
  });
