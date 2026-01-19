import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { fetcher } from "./fetcher";
import { MyResponse } from "@/types";
import { Location, Service } from "@/contexts/BookingContext";

export const getLocations = async () =>
  fetcher<MyResponse<Location[]>>(
    `${NEXT_PUBLIC_BACKEND_URL}/v1/data/locations`
  );

export const getServices = async () =>
  fetcher<MyResponse<Service[]>>(`${NEXT_PUBLIC_BACKEND_URL}/v1/data/services`);
