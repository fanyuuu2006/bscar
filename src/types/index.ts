export type MyResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | undefined;
};
