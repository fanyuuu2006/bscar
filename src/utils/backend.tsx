import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { fetcher } from "./fetcher";
import { MyResponse, SupabaseAdmin, SupabaseBooking } from "@/types";
import { Info, SupabaseLocation, SupabaseService, TimeSlot } from "@/types";

export const getLocations = async () =>
  fetcher<MyResponse<SupabaseLocation[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/location`,
  );

export const getLocationById = async (id: SupabaseLocation["id"]) =>
  fetcher<MyResponse<SupabaseLocation>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/location/${id}`,
  );

export const getServices = async () =>
  fetcher<MyResponse<SupabaseService[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/service`,
  );

export const getServiceById = async (id: SupabaseService["id"]) =>
  fetcher<MyResponse<SupabaseService>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/service/${id}`,
  );

export const getAvailableSlots = async (
  date: string,
  location_id: SupabaseLocation["id"],
  service_id: SupabaseService["id"],
) => {
  const queryParams = new URLSearchParams({
    date,
    location_id,
    service_id,
  });
  return fetcher<MyResponse<TimeSlot[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/booking/available-slots?${queryParams.toString()}`,
  );
};

export const getBookingById = async (id: SupabaseBooking["id"]) => {
  return fetcher<MyResponse<SupabaseBooking>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/booking/${id}`,
  );
};

export const postBooking = async (body: {
  location_id: SupabaseLocation["id"];
  service_id: SupabaseService["id"];
  time: string;
  info: Info;
}) => {
  return fetcher<MyResponse<SupabaseBooking>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/booking`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
};

export const getAdminMe = async (token: string) => {
  return fetcher<MyResponse<SupabaseAdmin>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const adminLogin = async (body: {
  id: SupabaseAdmin["id"];
  password: SupabaseAdmin["password"];
}) => {
  return fetcher<MyResponse<string>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
};

export const bookingsByAdmin = async (
  token: string,
  query?: Partial<{
    page: number;
    count: number;
    status: SupabaseBooking["status"];
    service_id: SupabaseService["id"];
    date: string;
  }>,
) => {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v || (v != null && v !== "")) params.append(k, String(v));
  });

  return fetcher<MyResponse<SupabaseBooking[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/booking?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const updateBookingByAdmin = async (
  token: string,
  booking: SupabaseBooking,
) => {
  return fetcher<MyResponse<SupabaseBooking>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/booking/${booking.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(booking),
    },
  );
};

export const updateAdmin = async (token: string, admin: SupabaseAdmin) => {
  return fetcher<MyResponse<SupabaseAdmin>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/me`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(admin),
    },
  );
};

export const updateLocationByAdmin = async (
  token: string,
  location: SupabaseLocation,
) => {
  return fetcher<MyResponse<SupabaseLocation>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/admin/location`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(location),
    },
  );
};
