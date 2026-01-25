"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingData, Location, Service } from "@/types";
import { getLocationById, getServiceById } from "@/utils/backend";

export function useBookingData(): BookingData {
  const params = useParams();
  const router = useRouter();
  const locationId = params?.locationId as string;
  const serviceId = params?.serviceId as string;
  const timeStr = params?.time as string;

  const [location, setLocation] = useState<Location | undefined>();
  const [service, setService] = useState<Service | undefined>();

  useEffect(() => {
    if (locationId) {
      getLocationById(locationId)
        .then((res) => {
          if (res.success) {
            setLocation(res.data || undefined);
          } else {
            setLocation(undefined);
            router.push("/booking");
          }
        })
        .catch(() => setLocation(undefined));
    } else {
      setTimeout(() => setLocation(undefined), 0);
    }
  }, [locationId, router]);

  useEffect(() => {
    if (serviceId) {
      getServiceById(serviceId)
        .then((res) => {
          if (res.success) {
            setService(res.data || undefined);
          } else {
            setService(undefined);
            router.push(`/booking${locationId ? `/${locationId}` : ""}`);
          }
        })
        .catch(() => setService(undefined));
    } else {
      setTimeout(() => setService(undefined), 0);
    }
  }, [serviceId, router, locationId]);

  const time = timeStr ? new Date(Number(timeStr)) : undefined;

  return {
    location,
    service,
    time,
  };
}
