"use client";

import { useBookingData } from "@/hooks/useBookingData";
import { bookingSteps } from "@/libs/booking";
import { BookingStep } from "@/types";
import { getDisplayValue } from "@/utils/booking";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

type StepNavigatorProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;


export const StepNavigator = ({ className, ...rest }: StepNavigatorProps) => {
  const router = useRouter();
  const data = useBookingData();

  const currentStepValue: BookingStep = useMemo(() => {
    if (data.time) return "info";
    if (data.service) return "time";
    if (data.location) return "service";
    return "location";
  }, [data.location, data.service, data.time]);

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
          if (data.location) router.push(`/booking/${data.location.id}`);
          break;
        case "time":
          // 如果已經選擇了地點和服務，則允許跳轉到選擇時間頁面
          if (data.location && data.service)
            router.push(`/booking/${data.location.id}/${data.service.id}`);
          break;
        case "info":
          // 如果已經選擇了地點、服務和時間，則允許跳轉到填寫資訊頁面
          if (data.location && data.service && data.time)
            router.push(`/booking/${data.location.id}/${data.service.id}/${data.time}`);
          break;
        default:
          break;
      }
    },
    [router, data],
  );

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
        const displayValue = data[step.value]
          ? getDisplayValue(step.value, data[step.value]!)
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
