"use client";
import { SupabaseLocation, SupabaseService } from "@/types";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/utils/className";
import { LoadingOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type ServiceDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    services: SupabaseService[];
    locationId: SupabaseLocation["id"];
  }
>;
export const ServiceDiv = ({
  services,
  locationId,
  className,
  ...rest
}: ServiceDivProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6",
        className,
      )}
      {...rest}
    >
      {services.length > 0 ? (
        services.map((item) => {
          return (
            <ServiceCard key={item.id} item={item} locationId={locationId} />
          );
        })
      ) : (
        <div className="col-span-full text-center text-(--muted)">
          <LoadingOutlined className="text-2xl" />
        </div>
      )}
    </div>
  );
};

type ServiceCardProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    locationId: SupabaseLocation["id"];
    item: SupabaseService;
  }
>;
const ServiceCard = ({
  item,
  locationId,
  className,
  ...rest
}: ServiceCardProps) => {
  const router = useRouter();
  const modal = useModal({});

  const handleSelectService = useCallback(() => {
    router.push(`/booking/${locationId}/${item.id}`);
  }, [locationId, item, router]);

  return (
    <>
      <div
        className={cn(
          "card flex flex-col overflow-hidden rounded-2xl",
          className,
        )}
        {...rest}
      >
        <div className="w-full aspect-7/5 overflow-hidden bg-black/20 flex items-center justify-center relative">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
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
              onClick={handleSelectService}
            >
              <span>選擇時間</span>
            </button>
          </div>
        </div>
      </div>
      {/* 服務詳情彈跳窗 */}
      <modal.Container className="flex items-center justify-center p-4 z-50 animate-appear">
        <div className="card w-full max-w-lg rounded-2xl flex flex-col max-h-[85vh]">
          {/* 標題與關閉 */}
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold">{item.name}</h3>
          </div>

          {/* 內容區域 */}
          <div className="p-4 overflow-y-auto flex-1">
            {item.image_url && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
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
              onClick={handleSelectService}
            >
              選擇此服務
            </button>
          </div>
        </div>
      </modal.Container>
    </>
  );
};
