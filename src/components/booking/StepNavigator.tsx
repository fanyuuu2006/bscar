"use client";

import { bookingSteps } from "@/libs/booking";
import { BookingStep, Location, Service } from "@/types";
import { getLocationById, getServiceById } from "@/utils/backend";
import { getDisplayValue } from "@/utils/booking";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type StepNavigatorProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

const INITIAL_BOOKING_DATA = {
  location: undefined,
  service: undefined,
};

export const StepNavigator = ({ className, ...rest }: StepNavigatorProps) => {
  const router = useRouter();
  const params = useParams();

  // 明確將 params 轉換為 string 或 undefined 類型
  // 這樣做是為了確保後續使用的參數類型是正確的，避免類型錯誤
  const locationId = params?.locationId as string | undefined;
  const serviceId = params?.serviceId as string | undefined;
  const time = params?.time as string | undefined;

  // 用於存儲從後端獲取的 location 和 service 的詳細資訊
  const [data, setData] = useState<{
    location: Location | undefined;
    service: Service | undefined;
  }>(INITIAL_BOOKING_DATA);

  // 直接從 URL 參數推導當前的預約步驟
  // 邏輯如下：
  // 1. 如果有 time 參數，則當前步驟為填寫資訊 (info)
  // 2. 如果只有 serviceId，則當前步驟為選擇時間 (time)
  // 3. 如果只有 locationId，則當前步驟為選擇服務 (service)
  // 4. 如果都沒有，則默認為選擇地點 (location)
  const currentStepValue: BookingStep = (() => {
    if (time) return "info";
    if (serviceId) return "time";
    if (locationId) return "service";
    return "location";
  })();

  // 獲取指定步驟在步驟列表中的索引，用於判斷步驟的順序
  const getStepIndex = (step: BookingStep) =>
    bookingSteps.findIndex((s) => s.value === step);

  // 處理點擊步驟導航時的跳轉邏輯
  // 使用 useCallback 是為了避免函式在每次重新渲染時都被重新創建
  const handleToStep = useCallback(
    (stepValue: BookingStep) => {
      switch (stepValue) {
        case "location":
          // 跳轉回選擇地點頁面
          router.push("/booking");
          break;
        case "service":
          // 如果已經選擇了地點，則允許跳轉到選擇服務頁面
          if (locationId) router.push(`/booking/${locationId}`);
          break;
        case "time":
          // 如果已經選擇了地點和服務，則允許跳轉到選擇時間頁面
          if (locationId && serviceId)
            router.push(`/booking/${locationId}/${serviceId}`);
          break;
        case "info":
          // 如果已經選擇了地點、服務和時間，則允許跳轉到填寫資訊頁面
          if (locationId && serviceId && time)
            router.push(`/booking/${locationId}/${serviceId}/${time}`);
          break;
        default:
          break;
      }
    },
    [locationId, serviceId, time, router],
  );

  // 當 locationId 改變時，獲取地點詳細資訊
  useEffect(() => {
    if (!locationId) return;

    let isMounted = true; // 用於防止組件卸載後更新狀態
    getLocationById(locationId).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        // 成功獲取地點資訊，更新狀態
        setData((prev) => ({ ...prev, location: res.data ?? undefined }));
      } else {
        // 如果獲取失敗（例如 ID 無效），跳轉回初始頁面
        router.push("/booking"); // 回退機制
      }
    });

    return () => {
      isMounted = false;
    };
  }, [locationId, router]);

  // 當 serviceId 改變時，獲取服務詳細資訊
  useEffect(() => {
    if (!serviceId) return;

    let isMounted = true; // 用於防止組件卸載後更新狀態
    getServiceById(serviceId).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        // 成功獲取服務資訊，更新狀態
        setData((prev) => ({ ...prev, service: res.data ?? undefined }));
      } else {
        // 如果服務獲取失敗，回退到選擇服務頁面（如果已有 locationId）
        if (locationId) router.push(`/booking/${locationId}`);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [serviceId, locationId, router]);

  // 在渲染期間直接推導顯示數據
  // 這避免了在 useEffect 中設置狀態導致的 "setting state in effect" 問題，特別是對於 'time' 這種衍生狀態
  // 如果 time 存在且有效，則將其轉換為 Date 對象
  const timeDate = time ? new Date(Number(time)) : undefined;
  const isValidTime = timeDate && !isNaN(timeDate.getTime());

  // 組裝要顯示在步驟導航上的數據
  const displayData = {
    location: locationId ? data.location : undefined, // 顯示已選地點名稱
    service: serviceId ? data.service : undefined,   // 顯示已選服務名稱
    time: isValidTime ? timeDate : undefined,        // 顯示已選時間
    info: undefined,
  };

  return (
    <div
      className={cn(
        "flex items-center gap-6 overflow-x-auto pb-4 border-b border-(--border)",
        className,
      )}
      {...rest}
    >
      {bookingSteps.map((step, index) => {
        // 獲取當前步驟應該顯示的值（例如：地點名稱、服務名稱、時間）
        const displayValue = displayData[step.value]
          ? getDisplayValue(step.value, displayData[step.value]!)
          : undefined;

        // 判斷該步驟是否為當前活躍步驟
        const isActive = currentStepValue === step.value;
        // 獲取當前活躍步驟的索引，用於判斷哪些步驟可以點擊（已完成或當前的步驟）
        const currentStepIndex = getStepIndex(currentStepValue);

        return (
          <button
            disabled={currentStepIndex < index}
            key={step.value}
            className={cn(
              `w-full h-[3em] whitespace-nowrap font-medium`,
              "flex flex-col justify-center items-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            onClick={() => {
              handleToStep(step.value);
            }}
          >
            <span
              className={cn("text-lg md:text-xl", {
                "font-extrabold": isActive,
              })}
            >
              {step.label}
            </span>
            {displayValue && (
              <span className="text-xs md:text-sm text-(--muted) mt-1 font-normal opacity-80">
                {displayValue}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
