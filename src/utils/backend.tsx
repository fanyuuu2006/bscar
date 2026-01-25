import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { fetcher } from "./fetcher";
import { MyResponse } from "@/types";
import { Info, SupabaseLocation, SupabaseService, TimeSlot } from "@/types";

export const getLocations = async () =>
  fetcher<MyResponse<SupabaseLocation[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/locations`,
  );

export const getLocationById = async (id: SupabaseLocation["id"]) =>
  fetcher<MyResponse<SupabaseLocation>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/locations/${id}`,
  );

export const getServices = async () =>
  fetcher<MyResponse<SupabaseService[]>>(`${NEXT_PUBLIC_BACKEND_URL}/v1/data/services`);

export const getServiceById = async (id: SupabaseService["id"]) =>
  fetcher<MyResponse<SupabaseService>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/services/${id}`,
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

export const postBooking = async (body: {
  location_id: SupabaseLocation["id"];
  service_id: SupabaseService["id"];
  time: string;
  info: Info;
}) => {
  return fetcher<MyResponse<null>>(
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
