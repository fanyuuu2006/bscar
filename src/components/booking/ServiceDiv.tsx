import { useBooking } from "@/contexts/BookingContext";
import { services } from "@/libs/services";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";

type ServiceDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;
export const ServiceDiv = ({ className, ...rest }: ServiceDivProps) => {
  const booking = useBooking();
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
        className
      )}
      {...rest}
    >
      {services.map((item) => {
        return (
          <div
            key={item.id}
            className="card flex flex-col overflow-hidden rounded-2xl"
          >
            <div className="w-full aspect-video overflow-hidden bg-black/20 flex items-center justify-center relative">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                <div className="mt-2 flex flex-col gap-1.5">
                  {item.description?.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className={cn(
                        "text-sm whitespace-pre-wrap text-(--muted) leading-relaxed"
                      )}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  className="btn primary w-full font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2"
                  onClick={() => {
                    booking.setBookingData("service", item);
                    booking.nextStep();
                  }}
                >
                  <span>選擇</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
