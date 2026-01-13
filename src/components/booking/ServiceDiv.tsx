import { Service, useBooking } from "@/contexts/BookingContext";
import { useModal } from "@/hooks/useModal";
import { services } from "@/libs/services";
import { cn } from "@/utils/className";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";
import React from "react";

type ServiceDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;
export const ServiceDiv = ({ className, ...rest }: ServiceDivProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6",
        className
      )}
      {...rest}
    >
      {services.map((item) => {
        return <ServiceCard key={item.id} item={item} />;
      })}
    </div>
  );
};

type ServiceCardProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    item: Service;
  }
>;
const ServiceCard = ({ item, className, ...rest }: ServiceCardProps) => {
  const booking = useBooking();
  const modal = useModal({});
  return (
    <>
      <div
        className={cn(
          "card flex flex-col overflow-hidden rounded-2xl",
          className
        )}
        {...rest}
      >
        <div className="w-full aspect-video overflow-hidden bg-black/20 flex items-center justify-center relative">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-(--muted) gap-2">
              <span className="text-4xl" role="img">
                🏙️
              </span>
              <span className="text-sm font-medium">暫無圖片</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-(--foreground) tracking-tight">
              {item.name}
            </h2>
          </div>

          {/* 功能按鈕區 */}
          <div className="pt-4 mt-auto grid grid-cols-2 gap-3">
            <button
              className="btn font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => {
                modal.open();
              }}
            >
              <span>查看詳情</span>
            </button>

            <button
              className="btn primary font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => {
                booking.setBookingData("service", item);
                booking.nextStep();
              }}
            >
              <span>選擇服務</span>
            </button>
          </div>
        </div>
      </div>
      {/* 服務詳情彈跳窗 */}
      <modal.Container className="flex items-center justify-center p-4 z-50">
        <div className="card w-full max-w-lg rounded-2xl flex flex-col max-h-[85vh]">
          {/* 標題與關閉 */}
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold">{item.name}</h3>
          </div>

          {/* 內容區域 */}
          <div className="p-4 overflow-y-auto flex-1">
            {item.imageUrl && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              {item.description?.split("\n").map((line, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* 底部按鈕 */}
          <div className="p-4 border-t border-white/10 grid grid-cols-2 gap-3">
            <button
              className="btn font-medium py-2.5 px-4 rounded-xl flex items-center justify-center"
              onClick={() => modal.close()}
            >
              關閉
            </button>
            <button
              className="btn primary font-bold py-2.5 px-4 rounded-xl flex items-center justify-center"
              onClick={() => {
                booking.setBookingData("service", item);
                booking.nextStep();
              }}
            >
              選擇此服務
            </button>
          </div>
        </div>
      </modal.Container>
    </>
  );
};
