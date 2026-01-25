"use client";
import { BookingData, SupabaseLocation, SupabaseService } from "@/types";
import { getLocationById, getServiceById } from "@/utils/backend";
import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BookingContextType = BookingData

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
const params = useParams();
  const router = useRouter();

  // 確保取得的是單一字串，處理 string[] 的邊際情況
  // Next.js 的 useParams 可能回傳 string 或 string[]，這裡統一處理為 string 或 undefined
  const locationId = Array.isArray(params?.locationId)
    ? params.locationId[0]
    : params?.locationId;
  const serviceId = Array.isArray(params?.serviceId)
    ? params.serviceId[0]
    : params?.serviceId;
  const timeStr = Array.isArray(params?.time) ? params.time[0] : params?.time;

  const [location, setLocation] = useState<SupabaseLocation | undefined>();
  const [service, setService] = useState<SupabaseService | undefined>();

  // 處理地點資料的獲取
  useEffect(() => {
    // ignore 變數用於防止 Race Condition (競態條件)
    // 當 locationId 快速變化或元件卸載時，cleanup function 會將 ignore 設為 true
    // 這樣就可以忽略舊的異步請求結果，避免狀態被錯誤覆蓋
    let ignore = false;

    if (locationId) {
      getLocationById(locationId)
        .then((res) => {
          // 如果 ignore 為 true，表示這個 effect 已經過期 (有新的 locationId 或元件已卸載)，因此不更新狀態
          if (ignore) return;
          
          if (res.success) {
            setLocation(res.data || undefined);
          } else {
            // 若 API 呼叫失敗，將地點設為 undefined 並導回訂位首頁
            setLocation(undefined);
            router.push("/booking");
          }
        })
        .catch(() => {
          if (!ignore) setLocation(undefined);
        });
    } else {
      // 如果沒有 locationId，直接重置狀態
      // 使用 setTimeout 將狀態更新移至下一個事件循環，解決 "Calling setState synchronously within an effect" 警告
      setTimeout(() => {
        if (!ignore) setLocation(undefined);
      }, 0);
    }

    // Cleanup function: 當依賴改變或元件卸載時執行
    return () => {
      ignore = true;
    };
  }, [locationId, router]);

  // 處理服務資料的獲取
  useEffect(() => {
    let ignore = false;

    if (serviceId) {
      getServiceById(serviceId)
        .then((res) => {
          if (ignore) return;

          if (res.success) {
            setService(res.data || undefined);
          } else {
            // 若找不到服務，導回該地點的頁面或訂位首頁
            setService(undefined);
            router.push(`/booking${locationId ? `/${locationId}` : ""}`);
          }
        })
        .catch(() => {
          if (!ignore) setService(undefined);
        });
    } else {
      setTimeout(() => {
        if (!ignore) setService(undefined);
      }, 0);
    }

    return () => {
      ignore = true;
    };
  }, [serviceId, router, locationId]);

  // 處理時間資料的驗證與導航 Fallback
  useEffect(() => {
    if (timeStr) {
      const timestamp = Number(timeStr);
      if (isNaN(timestamp)) {
        // 若時間格式錯誤 (非數字)，導回服務選擇頁面或當前地點頁面
        const fallbackUrl =
          locationId && serviceId
            ? `/booking/${locationId}/${serviceId}`
            : `/booking${locationId ? `/${locationId}` : ""}`;
        router.push(fallbackUrl);
      }
    }
  }, [timeStr, locationId, serviceId, router]);

  // 使用 useMemo 優化時間轉換運算
  // 只有當 timeStr 改變時才重新計算 Date 物件
  const time = useMemo(() => {
    if (!timeStr) return undefined;
    const timestamp = Number(timeStr);
    return isNaN(timestamp) ? undefined : new Date(timestamp);
  }, [timeStr]);

  const value = useMemo<BookingContextType>(
    () => ({
      location,
        service,
        time,
    }),
    [location, service, time],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking 必須在 BookingProvider 中使用");
  }
  return context;
};