import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { fetcher } from "./fetcher";
import { MyResponse } from "@/types";
import { Info, Location, Service, TimeSlot } from "@/types";

export const getLocations = async () =>
  fetcher<MyResponse<Location[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/locations`,
  );

export const getLocationById = async (id: Location["id"]) =>
  fetcher<MyResponse<Location>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/locations/${id}`,
  );

export const getServices = async () =>
  fetcher<MyResponse<Service[]>>(`${NEXT_PUBLIC_BACKEND_URL}/v1/data/services`);

export const getServiceById = async (id: Service["id"]) =>
  fetcher<MyResponse<Service>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/services/${id}`,
  );

export const getAvailableSlots = async (
  date: string,
  location_id: Location["id"],
  service_id: Service["id"],
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
  location_id: Location["id"];
  service_id: Service["id"];
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
