import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { fetcher } from "./fetcher";
import { MyResponse } from "@/types";
import { Location, Service, TimeSlot } from "@/contexts/BookingContext";

export const getLocations = async () =>
  fetcher<MyResponse<Location[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/locations`
  );

export const getServices = async () =>
  fetcher<MyResponse<Service[]>>(`${NEXT_PUBLIC_BACKEND_URL}/v1/data/services`);

export const getAvailableSlots = async (
  date: string,
  location_id: Location["id"],
  service_id: Service["id"]
) => {
  const queryParams = new URLSearchParams({
    date,
    location_id,
    service_id,
  });
  return fetcher<MyResponse<TimeSlot[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/booking/available-slots?${queryParams.toString()}`
  );
};
