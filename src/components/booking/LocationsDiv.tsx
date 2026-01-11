import { useBooking } from "@/contexts/BookingContext";
import { locations } from "@/libs/locations";
import { cn } from "@/utils/className";

type LocationsDivProps = React.HTMLAttributes<HTMLDivElement>;
export const LocationsDiv = ({ className, ...rest }: LocationsDivProps) => {
  const booking = useBooking();
  return (
    <div className={cn(className)} {...rest}>
      {locations.map((item) => {
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
                  alt={`${item.city} ${item.branch}`}
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
                  <span role="img">📍</span>
                  {item.city}{" "}
                  <span className="text-base font-normal text-zinc-500">|</span>{" "}
                  {item.branch}
                </h2>
                <address className="mt-2 text-sm text-(--muted) line-clamp-2">
                  {item.address}
                </address>
              </div>

              <div className="pt-2">
                <button
                  className="btn primary w-full font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2"
                  onClick={() => {
                    booking.setBookingData("location", item);
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
