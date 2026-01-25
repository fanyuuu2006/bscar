"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingData, Location, Service } from "@/types";
import { getLocationById, getServiceById } from "@/utils/backend";

export function useBookingData(): BookingData {
  const params = useParams();
  const locationId = params?.locationId as string;
  const serviceId = params?.serviceId as string;
  const timeStr = params?.time as string;

  const [location, setLocation] = useState<Location | undefined>();
  const [service, setService] = useState<Service | undefined>();

  useEffect(() => {
    if (locationId) {
      getLocationById(locationId).then((res) => setLocation(res.data || undefined))
        .catch(() => setLocation(undefined));
    } else {
      setTimeout(()=> setLocation(undefined),0);
    }
  }, [locationId]);

  useEffect(() => {
    if (serviceId) {
      getServiceById(serviceId).then((res) => setService(res.data || undefined))
        .catch(() => setService(undefined));
    } else {
      setTimeout(()=> setService(undefined),0);
    }
  }, [serviceId]);

  const time = timeStr ? new Date(Number(timeStr)) : undefined;

  return {
    location,
    service,
    time,
  };
}
