import { bookingSteps } from "../libs/booking";
export type MyResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | undefined;
};


export type Route = {
  label: string;
  url: string;
  isActive?: (path: string) => boolean;
  sub?: Route[];
};


export type SupabaseLocation = {
  id: string;
  city: string;
  branch: string;
  address: string;
  open_time: string;
  close_time: string;
  image_url: string | undefined;
  duration: number;
};

export type SupabaseService = {
  id: string;
  name: string;
  description: string | undefined;
  image_url: string | undefined;
};

export type TimeSlot = {
  start_time: `${number}:${number}:${number}`;
};

type _Info<T> = {
  [K in keyof T as K extends `customer_${infer R}` ? R : never]:
    T[K];
};
export type Info = _Info<SupabaseBooking>;

export type BookingStep = (typeof bookingSteps)[number]["value"];

export type BookingData = {
  location?: SupabaseLocation;
  service?: SupabaseService;
  time?: Date;
  info?: Info;
};

export type SupabaseBooking = {
  id: string;
  location_id: SupabaseLocation["id"];
  service_id: SupabaseService["id"];
  booking_time: string;
  created_at: string;
  customer_name: string;
  customer_line: string;
  customer_phone: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};
export type SupabaseAdmin = {
  id: string;
  password: string;
  location_id: SupabaseLocation["id"];
  account: string;
};