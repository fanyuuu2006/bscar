export type MyResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | undefined;
};


export type Location = {
  id: string;
  city: string;
  branch: string;
  address: string;
  open_time: string;
  close_time: string;
  image_url: string | undefined;
};

export type Service = {
  id: string;
  name: string;
  duration: number;
  description: string | undefined;
  image_url: string | undefined;
};

export type TimeSlot = {
  start_time: `${number}:${number}:${number}`;
};

export type Info = {
  name: string;
  phone: string;
  email: string;
};