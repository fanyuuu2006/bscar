"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { BookingData, Location, Service } from "@/types";
import { getLocationById, getServiceById } from "@/utils/backend";

export function useBookingData(): BookingData {
  const params = useParams();
  const router = useRouter();

  // 確保取得的是單一字串，處理 string[] 的邊際情況
  const locationId = Array.isArray(params?.locationId)
    ? params.locationId[0]
    : params?.locationId;
  const serviceId = Array.isArray(params?.serviceId)
    ? params.serviceId[0]
    : params?.serviceId;
  const timeStr = Array.isArray(params?.time) ? params.time[0] : params?.time;

  const [location, setLocation] = useState<Location | undefined>();
  const [service, setService] = useState<Service | undefined>();

  useEffect(() => {
    let ignore = false;

    if (locationId) {
      getLocationById(locationId)
        .then((res) => {
          if (ignore) return;
          if (res.success) {
            setLocation(res.data || undefined);
          } else {
            setLocation(undefined);
            router.push("/booking");
          }
        })
        .catch(() => {
          if (!ignore) setLocation(undefined);
        });
    } else {
      setTimeout(() => setLocation(undefined), 0);
    }

    return () => {
      ignore = true;
    };
  }, [locationId, router]);

  useEffect(() => {
    let ignore = false;

    if (serviceId) {
      getServiceById(serviceId)
        .then((res) => {
          if (ignore) return;
          if (res.success) {
            setService(res.data || undefined);
          } else {
            setService(undefined);
            router.push(`/booking${locationId ? `/${locationId}` : ""}`);
          }
        })
        .catch(() => {
          if (!ignore) setService(undefined);
        });
    } else {
      setTimeout(() => setService(undefined), 0);
    }

    return () => {
      ignore = true;
    };
  }, [serviceId, router, locationId]);

  // 使用 useMemo 優化時間轉換運算
  const time = useMemo(() => {
    if (!timeStr) return undefined;
    const timestamp = Number(timeStr);
    return isNaN(timestamp) ? undefined : new Date(timestamp);
  }, [timeStr]);

  // Memoize 回傳物件，避免使用端不必要的重新渲染
  return useMemo(
    () => ({
      location,
      service,
      time,
    }),
    [location, service, time],
  );
}
